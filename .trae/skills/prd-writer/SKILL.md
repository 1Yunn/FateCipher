---
name: "prd-writer"
description: "Writes structured versioned PRD documents for FateCipher. Invoke when user asks to write/update PRD for a new version (v0.3, v0.4...) or restructure existing PRD."
---

# PRD Writer · FateCipher

为 FateCipher 多版本产品写 PRD 的规范。每个版本固定 14 个子章节，所有版本合并在一个 HTML 里（sidebar 版本分组 + 可展开收起）。

---

## 一、文件组织（铁律）

```
用户命盘档案管理/
├── PRD.html                    ← 唯一 HTML，所有版本追加在这里
├── PRD-Writing-Guide.html      ← 给人看的完整规范（备份）
└── assets/                     ← 所有截图，前缀区分版本
    ├── v01-homepage.png
    ├── v02-profile-empty.png
    └── v03-xxx.png             ← 新版截图
```

**禁止**：为每个版本建新目录 / 建新 HTML。统一追加。

**截图命名**：`v{NN}-{描述}.png`（如 `v03-multi-profile-switcher.png`）

**截图引用**：`<img src="./assets/v03-xxx.png" alt="描述" />`

---

## 二、14 个标准子章节（每个版本固定这个顺序，中文序号一~十四）

| # | 章节名 | 回答什么问题 | 配什么视觉元素 |
|---|--------|-------------|---------------|
| 一 | 项目相关人员 | 谁来做？一个人分饰几个角色？ | 人员表（角色/姓名/职责） |
| 二 | 项目开发排期 | 花多长时间？几个 commit？ | 阶段表（阶段/周期/commit/产出） |
| 三 | 项目背景 | 为什么要做？上一版本暴露了什么问题？ | 痛点表（P0/P1 分级）+ 一句话卡片 |
| 四 | 项目目标 | 这次要达成什么？ | 目标表（带 pill 状态）或 clean list |
| 五 | 目标用户 | 谁会用？用户故事？ | 用户画像表 / 用户故事表（US-01, US-02...） |
| 六 | 竞品分析与方案选型 | 为什么选这个技术？为什么不那样做？ | 竞品对比表 + 技术选型表 |
| 七 | 设计思路 | UI 怎么想的？key 怎么分？状态怎么切？ | Key 映射表 / 排版决策表 + 截图 |
| 八 | 核心功能详细说明 | API 长什么样？页面有几态？ | API 表 / 状态表 + 低保真流程图 + 运行截图 |
| 九 | 数据埋点 | 需要埋哪些事件？ | 事件表（事件名/触发时机/状态 pill） |
| 十 | 完整主流程图 | 功能的完整路径？ | CSS 低保真 `.lf` 流程图（菱形决策 + 圆角起止 + page 占位） |
| 十一 | 系统交互时序图 | 核心交互时序？ | ASCII `.diagram` 时序图（User → 组件 → API） |
| 十二 | 异常流程与规则 | 出错怎么办？边界怎么处理？ | 异常表（#/场景/处理），E1/E2 编号 |
| 十三 | 验收标准 | 怎么算做完了？ | 验收表（项/结果 ✅），分组列 |
| 十四 | 迭代规划 | 下一个版本做什么？ | 版本链表（版本号/内容） |

---

## 三、新增版本三步（以 v0.3 为例）

### Step 1：Sidebar 追加 15 行
找到 PRD.html 里 sidebar 的 `</ol></nav>`，在最后一个 `</li>` 前插入：

```html
    <!-- ===== v0.3 ===== -->
    <li class="v-group" data-group="v03"><span class="v-badge">v0.3</span>版本标题<span class="arrow"></span></li>
    <li data-group-children="v03"><a href="#v03-1"><span class="idx">一</span>项目相关人员</a></li>
    <li data-group-children="v03"><a href="#v03-2"><span class="idx">二</span>项目开发排期</a></li>
    <li data-group-children="v03"><a href="#v03-3"><span class="idx">三</span>项目背景</a></li>
    <li data-group-children="v03"><a href="#v03-4"><span class="idx">四</span>项目目标</a></li>
    <li data-group-children="v03"><a href="#v03-5"><span class="idx">五</span>目标用户</a></li>
    <li data-group-children="v03"><a href="#v03-6"><span class="idx">六</span>竞品分析与方案选型</a></li>
    <li data-group-children="v03"><a href="#v03-7"><span class="idx">七</span>设计思路</a></li>
    <li data-group-children="v03"><a href="#v03-8"><span class="idx">八</span>核心功能详细说明</a></li>
    <li data-group-children="v03"><a href="#v03-9"><span class="idx">九</span>数据埋点</a></li>
    <li data-group-children="v03"><a href="#v03-10"><span class="idx">十</span>完整主流程图</a></li>
    <li data-group-children="v03"><a href="#v03-11"><span class="idx">十一</span>系统交互时序图</a></li>
    <li data-group-children="v03"><a href="#v03-12"><span class="idx">十二</span>异常流程与规则</a></li>
    <li data-group-children="v03"><a href="#v03-13"><span class="idx">十三</span>验收标准</a></li>
    <li data-group-children="v03"><a href="#v03-14"><span class="idx">十四</span>迭代规划</a></li>
```

