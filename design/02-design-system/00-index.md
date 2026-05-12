<!-- TARGET-PATH: design/02-design-system/00-index.md -->

# 设计系统 · 索引（默认规范）

> **阶段对位**：prompt/B-foundation/B04-S03 AI 输出 · 设计系统
> **冻结状态**：已冻结 · v1.0 · 2026-05-11
> **上游硬约束**：`design/01-experience/` 全部
> **下游使用**：所有项目的 N（页面交互）/ H（HTML 原型）/ 工程实现 必须引用本目录的 token 与组件契约。

---

## 文件清单

| # | 文件 | 职责 |
|---|------|------|
| 01 | [01-tokens.md](./01-tokens.md) | 颜色 / 字体 / 字号 / 字重 / 间距 / 圆角 / 阴影 / 动效 / z-index（含 5 套主题色 + 亮暗双模） |
| 02 | [02-layout.md](./02-layout.md) | 栅格 / 断点 / 容器 / 页面骨架 / 滚动策略 |
| 03 | [03-navigation.md](./03-navigation.md) | TopBar / 面包屑 / Tabs / Pagination / 移动 BottomBar |
| 04 | [04-status-colors.md](./04-status-colors.md) | 4 状态色 + 焦点环 + 禁用态 |
| 05 | [05-components/](./05-components/00-index.md) | 12 个核心组件契约（5 状态 + 异常态 + a11y） |
| 06 | [06-interactions.md](./06-interactions.md) | 焦点 / 键盘 / 滚动 / 拖拽 / 复制粘贴 / 防抖 / 离开保护 |
| 07 | [07-responsive-dark.md](./07-responsive-dark.md) | 响应式断点行为 + 亮暗双模映射 + 主题色切换实现 |

---

## 0. 摘要

1. **唯一 token 源**：所有颜色 / 字体 / 间距走 `--*` CSS 变量，禁止 hex 硬编码。
2. **三档切换轴**：`data-mode`（亮/暗）× `data-accent`（5 主题）× `data-density`（默认/紧凑/适老），完全正交，运行时切换。
3. **组件 5 状态契约**：每个组件必出 default / hover / focus-visible / active / disabled / loading 6 态 + empty / error 异常态。
4. **a11y 兜底**：所有可聚焦元素 4px 焦点环；色对比 ≥ WCAG AA；动效可关。
5. **性能契约**：单页 `backdrop-filter` 元素 ≤ 30；流体场景 ≤ 1；长列表 > 50 行降级实色。

---

## 99. 待确认问题

无（已冻结）。
