"use client";

import { useEffect, useRef, useState } from "react";

/**
 * SplashCursor：鼠标跟随流体烟雾（MetaSight 同款 WebGL 流体模拟）
 *
 * 基于 Pavel Dobryakov 的 WebGL-Fluid-Simulation（MIT），
 * 参数与 metasight.cloud 的 HeroSplashCursor 一致：
 * SIM 80 / DYE 512 / CURL 2 / SPLAT_RADIUS 0.1 / SPLAT_FORCE 3000
 * DENSITY_DISSIPATION 1.5 / VELOCITY_DISSIPATION 0.5 / PRESSURE 0 / SHADING
 *
 * 差异点：色相锁定在蓝→紫区间循环（品牌色板，规避黄/橙/红）。
 * 触屏设备与 prefers-reduced-motion 下不渲染。
 */

type ColorRGB = { r: number; g: number; b: number };

type Pointer = {
  texcoordX: number;
  texcoordY: number;
  prevTexcoordX: number;
  prevTexcoordY: number;
  deltaX: number;
  deltaY: number;
  moved: boolean;
  color: ColorRGB;
};

const CONFIG = {
  SIM_RESOLUTION: 80,
  DYE_RESOLUTION: 512,
  DENSITY_DISSIPATION: 1.5,
  VELOCITY_DISSIPATION: 0.5,
  PRESSURE: 0,
  PRESSURE_ITERATIONS: 3,
  CURL: 2,
  SPLAT_RADIUS: 0.1,
  SPLAT_FORCE: 3000,
  SHADING: true,
  MOVE_THRESHOLD: 0.01,
};

/* ───────────────────────── shader 源码 ───────────────────────── */

