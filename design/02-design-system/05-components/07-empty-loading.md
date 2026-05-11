<!-- TARGET-PATH: design/02-design-system/05-components/07-empty-loading.md -->

# 组件：Empty / Skeleton / Spinner / ProgressBar

## Empty（空态）

铁律：**任何空态必须给"下一步"**。

```
┌──────────────────────────────┐
│        [插画 96px / icon]     │   ← 不允许 emoji，可用 SVG 线性图
│                              │
│       暂无数据                 │   ← H3 size，display 字体
│       点击右上角「新建」开始    │   ← 14px，gray-500
│                              │
│         [+ 新建]               │   ← 主按钮（如有权限）
└──────────────────────────────┘
```

- 容器：玻璃 `var(--glass-3)` + `var(--radius-xl)` + 居中
- 高度：≥ 280px
- 插画推荐 SVG 线条（黑灰单色 + brand 点缀），**禁用**3D 卡通插画

---

## Skeleton（骨架屏）

- 形态：圆角矩形，背景 `linear-gradient(90deg, var(--color-neutral-100) 25%, var(--color-neutral-50) 50%, var(--color-neutral-100) 75%)` + 1.4s shimmer
- `prefers-reduced-motion` 下停止 shimmer，仅静态浅灰
- 用于：表格行 / 卡片 / 头像 / 文本行
- 显示时长 ≤ 1.2s 时建议直接显示 spinner（避免闪烁）

---

## Spinner

- 24×24（默认） / 16×16（按钮内） / 32×32（全屏）
- 圆环 2px，颜色 `var(--color-brand-default)`，旋转 1s linear 无限
- `prefers-reduced-motion`：换为 1s opacity 呼吸（0.4 ↔ 1）

---

## ProgressBar

- 高度 8px（默认） / 4px（紧凑） / 12px（强调）
- 圆角 999px
- 背景 `rgba(229,220,199,.7)` 浅米
- 进度条 `linear-gradient(90deg, var(--color-brand-500), var(--color-brand-700))`
- 可附文字：右侧 `tabular-nums` "67%"
- 不确定态：动画从左到右扫过 ×3 一档，循环

---

## a11y 验收点

- [ ] Spinner / ProgressBar 必带 `role="progressbar"` + `aria-valuenow|aria-valuemax`（不确定态用 `aria-busy="true"`）
- [ ] Empty 主操作按钮焦点可达
