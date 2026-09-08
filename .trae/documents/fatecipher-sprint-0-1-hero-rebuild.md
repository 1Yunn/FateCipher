# FateCipher · Sprint 0+1 计划：基础原语 + Hero 重建

## Context（为什么做这件事）

当前 `d:\yi-tong` 是一个已上线的 Next.js 15 + Tailwind v4 + Framer Motion 项目，原品牌为「玄机 · AI 东方玄学」，定位为八字/塔罗/紫微/AI 问答的算命网站。用户决定重新定位为「AI Personal Insight Platform（AI 人生洞察平台）」，并改名 **FateCipher** —— 命数可解 · 下一步可循。

此次改动遵循用户的硬约束：
- **保留** 现有路由 `/fortune` `/ask` `/contact`、`src/lib/*` 业务逻辑、`玄机 Design System` 的色卡与字体令牌。
- **不动** 现有 `home/*` 业务组件（仅作为死代码保留，不被新 `page.tsx` 引用）。
- **保留** 现有「仅供娱乐 · 无任何决策建议」合规徽章。

目标产出：Sprint 0（基础原语）+ Sprint 1（新 Hero），交付后停下，让用户 review 后再决定 Sprint 2 何时启动。本计划文件即为 Sprint 0+1 的执行手册，Sprint 2-7 仅作为后续方向占位。

---

## 品牌设定（适用于整个项目）

| 项 | 值 |
| --- | --- |
| 英文品牌 | **FateCipher** |
| 中文定位线 | 「命数可解 · 下一步可循」|
| 产品品类 | AI Personal Insight Platform（AI 人生洞察平台）|
| 核心动词 | Insight / Decision / Growth / Self-Discovery |
| 视觉气质 | Apple + Linear + Notion + MetaSight 设计哲学 · 现代东方美学 · Calm Technology · Quiet Luxury |
| 站点语言 | zh-CN（品牌名保留英文 wordmark）|
| 合规约束 | 全站「仅供娱乐 · 无任何决策建议」徽章常驻 |

后续 Sprint 6 时，`layout.tsx` 的 `metadata` 改为：
- `title.default` = `"FateCipher · AI 人生洞察"`
- `description` = `"FateCipher 把命理、性格与人生阶段翻译成你可以执行的下一步。30 秒生成专属 AI 洞察。本站内容仅供娱乐。"`
- `keywords` 保留 `["八字","塔罗","紫微斗数"]`（/fortune 子页 SEO 依赖），新增 `["AI 洞察","自我认知","人生规划","FateCipher"]`
- `viewport.themeColor` 维持 `#08080d`

---

## Sprint 0：基础原语 + 资产准备

### 目标
为后续 6 个 Sprint 提供三套共享原语，并把 metadata / 头部 / 底部品牌串到 FateCipher。此 Sprint 不重写 `page.tsx`，老首页继续渲染。

### 新建文件

#### 1. `src/components/magnetic-button.tsx`
封装一个磁吸按钮：基于 `Button`（`asChild`）或任意子元素，跟随鼠标位移一小段距离。
- 算法：`useMotionValue(x,y)` + `useSpring({ stiffness: 200, damping: 15 })`，按下时位移衰减至 0
- 守护：`useReducedMotion()` 跳过、`window.matchMedia("(pointer: coarse)")` 触屏跳过
- 复用：参考 `src/lib/use-parallax.ts` 的 `useMouseParallax` spring 配置；Button via `src/components/ui/button.tsx`

#### 2. `src/components/cursor-glow.tsx`
前景层点击光晕（区别于 `AuraBackground` 的背景层氛围光）。
- `fixed inset-0 pointer-events-none z-40`，180px 径向金色 gradient 跟随鼠标
- `mousedown` 时 opacity 0 → 0.15，`mouseup` 0.15 → 0
- 守护：`reduceMotion` / coarse pointer 返回 `null`
- 与 `AuraBackground` 的关系：背景氛围 + 前景点击脉冲，分层不冲突

#### 3. `src/components/section-transition.tsx`
段落过渡包装：基于 `useSectionScroll`（`src/lib/use-parallax.ts`），用段落顶部 15% / 底部 15% 的滚动进度驱动 `opacity` + `filter: blur(8px)`，避免段落间硬切。