const BASE_VERTEX = `
precision highp float;
attribute vec2 aPosition;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform vec2 texelSize;
void main () {
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const COPY_FRAG = `
precision mediump float;
precision mediump sampler2D;
varying highp vec2 vUv;
uniform sampler2D uTexture;
void main () {
  gl_FragColor = texture2D(uTexture, vUv);
}
`;

const CLEAR_FRAG = `
precision mediump float;
precision mediump sampler2D;
varying highp vec2 vUv;
uniform sampler2D uTexture;
uniform float value;
void main () {
  gl_FragColor = value * texture2D(uTexture, vUv);
}
`;

const DISPLAY_FRAG = `
precision highp float;
precision highp sampler2D;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uTexture;
uniform vec2 texelSize;
void main () {
  vec3 c = texture2D(uTexture, vUv).rgb;
#ifdef SHADING
  vec3 lc = texture2D(uTexture, vL).rgb;
  vec3 rc = texture2D(uTexture, vR).rgb;
  vec3 tc = texture2D(uTexture, vT).rgb;
  vec3 bc = texture2D(uTexture, vB).rgb;
  float dx = length(rc) - length(lc);
  float dy = length(tc) - length(bc);
  vec3 n = normalize(vec3(dx, dy, length(texelSize)));
  vec3 l = vec3(0.0, 0.0, 1.0);
  float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
  c *= diffuse;
#endif
  float a = max(c.r, max(c.g, c.b));
  gl_FragColor = vec4(c, a);
}
`;

const SPLAT_FRAG = `
precision highp float;
precision highp sampler2D;
varying vec2 vUv;
uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec3 color;
uniform vec2 point;
uniform float radius;
void main () {
  vec2 p = vUv - point.xy;
  p.x *= aspectRatio;
  vec3 splat = exp(-dot(p, p) / radius) * color;
  vec3 base = texture2D(uTarget, vUv).xyz;
  gl_FragColor = vec4(base + splat, 1.0);
}
`;

const ADVECTION_FRAG = `
precision highp float;
precision highp sampler2D;
varying vec2 vUv;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform vec2 dyeTexelSize;
uniform float dt;
uniform float dissipation;
vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
  vec2 st = uv / tsize - 0.5;
  vec2 iuv = floor(st);
  vec2 fuv = fract(st);
  vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
  vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
  vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
  vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
  return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
}
void main () {
#ifdef MANUAL_FILTERING
  vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
  vec4 result = bilerp(uSource, coord, dyeTexelSize);
#else
  vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
  vec4 result = texture2D(uSource, coord);
#endif
  float decay = 1.0 + dissipation * dt;
  gl_FragColor = result / decay;
}
`;

const DIVERGENCE_FRAG = `
precision mediump float;
precision mediump sampler2D;
varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uVelocity;
void main () {
  float L = texture2D(uVelocity, vL).x;
  float R = texture2D(uVelocity, vR).x;
  float T = texture2D(uVelocity, vT).y;
  float B = texture2D(uVelocity, vB).y;
  vec2 C = texture2D(uVelocity, vUv).xy;
  if (vL.x < 0.0) { L = -C.x; }
  if (vR.x > 1.0) { R = -C.x; }
  if (vT.y > 1.0) { T = -C.y; }
  if (vB.y < 0.0) { B = -C.y; }
  float div = 0.5 * (R - L + T - B);
  gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
}
`;

const CURL_FRAG = `
precision mediump float;
precision mediump sampler2D;
varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uVelocity;
void main () {
  float L = texture2D(uVelocity, vL).y;
  float R = texture2D(uVelocity, vR).y;
  float T = texture2D(uVelocity, vT).x;
  float B = texture2D(uVelocity, vB).x;
  float vorticity = R - L - T + B;
  gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
}
`;

const VORTICITY_FRAG = `
precision highp float;
precision highp sampler2D;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float curl;
uniform float dt;
void main () {
  float L = texture2D(uCurl, vL).x;
  float R = texture2D(uCurl, vR).x;
  float T = texture2D(uCurl, vT).x;
  float B = texture2D(uCurl, vB).x;
  float C = texture2D(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= curl * C;
  force.y *= -1.0;
  vec2 velocity = texture2D(uVelocity, vUv).xy;
  velocity += force * dt;
  velocity = min(max(velocity, -1000.0), 1000.0);
  gl_FragColor = vec4(velocity, 0.0, 1.0);
}
`;

const PRESSURE_FRAG = `
precision mediump float;
precision mediump sampler2D;
varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
void main () {
  float L = texture2D(uPressure, vL).x;
  float R = texture2D(uPressure, vR).x;
  float T = texture2D(uPressure, vT).x;
  float B = texture2D(uPressure, vB).x;
  float divergence = texture2D(uDivergence, vUv).x;
  float pressure = (L + R + B + T - divergence) * 0.25;
  gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
}
`;

const GRADIENT_SUBTRACT_FRAG = `
precision mediump float;
precision mediump sampler2D;
varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
void main () {
  float L = texture2D(uPressure, vL).x;
  float R = texture2D(uPressure, vR).x;
  float T = texture2D(uPressure, vT).x;
  float B = texture2D(uPressure, vB).x;
  vec2 velocity = texture2D(uVelocity, vUv).xy;
  velocity.xy -= vec2(R - L, T - B);
  gl_FragColor = vec4(velocity, 0.0, 1.0);
}
`;

/* ───────────────────────── 组件 ───────────────────────── */

export function SplashCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    if (!canvasRef.current) return;
    // 非空断言别名：保证嵌套闭包中拿到非空类型
    const canvas = canvasRef.current as HTMLCanvasElement;

    /* ── WebGL 上下文与纹理格式探测 ── */
    const params: WebGLContextAttributes = {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false,
    };
    let gl = canvas.getContext("webgl2", params) as WebGL2RenderingContext | null;
    const isWebGL2 = !!gl;
    if (!gl) {
      gl = (canvas.getContext("webgl", params) ||
        canvas.getContext("experimental-webgl", params)) as WebGL2RenderingContext | null;
    }
    if (!gl) return;

    let halfFloat: OES_texture_half_float | null = null;
    let supportLinearFiltering = false;
    if (isWebGL2) {
      gl.getExtension("EXT_color_buffer_float");
      supportLinearFiltering = !!gl.getExtension("OES_texture_float_linear");
    } else {
      halfFloat = gl.getExtension("OES_texture_half_float");
      supportLinearFiltering = !!gl.getExtension("OES_texture_half_float_linear");
      if (!halfFloat) return;
    }
    const halfFloatTexType = isWebGL2
      ? (gl as WebGL2RenderingContext).HALF_FLOAT
      : (halfFloat as OES_texture_half_float).HALF_FLOAT_OES;

    function supportRenderTextureFormat(
      internalFormat: number,
      format: number,
      type: number,
    ): boolean {
      const texture = gl!.createTexture();
      gl!.bindTexture(gl!.TEXTURE_2D, texture);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.NEAREST);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.NEAREST);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
      gl!.texImage2D(gl!.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
      const fbo = gl!.createFramebuffer();
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo);
      gl!.framebufferTexture2D(
        gl!.FRAMEBUFFER,
        gl!.COLOR_ATTACHMENT0,
        gl!.TEXTURE_2D,
        texture,
        0,
      );
      return gl!.checkFramebufferStatus(gl!.FRAMEBUFFER) === gl!.FRAMEBUFFER_COMPLETE;
    }

    function getSupportedFormat(
      internalFormat: number,
      format: number,
      type: number,
    ): { internalFormat: number; format: number } | null {
      if (!supportRenderTextureFormat(internalFormat, format, type)) {
        if (isWebGL2) {
          const gl2 = gl as WebGL2RenderingContext;
          if (internalFormat === gl2.R16F)
            return getSupportedFormat(gl2.RG16F, gl2.RG, type);
          if (internalFormat === gl2.RG16F)
            return getSupportedFormat(gl2.RGBA16F, gl2.RGBA, type);
        }
        return null;
      }
      return { internalFormat, format };
    }

    const gl2 = gl as WebGL2RenderingContext;
    const formatRGBA = isWebGL2
      ? getSupportedFormat(gl2.RGBA16F, gl2.RGBA, halfFloatTexType)
      : getSupportedFormat(gl.RGBA, gl.RGBA, halfFloatTexType);
    const formatRG = isWebGL2
      ? getSupportedFormat(gl2.RG16F, gl2.RG, halfFloatTexType)
      : formatRGBA;
    const formatR = isWebGL2
      ? getSupportedFormat(gl2.R16F, gl2.RED, halfFloatTexType)
      : formatRGBA;
    if (!formatRGBA || !formatRG || !formatR) return;

    /* ── shader 编译 ── */
    function compileShader(type: number, source: string, keywords?: string[]) {
      let src = source;
      if (keywords) {
        src = keywords.map((k) => `#define ${k}\n`).join("") + src;
      }
      const shader = gl!.createShader(type)!;
      gl!.shaderSource(shader, src);
      gl!.compileShader(shader);
      return shader;
    }

    const baseVertex = compileShader(gl.VERTEX_SHADER, BASE_VERTEX);
    const displayVertex = compileShader(gl.VERTEX_SHADER, BASE_VERTEX);

    function createProgram(vs: WebGLShader, fs: WebGLShader) {
      const program = gl!.createProgram()!;
      gl!.attachShader(program, vs);
      gl!.attachShader(program, fs);
      gl!.bindAttribLocation(program, 0, "aPosition");
      gl!.linkProgram(program);
      return program;
    }

    function getUniforms(program: WebGLProgram) {
      const uniforms: Record<string, WebGLUniformLocation | null> = {};
      const count = gl!.getProgramParameter(program, gl!.ACTIVE_UNIFORMS) as number;
      for (let i = 0; i < count; i++) {
        const info = gl!.getActiveUniform(program, i);
        if (!info) continue;
        uniforms[info.name] = gl!.getUniformLocation(program, info.name);
      }
      return uniforms;
    }

    class Program {
      uniforms: Record<string, WebGLUniformLocation | null>;
      program: WebGLProgram;
      constructor(vs: WebGLShader, fs: WebGLShader) {
        this.program = createProgram(vs, fs);
        this.uniforms = getUniforms(this.program);
      }
      bind() {
        gl!.useProgram(this.program);
      }
    }

    const copyProgram = new Program(baseVertex, compileShader(gl.FRAGMENT_SHADER, COPY_FRAG));
    const clearProgram = new Program(baseVertex, compileShader(gl.FRAGMENT_SHADER, CLEAR_FRAG));
    const displayProgram = new Program(
      displayVertex,
      compileShader(gl.FRAGMENT_SHADER, DISPLAY_FRAG, CONFIG.SHADING ? ["SHADING"] : undefined),
    );
    const splatProgram = new Program(baseVertex, compileShader(gl.FRAGMENT_SHADER, SPLAT_FRAG));
    const advectionProgram = new Program(
      baseVertex,
      compileShader(
        gl.FRAGMENT_SHADER,
        ADVECTION_FRAG,
        supportLinearFiltering ? undefined : ["MANUAL_FILTERING"],
      ),
    );
    const divergenceProgram = new Program(baseVertex, compileShader(gl.FRAGMENT_SHADER, DIVERGENCE_FRAG));
    const curlProgram = new Program(baseVertex, compileShader(gl.FRAGMENT_SHADER, CURL_FRAG));
    const vorticityProgram = new Program(baseVertex, compileShader(gl.FRAGMENT_SHADER, VORTICITY_FRAG));
    const pressureProgram = new Program(baseVertex, compileShader(gl.FRAGMENT_SHADER, PRESSURE_FRAG));
    const gradientSubtractProgram = new Program(
      baseVertex,
      compileShader(gl.FRAGMENT_SHADER, GRADIENT_SUBTRACT_FRAG),
    );

    /* ── 全屏 quad blit ── */
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
      gl.STATIC_DRAW,
    );
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array([0, 1, 2, 0, 2, 3]),
      gl.STATIC_DRAW,
    );
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    function blit(target: FBO | null) {
      if (target === null) {
        gl!.viewport(0, 0, gl!.drawingBufferWidth, gl!.drawingBufferHeight);
        gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
      } else {
        gl!.viewport(0, 0, target.width, target.height);
        gl!.bindFramebuffer(gl!.FRAMEBUFFER, target.fbo);
      }
      gl!.drawElements(gl!.TRIANGLES, 6, gl!.UNSIGNED_SHORT, 0);
    }

    /* ── FBO ── */
    type FBO = {
      texture: WebGLTexture;
      fbo: WebGLFramebuffer;
      width: number;
      height: number;
      texelSizeX: number;
      texelSizeY: number;
      attach: (id: number) => number;
    };
    type DoubleFBO = {
      width: number;
      height: number;
      texelSizeX: number;
      texelSizeY: number;
      read: FBO;
      write: FBO;
      swap: () => void;
    };

    function createFBO(
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      filter: number,
    ): FBO {
      gl!.activeTexture(gl!.TEXTURE0);
      const texture = gl!.createTexture()!;
      gl!.bindTexture(gl!.TEXTURE_2D, texture);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, filter);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, filter);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
      gl!.texImage2D(gl!.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);
      const fbo = gl!.createFramebuffer()!;
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo);
      gl!.framebufferTexture2D(
        gl!.FRAMEBUFFER,
        gl!.COLOR_ATTACHMENT0,
        gl!.TEXTURE_2D,
        texture,
        0,
      );
      gl!.viewport(0, 0, w, h);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      return {
        texture,
        fbo,
        width: w,
        height: h,
        texelSizeX: 1 / w,
        texelSizeY: 1 / h,
        attach(id: number) {
          gl!.activeTexture(gl!.TEXTURE0 + id);
          gl!.bindTexture(gl!.TEXTURE_2D, texture);
          return id;
        },
      };
    }

    function createDoubleFBO(
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      filter: number,
    ): DoubleFBO {
      let fbo1 = createFBO(w, h, internalFormat, format, type, filter);
      let fbo2 = createFBO(w, h, internalFormat, format, type, filter);
      return {
        width: w,
        height: h,
        texelSizeX: fbo1.texelSizeX,
        texelSizeY: fbo1.texelSizeY,
        get read() {
          return fbo1;
        },
        set read(value) {
          fbo1 = value;
        },
        get write() {
          return fbo2;
        },
        set write(value) {
          fbo2 = value;
        },
        swap() {
          const temp = fbo1;
          fbo1 = fbo2;
          fbo2 = temp;
        },
      };
    }

    function resizeFBO(
      target: FBO,
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      filter: number,
    ): FBO {
      const newFBO = createFBO(w, h, internalFormat, format, type, filter);
      copyProgram.bind();
      gl!.uniform1i(copyProgram.uniforms.uTexture!, target.attach(0));
      blit(newFBO);
      return newFBO;
    }

    function resizeDoubleFBO(
      target: DoubleFBO,
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      filter: number,
    ): DoubleFBO {
      if (target.width === w && target.height === h) return target;
      target.read = resizeFBO(target.read, w, h, internalFormat, format, type, filter);
      target.write = createFBO(w, h, internalFormat, format, type, filter);
      target.width = w;
      target.height = h;
      target.texelSizeX = 1 / w;
      target.texelSizeY = 1 / h;
      return target;
    }

    let dye: DoubleFBO | null = null;
    let velocity: DoubleFBO | null = null;
    let divergence: FBO | null = null;
    let curl: FBO | null = null;
    let pressure: DoubleFBO | null = null;

    function getResolution(resolution: number) {
      let aspectRatio = gl!.drawingBufferWidth / gl!.drawingBufferHeight;
      if (aspectRatio < 1) aspectRatio = 1 / aspectRatio;
      const min = Math.round(resolution);
      const max = Math.round(resolution * aspectRatio);
      if (gl!.drawingBufferWidth > gl!.drawingBufferHeight)
        return { width: max, height: min };
      return { width: min, height: max };
    }

    function initFramebuffers() {
      const simRes = getResolution(CONFIG.SIM_RESOLUTION);
      const dyeRes = getResolution(CONFIG.DYE_RESOLUTION);
      const texType = halfFloatTexType;
      const rgba = formatRGBA!;
      const rg = formatRG!;
      const r = formatR!;
      const filtering = supportLinearFiltering ? gl!.LINEAR : gl!.NEAREST;
      gl!.disable(gl!.BLEND);

      dye = dye
        ? resizeDoubleFBO(dye, dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering)
        : createDoubleFBO(dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);
      velocity = velocity
        ? resizeDoubleFBO(velocity, simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering)
        : createDoubleFBO(simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);

      divergence = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl!.NEAREST);
      curl = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl!.NEAREST);
      pressure = createDoubleFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl!.NEAREST);
    }

    /* ── 指针 ── */
    const pointer: Pointer = {
      texcoordX: 0,
      texcoordY: 0,
      prevTexcoordX: 0,
      prevTexcoordY: 0,
      deltaX: 0,
      deltaY: 0,
      moved: false,
      color: { r: 0.06, g: 0.05, b: 0.15 },
    };

    // 色相在蓝(≈0.58)→紫(≈0.78)区间缓慢循环，乘 0.15 保持雾感淡雅
    let huePhase = Math.random() * Math.PI * 2;
    function updatePointerColor(dt: number) {
      huePhase += dt * (Math.PI * 2) * 0.05; // ~20s 一个循环
      const hue = 0.68 + 0.1 * Math.sin(huePhase); // 0.58 蓝 ↔ 0.78 紫
      const s = 0.85;
      const v = 1;
      const i = Math.floor(hue * 6);
      const f = hue * 6 - i;
      const p = v * (1 - s);
      const q = v * (1 - f * s);
      const t = v * (1 - (1 - f) * s);
      let rgb: [number, number, number];
      switch (i % 6) {
        case 0: rgb = [v, t, p]; break;
        case 1: rgb = [q, v, p]; break;
        case 2: rgb = [p, v, t]; break;
        case 3: rgb = [p, q, v]; break;
        case 4: rgb = [t, p, v]; break;
        default: rgb = [v, p, q];
      }
      pointer.color.r = rgb[0] * 0.15;
      pointer.color.g = rgb[1] * 0.15;
      pointer.color.b = rgb[2] * 0.15;
    }

    function correctDeltaX(delta: number) {
      const aspectRatio = canvas.width / canvas.height;
      if (aspectRatio < 1) delta *= aspectRatio;
      return delta;
    }
    function correctDeltaY(delta: number) {
      const aspectRatio = canvas.width / canvas.height;
      if (aspectRatio > 1) delta /= aspectRatio;
      return delta;
    }

    function onPointerMove(e: PointerEvent) {
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
      pointer.texcoordX = e.clientX / canvas.clientWidth;
      pointer.texcoordY = 1 - e.clientY / canvas.clientHeight;
      pointer.deltaX = correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX);
      pointer.deltaY = correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY);
      pointer.moved =
        Math.abs(pointer.deltaX) > CONFIG.MOVE_THRESHOLD ||
        Math.abs(pointer.deltaY) > CONFIG.MOVE_THRESHOLD;
    }
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    /* ── 模拟步进 ── */
    function splat(x: number, y: number, dx: number, dy: number, color: ColorRGB) {
      splatProgram.bind();
      gl!.uniform1i(splatProgram.uniforms.uTarget!, velocity!.read.attach(0));
      gl!.uniform1f(splatProgram.uniforms.aspectRatio!, canvas.width / canvas.height);
      gl!.uniform2f(splatProgram.uniforms.point!, x, y);
      gl!.uniform3f(splatProgram.uniforms.color!, dx, dy, 0);
      gl!.uniform1f(
        splatProgram.uniforms.radius!,
        correctRadius(CONFIG.SPLAT_RADIUS / 100),
      );
      blit(velocity!.write);
      velocity!.swap();

      gl!.uniform1i(splatProgram.uniforms.uTarget!, dye!.read.attach(0));
      gl!.uniform3f(splatProgram.uniforms.color!, color.r, color.g, color.b);
      blit(dye!.write);
      dye!.swap();
    }

    function correctRadius(radius: number) {
      const aspectRatio = canvas.width / canvas.height;
      if (aspectRatio > 1) radius *= aspectRatio;
      return radius;
    }

    function splatPointer() {
      const dx = pointer.deltaX * CONFIG.SPLAT_FORCE;
      const dy = pointer.deltaY * CONFIG.SPLAT_FORCE;
      splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color);
    }

    function step(dt: number) {
      gl!.disable(gl!.BLEND);

      curlProgram.bind();
      gl!.uniform2f(curlProgram.uniforms.texelSize!, velocity!.texelSizeX, velocity!.texelSizeY);
      gl!.uniform1i(curlProgram.uniforms.uVelocity!, velocity!.read.attach(0));
      blit(curl!);

      vorticityProgram.bind();
      gl!.uniform2f(vorticityProgram.uniforms.texelSize!, velocity!.texelSizeX, velocity!.texelSizeY);
      gl!.uniform1i(vorticityProgram.uniforms.uVelocity!, velocity!.read.attach(0));
      gl!.uniform1i(vorticityProgram.uniforms.uCurl!, curl!.attach(1));
      gl!.uniform1f(vorticityProgram.uniforms.curl!, CONFIG.CURL);
      gl!.uniform1f(vorticityProgram.uniforms.dt!, dt);
      blit(velocity!.write);
      velocity!.swap();

      divergenceProgram.bind();
      gl!.uniform2f(divergenceProgram.uniforms.texelSize!, velocity!.texelSizeX, velocity!.texelSizeY);
      gl!.uniform1i(divergenceProgram.uniforms.uVelocity!, velocity!.read.attach(0));
      blit(divergence!);

      clearProgram.bind();
      gl!.uniform1i(clearProgram.uniforms.uTexture!, pressure!.read.attach(0));
      gl!.uniform1f(clearProgram.uniforms.value!, CONFIG.PRESSURE);
      blit(pressure!.write);
      pressure!.swap();

      pressureProgram.bind();
      gl!.uniform2f(pressureProgram.uniforms.texelSize!, velocity!.texelSizeX, velocity!.texelSizeY);
      gl!.uniform1i(pressureProgram.uniforms.uDivergence!, divergence!.attach(0));
      for (let i = 0; i < CONFIG.PRESSURE_ITERATIONS; i++) {
        gl!.uniform1i(pressureProgram.uniforms.uPressure!, pressure!.read.attach(1));
        blit(pressure!.write);
        pressure!.swap();
      }

      gradientSubtractProgram.bind();
      gl!.uniform2f(gradientSubtractProgram.uniforms.texelSize!, velocity!.texelSizeX, velocity!.texelSizeY);
      gl!.uniform1i(gradientSubtractProgram.uniforms.uPressure!, pressure!.read.attach(0));
      gl!.uniform1i(gradientSubtractProgram.uniforms.uVelocity!, velocity!.read.attach(1));
      blit(velocity!.write);
      velocity!.swap();

      advectionProgram.bind();
      gl!.uniform2f(advectionProgram.uniforms.texelSize!, velocity!.texelSizeX, velocity!.texelSizeY);
      if (!supportLinearFiltering) {
        gl!.uniform2f(advectionProgram.uniforms.dyeTexelSize!, velocity!.texelSizeX, velocity!.texelSizeY);
      }
      const velocityId = velocity!.read.attach(0);
      gl!.uniform1i(advectionProgram.uniforms.uVelocity!, velocityId);
      gl!.uniform1i(advectionProgram.uniforms.uSource!, velocityId);
      gl!.uniform1f(advectionProgram.uniforms.dt!, dt);
      gl!.uniform1f(advectionProgram.uniforms.dissipation!, CONFIG.VELOCITY_DISSIPATION);
      blit(velocity!.write);
      velocity!.swap();

      if (!supportLinearFiltering) {
        gl!.uniform2f(advectionProgram.uniforms.dyeTexelSize!, dye!.texelSizeX, dye!.texelSizeY);
      }
      gl!.uniform1i(advectionProgram.uniforms.uVelocity!, velocity!.read.attach(0));
      gl!.uniform1i(advectionProgram.uniforms.uSource!, dye!.read.attach(1));
      gl!.uniform1f(advectionProgram.uniforms.dissipation!, CONFIG.DENSITY_DISSIPATION);
      blit(dye!.write);
      dye!.swap();
    }

    function render() {
      if (!supportLinearFiltering) {
        gl!.disable(gl!.BLEND);
      } else {
        gl!.enable(gl!.BLEND);
        gl!.blendFunc(gl!.ONE, gl!.ONE_MINUS_SRC_ALPHA);
      }
      displayProgram.bind();
      gl!.uniform2f(displayProgram.uniforms.texelSize!, 1 / gl!.drawingBufferWidth, 1 / gl!.drawingBufferHeight);
      gl!.uniform1i(displayProgram.uniforms.uTexture!, dye!.read.attach(0));
      blit(null);
    }

    /* ── 主循环 ── */
    function scaleByPixelRatio(input: number) {
      const pixelRatio = window.devicePixelRatio || 1;
      return Math.floor(input * pixelRatio);
    }
    function resizeCanvas() {
      const width = scaleByPixelRatio(canvas.clientWidth);
      const height = scaleByPixelRatio(canvas.clientHeight);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        return true;
      }
      return false;
    }

    let lastTime = performance.now();
    let frameId = 0;
    let disposed = false;

    function update(now: number) {
      if (disposed) return;
      const dt = Math.min((now - lastTime) / 1000, 0.016666);
      lastTime = now;
      if (resizeCanvas()) initFramebuffers();
      updatePointerColor(dt);
      if (pointer.moved) {
        pointer.moved = false;
        splatPointer();
      }
      step(dt);
      render();
      frameId = requestAnimationFrame(update);
    }

    if (resizeCanvas()) initFramebuffers();
    frameId = requestAnimationFrame(update);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 h-full w-full"
      style={{ zIndex: -5 }}
    />
  );
}
