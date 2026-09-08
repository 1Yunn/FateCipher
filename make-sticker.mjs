// 一次性脚本：用真实照片合成"说话头像贴纸"（圆形头像 + 光泽气泡 + 暗色背景）
import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";
import { writeFileSync } from "node:fs";

GlobalFonts.registerFromPath("C:\\Windows\\Fonts\\msyh.ttc", "MSYH");
GlobalFonts.registerFromPath("C:\\Windows\\Fonts\\msyhbd.ttc", "MSYH");

const W = 1080;
const H = 1080;
const canvas = createCanvas(W, H);
const ctx = canvas.getContext("2d");

// ---------- 1. 暗色背景（简化版网站暗色纹理） ----------
const bg = ctx.createLinearGradient(0, 0, W, H);
bg.addColorStop(0, "#0B0A12");
bg.addColorStop(0.55, "#100D1A");
bg.addColorStop(1, "#141021");
ctx.fillStyle = bg;
ctx.fillRect(0, 0, W, H);

// 紫色光晕（左上）
function glow(x, y, r, color, alpha) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color.replace("ALPHA", alpha));
  g.addColorStop(1, color.replace("ALPHA", 0));
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
}
glow(220, 180, 520, "rgba(124,108,246,ALPHA)", 0.16);
glow(900, 900, 560, "rgba(212,176,114,ALPHA)", 0.10);
glow(980, 120, 380, "rgba(124,108,246,ALPHA)", 0.08);

// 噪点纹理
for (let i = 0; i < 2200; i++) {
  const x = Math.random() * W;
  const y = Math.random() * H;
  const a = Math.random() * 0.045;
  ctx.fillStyle =
    Math.random() > 0.5 ? `rgba(255,255,255,${a})` : `rgba(140,120,255,${a})`;
  ctx.fillRect(x, y, 1.6, 1.6);
}

// ---------- 2. 圆形真实头像（左侧） ----------
const photo = await loadImage("d:/yi-tong/public/story-avatar.png");
const HEAD_CX = 380;
const HEAD_CY = 520;
const HEAD_R = 330;

// 方形裁切：以头部为中心（证件照头部约在上方 4%~72% 区域）
const side = Math.round(Math.min(photo.width, photo.height) * 0.98);
const sx = Math.round((photo.width - side) / 2);
const sy = Math.round(photo.height * 0.03);

// 头像投影
ctx.save();
ctx.shadowColor = "rgba(0,0,0,0.55)";
ctx.shadowBlur = 60;
ctx.shadowOffsetY = 18;
ctx.beginPath();
ctx.arc(HEAD_CX, HEAD_CY, HEAD_R, 0, Math.PI * 2);
ctx.fillStyle = "#1A1626";
ctx.fill();
ctx.restore();

// 裁切并绘制圆形头像
ctx.save();
ctx.beginPath();
ctx.arc(HEAD_CX, HEAD_CY, HEAD_R, 0, Math.PI * 2);
ctx.closePath();
ctx.clip();
// 覆盖方形区域（保持比例填满圆）
const scale = (HEAD_R * 2) / side;
const dw = side * scale;
ctx.drawImage(photo, sx, sy, side, side, HEAD_CX - dw / 2, HEAD_CY - dw / 2, dw, dw);
ctx.restore();

// 金→紫 渐变描边环
const ring = ctx.createLinearGradient(
  HEAD_CX - HEAD_R,
  HEAD_CY - HEAD_R,
  HEAD_CX + HEAD_R,
  HEAD_CY + HEAD_R
);
ring.addColorStop(0, "#D4B072");
ring.addColorStop(0.5, "#B79A5F");
ring.addColorStop(1, "#7C6CF6");
ctx.beginPath();
ctx.arc(HEAD_CX, HEAD_CY, HEAD_R + 5, 0, Math.PI * 2);
ctx.lineWidth = 9;
ctx.strokeStyle = ring;
ctx.stroke();

// 细外环（高光）
ctx.beginPath();
ctx.arc(HEAD_CX, HEAD_CY, HEAD_R + 15, 0, Math.PI * 2);
ctx.lineWidth = 1.5;
ctx.strokeStyle = "rgba(255,255,255,0.22)";
ctx.stroke();

// ---------- 3. 光泽对话气泡（右侧，尾巴指向嘴部） ----------
const BX = 662;
const BY = 468;
const BW = 386;
const BH = 222;
const BR = 42;

ctx.save();
ctx.shadowColor = "rgba(0,0,0,0.5)";
ctx.shadowBlur = 44;
ctx.shadowOffsetY = 14;

// 气泡尾巴（贝塞尔，指向头像嘴部）
ctx.beginPath();
ctx.moveTo(BX + 4, BY + BH * 0.46);
ctx.quadraticCurveTo(BX - 150, BY + BH * 0.6, 448, BY + BH * 0.72);
ctx.quadraticCurveTo(BX - 50, BY + BH * 0.62, BX + 6, BY + BH * 0.7);
ctx.closePath();
ctx.fillStyle = "#26223A";
ctx.fill();

// 圆角矩形气泡（垂直渐变）
function roundedRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
const bub = ctx.createLinearGradient(0, BY, 0, BY + BH);
bub.addColorStop(0, "#322D4C");
bub.addColorStop(1, "#1E1A30");
roundedRect(BX, BY, BW, BH, BR);
ctx.fillStyle = bub;
ctx.fill();
ctx.restore();

// 气泡边框
roundedRect(BX, BY, BW, BH, BR);
ctx.lineWidth = 1.6;
ctx.strokeStyle = "rgba(255,255,255,0.16)";
ctx.stroke();

// 气泡顶部高光（玻璃感）
ctx.save();
roundedRect(BX, BY, BW, BH, BR);
ctx.clip();
const gloss = ctx.createLinearGradient(0, BY, 0, BY + BH * 0.55);
gloss.addColorStop(0, "rgba(255,255,255,0.14)");
gloss.addColorStop(1, "rgba(255,255,255,0)");
ctx.fillStyle = gloss;
ctx.fillRect(BX, BY, BW, BH * 0.55);
ctx.restore();

// 尾巴描边补齐
ctx.beginPath();
ctx.moveTo(BX + 4, BY + BH * 0.46);
ctx.quadraticCurveTo(BX - 150, BY + BH * 0.6, 448, BY + BH * 0.72);
ctx.strokeStyle = "rgba(255,255,255,0.16)";
ctx.lineWidth = 1.6;
ctx.stroke();

// ---------- 4. 气泡文字 ----------
ctx.fillStyle = "#F5F2EC";
ctx.textBaseline = "middle";
ctx.font = "600 44px MSYH";
const line1 = "我看好哪一个";
const line2 = "Offer？";
ctx.textAlign = "center";
ctx.fillText(line1, BX + BW / 2, BY + BH * 0.36);
ctx.fillText(line2, BX + BW / 2, BY + BH * 0.7);

// ---------- 5. 输出 ----------
const out = canvas.toBuffer("image/png");
writeFileSync("d:/yi-tong/public/story-chat-sticker.png", out);
console.log("OK -> public/story-chat-sticker.png", out.length, "bytes");
