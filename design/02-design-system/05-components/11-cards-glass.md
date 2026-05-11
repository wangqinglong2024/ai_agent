<!-- TARGET-PATH: design/02-design-system/05-components/11-cards-glass.md -->

# 组件：Card / GlassPanel

## Card（默认卡）

```
┌──────────────────────────────┐
│ [Header（可选）：标题 + 操作]   │
├──────────────────────────────┤
│ 主体内容                      │
├──────────────────────────────┤
│ [Footer（可选）：操作按钮组]   │
└──────────────────────────────┘
```

- 容器：`var(--glass-1)` + `var(--glass-blur)` + `var(--glass-border)` + `--radius-lg` + `var(--glass-shadow)`
- padding：22 24
- Header：`--font-display` 18px，下分隔 1px `var(--color-neutral-100)`
- Footer：右对齐操作按钮，上分隔同 Header
- 顶部高光：`inset 0 1px 0 rgba(255,250,235,.65)`（已含在 `--glass-shadow`）

---

## GlassPanel 变体

| 类名 | 视觉 | 用途 |
|------|------|------|
| `.glass` | 默认 0.55 暖白 | 普通容器 |
| `.glass-strong` | 0.72 暖白 + 24×28 padding | 关键面板 / 表格容器 |
| `.glass-tint` | 月白瓷蓝 0.45 | 强调 / 信息卡 |
| `.glass-bar` | 横向条形（工具栏 / 二级 TopBar） | 工具栏 |
| `.glass-hoverable` | 悬浮上浮 + 加深 | 可点击卡 |
| `.glass-dark` | `--glass-dark` 反白底 | hero / 暗 banner |

---

## 卡片密度

| density | padding | header h | gap |
|---------|---------|----------|-----|
| default | 22×24 | 56 | 16 |
| compact | 16×18 | 44 | 12 |
| elder | 28×32 | 72 | 24 |

---

## 印鉴角标（可选装饰）

`.card-corner-seal`：右上 -10 -10 处附 `.seal-sm`（朱砂方印 28×28），用于已审定 / 签名 / 终稿场景。**禁止**滥用。

---

## a11y 验收点

- [ ] 可点击卡用 `<button>` 或 `<a>` 包裹整卡，焦点环可见
- [ ] 不要把整张卡变成"看似可点其实不可点"
