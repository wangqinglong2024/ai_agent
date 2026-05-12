# 34 · H02 AI 输出：HTML 原型规范

> **阶段**：H HTML 原型
> **谁产出**：AI（前端原型工程师）
> **落盘**：`docs/C04-prototype/<feature-id>/`
> **目的**：把 X/S/I/N 实化为可点开看的纯 HTML，零依赖、本地双击 `index.html` 就能跑。原型只承担"看效果 + 走通流程"，不承担生产工程化。

---

## 触发提示词（首版）

```
请你扮演「前端原型工程师」，遵循 /prompt/A-framework/A00-01、/prompt/A-framework/A00-03、/prompt/A-framework/A00-04，硬性遵守 docs/B02-permissions/、docs/B03-ux/、docs/B04-design-system/、docs/C02-ia/<feature-id>/、docs/C03-pages/<feature-id>/。
按 /prompt/C-product/C04-H03-AI输出-HTML原型规范.md 输出一整套零依赖 HTML 原型，
落盘到 docs/C04-prototype/<feature-id>/。

【运行时资产选型】
- 若仓库存在 `design/03-implementation/` （QSDS 可运行包）：必须采用「备份依赖」模式——将 `design/03-implementation/` 全量拷贝到 `docs/C04-prototype/<feature-id>/vendor/qsds/`，页面以相对路径 `<link rel="stylesheet" href="../vendor/qsds/app.css">` + `<script src="../vendor/qsds/app.js"></script>` + `qsds.bootstrap()` 引入；**不重写 token / 组件 CSS / 交互 JS**，只写 feature 专属的 `feature.css`（贴 vendor 变量）与 `feature.js`（调 `qsds.*` API）。
- 若仓库不存在 `design/03-implementation/`：采用「自含」模式——自写 `styles.css`（:root 与 docs/B04-design-system/01-tokens.md 一字不差）与 `app.js`（名空间 `window.PROTO`）。

P0 页面必须出 4 份独立状态文件（默认 / 加载 / 空 / 错误）；独立项 forbidden 状态必须覆盖。
本期 mock 的接口数据放 mock-data.js（OP-ID 为键，与 docs/C03-pages/<feature-id>/<page-id>.md 一致）。
严禁引用 docs/B01-architecture/、docs/D01-data/、docs/D02-api/、docs/D03-validation/（C 与 D 隔离）。
完成后同步 changelog.md。
```

---

## 输出目录

### A. 备份依赖模式（仓库含 `design/03-implementation/`，**默认**）

```
docs/C04-prototype/<feature-id>/
  index.html              # 原型导航首页：列出所有页面 + 状态切换链接
  changelog.md            # 每次迭代追加一段
  feature.css             # 仅本 feature 的页面级样式（贴 vendor 变量，不重定义 token）
  feature.js              # 仅本 feature 的页面级交互（调 qsds.*）
  mock-data.js            # 所有接口的假数据（按 OP-ID 组织）
  vendor/qsds/            # ← 全量拷自 design/03-implementation/，不修改
    app.css
    app.js
    tokens.css
    themes.css
    parts/
  pages/
    <page-id>.html        # 页面默认态
  states/
    <page-id>.loading.html
    <page-id>.empty.html
    <page-id>.error.html
  assets/
    images/               # 占位图（字体/图标/运行时资产均走 vendor/qsds/）
```

### B. 自含模式（仓库**不**含 `design/03-implementation/`）

```
docs/C04-prototype/<feature-id>/
  index.html
  changelog.md
  styles.css              # 全部 token + 通用样式（≤ 1200 行）
  app.js                  # 路由/状态切换/mock 调度（≤ 800 行）
  mock-data.js
  pages/
    <page-id>.html
  states/
    <page-id>.loading.html
    <page-id>.empty.html
    <page-id>.error.html
  assets/
    fonts/                # 自托管字体
    icons/
    images/
```

---

## 硬约束

0. **运行时资产选型**：仓库含 `design/03-implementation/` 时，采用「备份依赖」模式（vendor 拷贝）。有且仅有不含时才可采用「自含」模式。**禁止两者混用**。
1. **零外部依赖**：不引 CDN、不用框架、不用打包器。仅原生 HTML + CSS + vanilla JS（备份依赖模式中 vendor/qsds/ 也为本地资产，不算外部依赖）。
2. **字体自托管**（除非 X 显式允许 CDN；备份依赖模式下字体走 vendor/qsds/ 中的约定）。
3. **所有颜色/字号/间距/圆角/阴影必须用 CSS 变量**：
   - 备份依赖模式：变量来自 `vendor/qsds/tokens.css` + `themes.css`，**禁止**在 feature.css 重新定义 token。
   - 自含模式：变量放 `styles.css :root` 与 `[data-mode=dark]`，与 `docs/B04-design-system/01-tokens.md` 完全一致。