#### 4. `src/components/home/primitives.tsx`
首页专用布局原语扩展（不动 `shared.tsx`，避免污染现有 API）：
- `SectionSplit` — 不对称 7/5 网格（左 7 列内容 / 右 5 列视觉），供编辑型段落用
- `EyebrowNumber` — 等宽字体 `01 02 03` + hairline（参考 `value.tsx` 的 5xl 衬线大序号模式，但换成等宽克制版）

### 修改文件

#### `src/app/layout.tsx`
- `metadata.title.default`: `"玄机 · AI 东方玄学"` → `"FateCipher · AI 人生洞察"`
- `metadata.description`: 重写为洞察平台 framing
- `metadata.keywords`: 增加 `["AI 洞察","自我认知","人生规划","FateCipher"]`，保留 `["八字","塔罗","紫微斗数"]`
- 字体、`<html lang="zh-CN" className="dark">`、suppressHydrationWarning、`viewport.themeColor` 不动

#### `src/components/site-header.tsx`
- Logo 字标：`玄机` → `FateCipher`
- CTA 文案：`开始测算` → `开始洞察`
- 导航链接 `玩法矩阵` / `AI 问答` / `免责声明` 的 href 不动（路由约束），但视觉文案可微调：`玩法矩阵` → `命理体系`、`AI 问答` 维持、`免责声明` 维持
- 组件名 `SiteHeader` 不动

#### `src/components/site-footer.tsx`
- 品牌：`玄机` → `FateCipher`
- Tagline：`把天机，讲成人话。` → `命数可解 · 下一步可循。`
- 翻转徽章 `仅供娱乐 · 无任何决策建议` 保留
- 链接组 href 不动

### 复用现有资产
- `src/components/aura-background.tsx` — 维持全局背景氛围光，不修改
- `src/components/ui/button.tsx` 的 variants `default`（金色渐变）/ `outline` / `ghost`
- `src/lib/utils.ts` 的 `cn()`
- `src/lib/use-parallax.ts` 的 `useMouseParallax` / `useSectionScroll`
- `src/components/home/shared.tsx` 的 `EASE_OUT` / `item` / `container`

### 验证
1. `pnpm dev` → http://localhost:3000 老首页仍可渲染（page.tsx 未改）
2. 浏览器 Tab 标题改为 `FateCipher · AI 人生洞察`
3. 顶部 Logo 显示 FateCipher，CTA 显示「开始洞察」
4. 任何位置点击 → 出现极淡金色光晕脉冲（opacity ≤ 0.15）
5. 悬停 Hero 现有 CTA「开始测算」（注：Sprint 1 才换新 CTA）→ 按钮轻微被鼠标吸引
6. DevTools 切到 `prefers-reduced-motion: reduce` → 光晕、磁吸全部禁用
7. 触屏模拟（DevTools toggle device toolbar + coarse pointer）→ 磁吸、光晕禁用
8. `pnpm build` 无 type error

---

## Sprint 1：Hero 重建

### 目标
替换算命 Hero（`夜观天象，一卦知进退` + 运势分数卡）为洞察平台 Hero，让首访用户 30 秒内能回答：
- ① 这是什么产品？
- ② 为什么和普通 AI 不一样？
- ⑥ 我应该立即开始体验？

### 新建文件

#### `src/components/home/hero-insight.tsx`
新 Hero 的视觉结构（按从上到下）：

1. **Eyebrow**（`itemDrawLine` 横线 + 文字）：
   `AI Personal Insight · 仅供娱乐`（保留合规标识）
2. **标题**（字符 mask reveal，逐字 clip-path 揭示）：
   `认清自己，` + `看清下一步。`（第二行用 `text-gradient-gold` 鎏金渐变）
3. **副标题**（`itemBlurIn` 模糊入场）：
   `不是算命，也不是闲聊。FateCipher 把命理、性格与人生阶段翻译成你可以执行的下一步。`
4. **CTA 簇**：
   - 主 CTA `开始我的第一份洞察`（`MagneticButton`，href `/fortune/bazi`）
   - 次 CTA `看 AI 怎么思考`（普通 `<a>`，平滑滚动到 `#ai-demo`）
