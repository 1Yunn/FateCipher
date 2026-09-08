# 首页视觉升级方案

## Context

玄机首页功能已完整，但视觉存在六大问题：① 全部 9 个 Section 用统一的 `max-w-6xl` + `py-20` 居中布局，像一条均匀走廊；② 动画全部用同一个 `container+item`（opacity+y），无变化；③ 信息密度过高、无喘息；④ 没有视觉焦点和高潮；⑤ 背景三个光晕只是静态漂移，不响应鼠标和滚动；⑥ 卡片布局疲劳（4 个模块用类似网格）。

本次升级**不改**任何业务逻辑、功能、文案、路由，只优化视觉、排版、动画、滚动体验、页面节奏和品牌质感。参考 Apple/Linear/MetaSight 的设计语言，保持克制 Premium。

---

## 诊断：现有问题 → 升级方向

| 问题 | 严重度 | 升级方向 |
|---|---|---|
| 布局节奏单一：全 max-w-6xl 居中 | 高 | 引入窄/宽/全宽容器，左右对齐交错 |
| 动画同质化：全 opacity+y | 高 | 新增 7 种变体（mask/scale/blur/draw/fade/reveal） |
| 缺视觉高潮 | 高 | ReportPreview 改为 sticky scroll 全屏锚点 |
| 背景过静态 | 中 | 鼠标视差三层深度 + 滚动视差 |
| 卡片疲劳 | 中 | spotlight 鼠标光晕 + 3D 倾斜 |
| 无鼠标交互 | 中 | 3 处交互（背景视差/卡片光晕/Hero 倾斜） |

---

## 布局节奏重排

改造后形成"宽-窄-宽-窄-宽-全宽-宽-窄-宽"呼吸波 + 对齐交错：

| # | 模块 | 容器宽度 | 留白 | 对齐 | 视觉权重 |
|---|---|---|---|---|---|
| 1 | Hero | max-w-3xl | pt-36 pb-28 | 居中 | 重 |
| 2 | Problems | max-w-4xl | py-16 sm:py-24 | 左对齐 | 轻 |
| 3 | UseCases | max-w-7xl | py-20 sm:py-28 | 居中 | 中 |
| 4 | WhoFor | max-w-4xl | py-16 sm:py-20 | 右对齐 | 最轻 |
| 5 | Value | max-w-7xl | py-24 sm:py-32 | 左对齐 | 中重 |
| — | Divider | — | — | — | 休止 |
| 6 | ReportPreview | 全宽 full-bleed | py-24 sm:py-36 | sticky 双栏 | 高潮 |
| — | Divider | — | — | — | 休止 |
| 7 | FeatureCards | max-w-6xl | pt-4 pb-24 | 居中 | 中 |
| 8 | HowItWorks | max-w-5xl | py-20 sm:py-28 | 居中 | 轻 |
| — | Divider | — | — | — | 休止 |
| 9 | Trust | max-w-6xl | pb-28 sm:pb-36 | 居中 | 收尾 |

权重序列：重→轻→中→最轻→中重→高潮→中→轻→收尾。两个峰（Hero 和 ReportPreview），中间两个谷（Problems、WhoFor），结尾缓降。

---

## 动画变体分配

| 变体 | 效果 | 分配到 |
|---|---|---|
| item（保留） | opacity+y | 默认 |
| itemRevealUp | opacity+y32+blur6px | Problems/Value/HowItWorks/Trust |
| itemFade | 纯 opacity | WhoFor（最克制） |
| itemScaleIn | opacity+scale0.96 | UseCases/FeatureCards |
| itemMaskReveal | clipPath 逐字揭示 | Hero 标题 |
| itemBlurIn | opacity+blur12px | Hero 副标题/ReportPreview 标题 |
| itemDrawLine | scaleX 0→1 | Value 横线/HowItWorks 连接线 |
| containerFast | stagger 0.06 | Problems/WhoFor |
| containerSlow | stagger 0.14 | Value/HowItWorks |

---

## 鼠标交互（3 处，全部克制）

1. **背景三层视差**：aura-violet/gold/rouge 分别以 4/6/10px 跟随鼠标，spring 阻尼
2. **Hero 运势卡 3D 倾斜**：rotateX/Y ±3°，spring 回正
3. **卡片 spotlight 光晕**：UseCases/FeatureCards/Trust 卡片鼠标跟随金色 radial gradient

不做：鼠标拖尾粒子、全屏光标特效、磁吸按钮（过度）。

---

## 滚动体验（4 处）

1. Hero 离场视差：标题上移渐隐
2. ReportPreview sticky 章节切换：h-[200vh] sticky，7 章交叉淡化
3. HowItWorks 连接线 scroll draw
4. Value 序号横线 draw

---

## 实施步骤（5 阶段）

### Phase 0 — 地基
- [shared.tsx](src/components/home/shared.tsx)：新增 8 个变体 + 6 个新组件（SectionNarrow/Wide/FullBleed、SectionHeadingLeft/Right、Divider、MaskReveal、SpotlightCard、CountUp）。保留旧导出不变
- 新增 [src/lib/use-parallax.ts](src/lib/use-parallax.ts)：useMouseParallax + useSectionScroll
- [globals.css](src/app/globals.css)：新增 .spotlight-card / .hairline-gradient / .aura-respond / .text-balance

### Phase 1 — 背景与 Hero
- [aura-background.tsx](src/components/aura-background.tsx)：升级 client，鼠标视差三层 + 滚动视差
- [hero.tsx](src/components/hero.tsx)：逐字 mask reveal 标题 + 3D 倾斜运势卡 + 离场视差

### Phase 2 — ReportPreview 高潮锚点
- [report-preview.tsx](src/components/home/report-preview.tsx)：sticky scroll h-[200vh]，7 章交叉淡化，TOC 自动跟随

### Phase 3 — 节奏重排
- [problems.tsx](src/components/home/problems.tsx)：SectionNarrow + 左对齐 + 删底部 CTA
- [who-for.tsx](src/components/home/who-for.tsx)：SectionNarrow + 右对齐 + itemFade
- [value.tsx](src/components/home/value.tsx)：SectionWide + 左对齐 + 大序号 + 横线 draw
- [how-it-works.tsx](src/components/home/how-it-works.tsx)：SectionNarrow + 连接线 scroll draw
- [page.tsx](src/app/page.tsx)：插入 3 处 Divider

### Phase 4 — 卡片质感
- [use-cases.tsx](src/components/home/use-cases.tsx)：itemScaleIn + SpotlightCard
- [feature-cards.tsx](src/components/feature-cards.tsx)：引 shared 变体 + itemScaleIn + SpotlightCard
- [trust.tsx](src/components/home/trust.tsx)：POINTS 换 itemRevealUp + FACTS 条加 SpotlightCard

### Phase 5 — 抛光
- useReducedMotion 路径全回归
- 浅色（宣纸）模式回归
- 移动端断点检查
- tsc + eslint + next build 全绿

---

## 验证方式
1. `npx tsc --noEmit` 类型检查
2. `npm run build` 生产构建
3. `npm run start` 启动，浏览器逐模块截图
4. 鼠标交互测试：移动鼠标验证背景视差/卡片光晕/Hero 倾斜
5. 滚动体验测试：ReportPreview sticky 切换、HowItWorks 连接线 draw
6. 系统偏好设置开"减少动态效果"，验证所有动画降级
7. 浅色模式视觉检查
