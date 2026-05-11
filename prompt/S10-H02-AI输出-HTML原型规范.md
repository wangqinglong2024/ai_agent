# 34 · H02 AI 输出：HTML 原型规范

> **阶段**：H HTML 原型
> **谁产出**：AI（前端原型工程师）
> **落盘**：`docs/S10-prototype/`
> **目的**：把 X/S/I/N 实化为可点开看的纯 HTML，零依赖、本地双击 `index.html` 就能跑。原型只承担"看效果 + 走通流程"，不承担生产工程化。

---

## 触发提示词（首版）

```
请你扮演"前端原型工程师"，遵循 /prompt/S00-01、/prompt/S00-03、/prompt/S00-04，硬性遵守 docs/S06-ux/、docs/S07-design-system/、docs/S08-ia/、docs/S09-pages/。
按 /prompt/S10-H02-AI输出-HTML原型规范.md 输出一整套零依赖 HTML 原型，
落盘到 docs/S10-prototype/。
所有 token 直接以 :root CSS 变量呈现，与 docs/70 01-tokens 一字不差。
所有页面引用 page-id 与 docs/S08-ia 02-pages 完全一致。
P0 页面必须出 4 份独立状态文件（默认 / 加载 / 空 / 错误）。
本期 mock 的接口数据放 mock-data.js。
完成后同步 changelog.md。
```

---

## 输出目录

```
docs/S10-prototype/
  index.html              # 原型导航首页：列出所有页面 + 状态切换链接
  changelog.md            # 每次迭代追加一段
  styles.css              # 全部 token + 通用样式（≤ 1200 行）
  app.js                  # 路由/状态切换/mock 调度（≤ 800 行）
  mock-data.js            # 所有接口的假数据（按 API-ID 组织）
  pages/
    <page-id>.html        # 页面默认态
  states/
    <page-id>.loading.html
    <page-id>.empty.html
    <page-id>.error.html
  assets/
    fonts/                # 自托管字体
    icons/                # SVG sprite
    images/               # 占位图
```

---

## 硬约束

1. **零外部依赖**：不引 CDN、不用框架、不用打包器。仅原生 HTML + CSS + 一份 vanilla JS。
2. **字体自托管**（除非 X 显式允许 CDN）。
3. **所有颜色/字号/间距/圆角/阴影必须用 CSS 变量**（与 `docs/70 01-tokens.md` 完全一致）。变量定义放 `styles.css :root` 与 `[data-theme=dark]`。
4. **不得发起真实网络请求**。所有数据从 `mock-data.js` 取。
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

- 顶部 HTML 注释列出：page-id、对应 R-ID、对应 API-ID、当前状态名、最后更新时间
- 引入 `../styles.css`、`../app.js`
- DOM 结构按 `docs/S09-pages/<feature-id>/<page-id>.md` §3 区块清单
- 每个 Block 加 `data-block="Block-1"` 便于反馈定位
- 每个操作按钮加 `data-op="OP-1"` 便于反馈定位
- 文案直接走 `docs/X 04-voice-tone` 对照表，不卖萌

---

## `states/<page-id>.<state>.html` 规范

- 与 default 共用同一 layout 但替换内容区域
- 加载态：骨架屏（用 `<div class="skeleton">`，CSS 动画 1.4s）
- 空态：插画位（占位 SVG）+ 主文案 + 主操作按钮
- 错误态：错误图标 + 错误文案 + 重试按钮 + 折叠展开"详情"

---

## `app.js` 规范

```js
// 全局命名空间
window.PROTO = {
  goto(pageId, state = 'default') { /* 切换页面 */ },
  mockApi(apiId, params) { return MOCK[apiId](params); },
  switchTheme(theme) { document.documentElement.dataset.theme = theme; },
};

// 顶栏：环境徽标（红色"PROTOTYPE"）
// 状态切换：右上角浮窗，能在当前 page 切换 default/loading/empty/error
```

---

## `mock-data.js` 规范

```js
window.MOCK = {
  'API-1': () => ({ code: 0, data: { items: [...], total: 12 } }),
  'API-2': (params) => { /* ... */ },
  // 每个 API-ID 都给一组成功 + 一组失败 fixture
};
```

---

## `changelog.md` 规范

```markdown
# 原型变更日志

## v1 · YYYY-MM-DD · 首版
- 页面：home, course-list, course-detail, login, me（默认+4 状态）
- token：以 docs/70 01-tokens v1 同步
- 已知不同点：<>

## v2 · YYYY-MM-DD · 反馈轮 1
- 应反馈 docs/S10-prototype/_input/feedback-round1.md：
  - F-1 → pages/course-detail.html Block-1 主 CTA 改为粘性
  - F-2 → styles.css --color-brand-default 改为 brand-700
  - 全局：表格行高 40 → 36，已同步 docs/70 01-tokens.md
```

---

## 输出质量自检

- [ ] 双击 `index.html` 在浏览器能跑，无 404、无控制台报错？
- [ ] 所有 page-id 与 `docs/S08-ia/02-pages.md` 一致？
- [ ] P0 页面 4 状态齐？
- [ ] 颜色 / 字号 / 间距 / 圆角全用 CSS 变量？
- [ ] 字体自托管（除非 X 允许 CDN）？
- [ ] 焦点环可见？表单 `<label for>` 齐？
- [ ] 移动端 375 下无横向滚动？
- [ ] changelog 已更新？
- [ ] 单文件 ≤ 1200 行？