5. **视觉焦点：4 层洞察堆叠卡**（替代旧运势分数环卡）
   - 4 张半透明玻璃层，垂直堆叠、轻微错位、背后两层带 `blur(2px)` 模拟景深
   - 每层标注：`提问` / `命盘` / `推理` / `报告`
   - 鼠标移动 → 整体 3D 倾斜（spring rotateX/rotateY，参考旧 Hero 的 card 倾斜）
   - 滚动 → 4 层轻微分离（视差深度，参考旧 Hero 的 `heroY` 离场视差）
   - 替换掉旧 `score` 分数环、`今日运势` 标签、`Badge` 颜色组——核心是不要「运势分数」叙事，而是「分析深度」叙事

### 修改文件

#### `src/app/page.tsx`
**仅一处临时改动**（Sprint 6 才会真正重写）：
```tsx
import { HeroInsight } from "@/components/home/hero-insight";
// ...
<HeroInsight />  // 临时替换 <Hero />
```
其余 sections 保留旧实现，让用户能在一个真实跑起来的页面里 review 新 Hero。Sprint 6 会再次重写 page.tsx 把 11 个新 section 全部串起来。

### 不动文件
- `src/components/hero.tsx` — 不删，加一行 `// @deprecated v2 — replaced by hero-insight.tsx. Will be removed in Sprint 6.`
- 现有 `home/*.tsx` — 全部不动
- `AuraBackground` — 全局背景氛围光维持

### 复用现有模式（克隆，不 import 私有 const）
- 字符 mask reveal：克隆 `src/components/hero.tsx` 的 `charParent` / `charChild` 模式（framer-motion `clipPath: inset(0 100% 0 0) → inset(0 0 0 0)`）
- 3D 倾斜：克隆 `hero.tsx` 的 `rotateX` / `rotateY` spring（`stiffness: 300, damping: 20`）
- 离场视差：克隆 `hero.tsx` 的 `useScroll` + `useTransform` y/opacity 模式
- `EASE_OUT` / `item` / `container`：从 `src/components/home/shared.tsx` 直接 import
- `MagneticButton`（Sprint 0 新建）
- `Button`（`src/components/ui/button.tsx`）
- `useReducedMotion()` 守护模式

### 视觉焦点（不可被邻居复制）
4 层玻璃堆叠卡——这是整页除 `AiDemo` 外最具记忆点的视觉。它的存在让用户一眼读到「FateCipher 做的是分层深度分析」而不是「打分算命」。

### 动画技术
- 字符 mask reveal（标题）
- 模糊入场（副标题）
- spring 3D 倾斜（堆叠卡）
- 滚动驱动层分离（堆叠卡）
- MagneticButton 磁吸（主 CTA）
- `itemDrawLine` 横线绘制（eyebrow）

### 鼠标交互
- 堆叠卡 3D 倾斜（spring）
- 主 CTA 磁吸
- 点击光晕（Sprint 0 `CursorGlow`）

### 验证
1. `pnpm dev` → http://localhost:3000#top
2. **30 秒理解测试**（核心验收标准）：
   - 首访用户能否在 30 秒内回答：① 这是什么？② 为什么不同于普通 AI？⑥ 是否想立即开始？
   - 若不能 → 迭代文案与视觉，不结束 Sprint
3. 标题字符逐字揭示顺滑、不卡顿
4. 4 层堆叠卡 3D 倾斜有「重量感」、不抖动
5. 滚动到下一段时 Hero 标题上移渐隐、堆叠卡轻微分层移动
6. 移动端 375px：3D 倾斜禁用、堆叠卡可见为静态分层卡、CTA 全宽堆叠
7. `prefers-reduced-motion`：所有动画直接呈现最终状态、字符不 mask、堆叠卡不倾斜
8. `pnpm build` 通过

---

## 后续 Sprint（占位，本次不执行）

| Sprint | 范围 | 备注 |
| --- | --- | --- |
| 2 | AI 自动演示（`AiDemo`）：6 阶段管线自动播放 | 签名交互件，非 chat |
| 3 | 真实用户案例 + AI 如何思考（成对编辑型布局） | 含 3 张人物照（按需生成）|
| 4 | 产品价值 + 适用场景 + 支持命理体系 | 3 段不同布局 |
| 5 | 报告展示 + 用户评价 | sticky scroll + masonry |
| 6 | FAQ + 终极 CTA + page.tsx 11 段组装 | 唯一重写 page.tsx 的 sprint |
| 7 | 4 视角 Design Review + 优化 | Apple / Linear / Awwwards / UX |