> 注意：如果想让 v0.3 用蓝色 v-badge（和 v0.2 一样），把 `<span class="v-badge">` 改成 `<span class="v-badge v02">`。紫/蓝/黄灰色随便选。

### Step 2：正文末尾追加 section（footer 之前）

```html
<!-- v0.3 Banner -->
<div class="v-banner">
  <span class="vb-badge v02">v0.3</span>
  <span class="vb-title">版本标题（如：多档案切换 & 历史收藏）</span>
  <span class="vb-sub">commit xxxxxxx · YYYY-MM-DD</span>
</div>

<section id="v03-1"><h2><span class="section-no">一</span>项目相关人员</h2>
  <div class="card">
    <table>
      <thead><tr><th>角色</th><th>姓名</th><th>职责</th></tr></thead>
      <tbody>
        <tr><td>产品经理 + 全栈 + UI·UX</td><td><b>章青云</b></td><td>需求 / 开发 / UI / PRD</td></tr>
      </tbody>
    </table>
  </div>
</section>

<!-- ... 14 个 section 全部写完 ... -->

<section id="v03-14"><h2><span class="section-no">十四</span>迭代规划</h2>
  <div class="card">
    <table>
      <thead><tr><th>版本</th><th>内容</th></tr></thead>
      <tbody>
        <tr><td>v0.4</td><td>后端对接（Supabase / Cloudflare D1）</td></tr>
      </tbody>
    </table>
  </div>
</section>
```

### Step 3：截图丢 assets/，commit

```powershell
# 截图命名 v03-xxx.png 丢进 assets/
git add "用户命盘档案管理/"
git commit -m "docs: v0.3 PRD — 标题（commit xxxxxxx）"
```

---

## 四、CSS 组件速查（直接抄 class）

| Class | 用途 | 示例 |
|-------|------|------|
| `.v-banner` | 版本切换横幅 | 版本 badge + 标题 + commit 日期 |
| `.section-no` | 章节前中文序号 | `<span class="section-no">一</span>` |
| `.card` | 白底圆角卡片（装表格/列表） | 用得最多的容器 |
| `.shot-box` | 截图容器（带 caption） | 单张图 |
| `.shot-pair` | 2 列并排图 | 低保真 + 运行截图对照 |
| `.shot-grid` | 自适应网格 | 三态截图 |
| `.lf` | 低保真流程图容器 | CSS 画的，见 v0.2 第十章 |
| `.lf-node.start/.lf-node.end` | 圆角起止节点 | border-radius: 20px |
| `.lf-node.decision` | 菱形判断节点 | rotate(45deg) + inner 反向旋转 |
| `.lf-node.page` | 页面占位节点 | ph-header + ph-body |
| `.diagram` | 暗色等宽代码块 | ASCII 时序图 |
| `.pill` | 彩色状态标签 | `.pill.ok` / `.pill.sky` / `.pill.sk` / `.pill.warn` |
| `.clean` | 无序列表 | padding-left: 0 |
| `.v-group` | sidebar 版本组标题 | 带 arrow 指示器，可点击收起 |
| `.v-badge` | sidebar 版本号 | `.v-badge`（紫）/ `.v-badge.v02`（蓝） |

---

## 五、关键约束（写完核对）

1. ✅ sidebar 的 `href` 和正文的 `section id` 必须严格一致（点一下能跳）
2. ✅ 中文序号 一~十四 在 sidebar 和正文完全一致
3. ✅ section 的 h2 都有 `<span class="section-no">一</span>`
4. ✅ Banner 里的 commit hash 指向真实 commit
5. ✅ 截图以正确版本号开头（`v03-xxx.png`）
6. ✅ 至少一张 CSS 低保真 `.lf` 流程图（第十章）
7. ✅ 至少一张 ASCII `.diagram` 时序图（第十一章）

---

## 六、颜色约定（版本分组语义）

| 版本类型 | sidebar v-badge | banner vb-badge |
|---------|----------------|----------------|
| 从 0 到 1 项目 | 紫色（默认 `.v-badge`） | 紫色（默认） |
| 新功能 / 基础架构 | 蓝色 `.v-badge.v02` | 蓝色 `.vb-badge.v02` |
| 小修复 / 补丁 | 灰色 `.v-badge.v03 { background:#f0f0f4; color:#8a8a93; }` | 同左 |
