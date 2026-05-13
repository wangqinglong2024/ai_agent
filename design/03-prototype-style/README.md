# 03-prototype-style · 可运行资产

> 这是 QSDS（青花宋韵 Design System）的**可运行**实现层。HTML 原型直接 `<link>` / `<script>` 引入即可获得本设计系统的全部默认样式与运行时行为。

## 文件

```
03-prototype-style/
├── README.md                ← 本文件
├── tokens.css               ← 基础 token（默认 ink + light + default 密度）
├── themes.css               ← 5 套 accent 覆盖 + 暗色覆盖 + 密度覆盖
├── app.css                  ← 一键聚合入口（@import）
├── app.js                   ← 运行时（qsds 命名空间）
└── parts/
    ├── 01-base.css          ← html/body/page-bg/scrollbar/seal/divider-cn/ai-disclaimer
    ├── 02-glass.css         ← .glass / .glass-strong / .glass-tint / .glass-bar / .glass-hoverable
    ├── 03-topbar.css        ← TopBar
    ├── 04-buttons-forms.css ← 按钮 + 表单族
    ├── 05-tags-table.css    ← Tag / Chip / Table
    ├── 06-modal-dropdown.css← Modal / Drawer / Dropdown / Popover / Tooltip / Toast
    └── 07-theme-switcher.css← 设置面板 UI
```

## 引入

最小用法（一行）：

```html
<!doctype html>
<html lang="zh-CN" data-mode="light" data-accent="ink" data-density="default">
<head>
  <meta charset="utf-8">
  <!-- 防闪屏：必须在 <head> 内提前从 localStorage 套上 mode/accent/density -->
  <script>(function(){var d=document.documentElement,ls=localStorage;d.dataset.mode=ls.getItem('qsds:mode')||d.dataset.mode||'light';d.dataset.accent=ls.getItem('qsds:accent')||d.dataset.accent||'ink';d.dataset.density=ls.getItem('qsds:density')||d.dataset.density||'default';})();</script>

  <!-- 字体 -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=ZCOOL+XiaoWei&family=Noto+Sans+SC:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="./03-prototype-style/app.css">
</head>
<body>
  <main class="container"> ... </main>

  <!-- 可选：Three.js（仅当页面用 FluidCanvas） -->
  <script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"></script>
  <script src="./03-prototype-style/app.js"></script>
  <script>qsds.bootstrap();</script>
</body>
</html>
```

## 命名空间

所有 JS API 暴露在 `window.qsds`：

```ts
qsds.bootstrap()                     // 初始化全局：绑定 dropdown / modal / tabs / 设置面板 / 流体
qsds.setMode('light' | 'dark' | 'auto')
qsds.setAccent('ink' | 'cinnabar' | 'jade' | 'gold' | 'graphite')
qsds.setDensity('default' | 'compact' | 'elder')
qsds.toggleMode()
qsds.toast(message, level?)          // level: 'info' | 'success' | 'warning' | 'danger'
qsds.bindDropdowns(root?)
qsds.bindModals(root?)
qsds.bindTabs(root?)
qsds.mountSettingsPanel(triggerSel)  // 在 trigger 旁挂载设置 Popover
qsds.mountFluid(canvasEl, opts?)     // 渲染流体；opts.baseColor / accent1 / accent2
qsds.initFluid(selector?)            // 自动找 .fluid-canvas 并 mount
qsds.listAccents()                   // ['ink','cinnabar','jade','gold','graphite']
```

## 兼容性

- 现代浏览器：Chrome 100+ / Safari 15+ / Edge 100+ / Firefox 100+
- backdrop-filter 必备；不支持 fallback：玻璃面板降级为高不透明纯色
- `prefers-reduced-motion`：禁用 shimmer / 流体 / 复杂过渡

## 与 Tailwind 共用

可在 `tailwind.config.js` 中读取 token：

```js
const cssVar = (n) => `var(${n})`;
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50:  cssVar('--color-brand-50'),
          100: cssVar('--color-brand-100'),
          // ... 200~900
          DEFAULT: cssVar('--color-brand-default'),
        },
      },
      borderRadius: { md: cssVar('--radius-md'), lg: cssVar('--radius-lg'), xl: cssVar('--radius-xl') },
      boxShadow: { glass: cssVar('--glass-shadow') },
    }
  }
}
```