---

## Design Review 检查清单（Sprint 0+1 完成时执行）

### Apple HIG Team
- [ ] 是否尊重平台克制？无装饰性多余动效
- [ ] 排版层级清晰：eyebrow / 标题 / 副标题 / CTA 各有区分

### Linear Design Team
- [ ] 布局是否经得起推敲？每个间距都是有意为之
- [ ] 动效是否有目的？每次动画在解释内容而非装饰

### Awwwards Jury
- [ ] 是否还有模板感？FAIL 若仍像 shadcn/ui 模板
- [ ] 是否有视觉高潮？Hero 堆叠卡是否构成焦点

### UX Designer
- [ ] 是否还有 AI 生成痕迹？FAIL 若出现「赋能 / 助力 / 一站式 / 打造极致」等空泛词
- [ ] 是否有品牌辨识度？看完能否记住 FateCipher 是什么

### Cross-cutting
- [ ] 留白足够？`py-20 sm:py-28` 起步
- [ ] 滚动节奏？与下一个段落（旧 Problems）布局不撞
- [ ] 动画自然？所有 easing 用 `EASE_OUT` 或 spring
- [ ] 国际一线水准？能否与 Linear/Notion/Raycast 首页并列
- [ ] `prefers-reduced-motion` 全部回退到终态
- [ ] 移动端 375px 可读、无横向溢出

PASS ≥ 13/14 才能进入 Sprint 2。否则继续优化。

---

## 风险与权衡

1. **品牌名 FateCipher 出现位置**：Sprint 0 已在 `layout.tsx` metadata + `site-header.tsx` Logo + `site-footer.tsx` 品牌行三处替换。Sprint 1 的 Hero 副标题文案里也明示 `FateCipher`。这是用户主动选择的新品牌，不与「不动组件命名」约束冲突——组件名 `SiteHeader` / `SiteFooter` / `HeroInsight` 全部保留。

2. **Hero 与下一段（旧 Problems）视觉撞车**：旧 Problems 是 8 个共鸣问题列表。新 Hero 是堆叠卡，与下方列表无视觉重叠。可接受。

3. **磁吸按钮在触屏**：`MagneticButton` 通过 `window.matchMedia("(pointer: coarse)")` 检测，触屏退化为普通 Button。无意外。

4. **CursorGlow 与 AuraBackground 抢戏**：`AuraBackground` 是 `-z-10` 背景层；`CursorGlow` 是 `z-40` 前景层。若 CursorGlow opacity > 0.15 会让暗背景浑浊，已限制 ≤ 0.15，且仅在 mousedown 短暂可见。

5. **`prefers-reduced-motion` 全链路守护**：新 Hero 的字符 mask、3D 倾斜、堆叠分离、磁吸、光晕，全部必须在 `reduceMotion` 下跳过。克隆现有 Hero 的 `if (reduceMotion) return ...` 守护模式。

6. **临时改动 `page.tsx` 的可逆性**：Sprint 1 仅在 page.tsx 把 `<Hero />` 换成 `<HeroInsight />`，其余 section 维持旧实现。这是「在一个真实跑起来的页面里 review 新 Hero」的最低成本做法。Sprint 6 会真正重写 page.tsx。

---

## 端到端验证

执行顺序：

1. 创建 4 个新原语文件（Sprint 0）
2. 修改 `layout.tsx` / `site-header.tsx` / `site-footer.tsx` 三处品牌替换
3. 创建 `hero-insight.tsx`
4. 修改 `page.tsx` 把 `<Hero />` 换成 `<HeroInsight />`，并在 `hero.tsx` 顶部加 `@deprecated` 注释
5. `pnpm dev` 起服务，访问 http://localhost:3000
6. 按「Sprint 1 验证 1-8」逐条核验
7. 按「Design Review 检查清单」14 条打分
8. PASS ≥ 13/14 → 通知用户准备进入 Sprint 2；< 13 → 列出 FAIL 项继续优化

工具：`pnpm dev`（开发服务器）、`pnpm build`（type check）、浏览器 DevTools（reduce motion / coarse pointer 模拟）、Lighthouse（移动端暗色模式跑一次基线）。