4. **不得发起真实网络请求**。所有数据从 `mock-data.js` 取，键为 OP-ID。
5. **每个 P0 页面必出 4 状态文件**：默认 / 加载 / 空 / 错误。可选状态：`<page-id>.dark.html`、`<page-id>.mobile.html`。
6. **响应式**：最少在 375 / 768 / 1280 三档下视觉无破。
7. **a11y**：每个交互元素 `:focus-visible` 必有焦点环；表单字段必有 `<label for>`。
8. **单文件 ≤ 1200 行**。

---

## `index.html` 规范

- 顶部一句话项目名 + X 一句话定调
- 表格列出所有页面：

| page-id | 默认 | 加载 | 空 | 错误 | 暗 | 移动 |
|---------|-----|------|----|------|----|------|
| home | [↗](pages/home.html) | [↗](states/home.loading.html) | … | … | … | … |

---

## `pages/<page-id>.html` 规范

- 顶部 HTML 注释列出：page-id、对应 R-ID、对应 OP-ID（本页交互点）、当前状态名、最后更新时间
- **备份依赖模式**：引入 `../vendor/qsds/app.css` + `../vendor/qsds/app.js`，另引 `../feature.css` + `../feature.js`；<body> 末尾调 `qsds.bootstrap()`。
- **自含模式**：引入 `../styles.css`、`../app.js`。
- DOM 结构按 `docs/C03-pages/<feature-id>/<page-id>.md` §3 区块清单
- 每个 Block 加 `data-block="Block-1"` 便于反馈定位
- 每个操作按钮加 `data-op="OP-1"` 便于反馈定位
- 文案直接走 `docs/B03-ux/04-voice-tone.md` 对照表，不卖萌

---

## `states/<page-id>.<state>.html` 规范

- 与 default 共用同一 layout 但替换内容区域
- 加载态：骨架屏（用 `<div class="skeleton">`，CSS 动画 1.4s）
- 空态：插画位（占位 SVG）+ 主文案 + 主操作按钮
- 错误态：错误图标 + 错误文案 + 重试按钮 + 折叠展开"详情"

---

## `app.js` 规范（仅自含模式）

> 备份依赖模式不写 `app.js`，本 feature 交互全部调 `vendor/qsds/app.js` 暴露的 `qsds.*` API，页面级逻辑放 `feature.js`。

```js
// 全局命名空间
window.PROTO = {
  goto(pageId, state = 'default') { /* 切换页面 */ },
  mockApi(opId, params) { return MOCK[opId](params); },
  switchTheme(theme) { document.documentElement.dataset.mode = theme; },
};

// 顶栏：环境徽标（红色"PROTOTYPE"）
// 状态切换：右上角浮窗，能在当前 page 切换 default/loading/empty/error
```

---

## `mock-data.js` 规范

```js
window.MOCK = {
  'OP-1': () => ({ code: 0, data: { items: [...], total: 12 } }),
  'OP-2': (params) => { /* ... */ },
  // 每个 OP-ID 都给一组成功 + 一组失败 fixture
};
```

---

## `changelog.md` 规范

```markdown
# 原型变更日志

## v1 · YYYY-MM-DD · 首版
- 页面：home, course-list, course-detail, login, me（默认+4 状态）
- token：以 docs/B04-design-system/01-tokens.md v1 同步
- 已知不同点：<>

## v2 · YYYY-MM-DD · 反馈轮 1
- 应反馈 docs/C04-prototype/<feature-id>/_input/feedback-round1.md：
  - F-1 → pages/course-detail.html Block-1 主 CTA 改为粘性
  - F-2 → styles.css --color-brand-default 改为 brand-700
  - 全局：表格行高 40 → 36，已同步 docs/B04-design-system/01-tokens.md
```

---

## 输出质量自检

- [ ] 已明确选型：备份依赖 vs 自含？备份依赖模式下未重定义 token？
- [ ] 双击 `index.html` 在浏览器能跑，无 404、无控制台报错？
- [ ] 所有 page-id 与 `docs/C02-ia/<feature-id>/02-pages.md` 一致？
- [ ] P0 页面 4 状态齐？
- [ ] 颜色 / 字号 / 间距 / 圆角全用 CSS 变量（与 docs/B04-design-system/01-tokens.md 一致）？
- [ ] 未出现 docs/B01-architecture/、docs/D01-data/、docs/D02-api/、docs/D03-validation/ 的任何引用？
- [ ] 字体自托管（除非 X 允许 CDN）？
- [ ] mock-data.js 键都是 OP-ID（与 C03 页面一致）？
- [ ] 焦点环可见？表单 `<label for>` 齐？
- [ ] 移动端 375 下无横向滚动？
- [ ] changelog 已更新？
- [ ] 单文件 ≤ 1200 行？
