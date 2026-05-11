<!-- TARGET-PATH: design/02-design-system/05-components/08-popovers-tooltips.md -->

# 组件：Popover / Tooltip / Dropdown

## 共同

- 玻璃面板 `var(--glass-2)` + `var(--glass-blur)` + `--radius-md`
- 描边 `var(--glass-border-strong)`，阴影 `var(--glass-shadow)`
- 进入 / 退出：opacity 0↔1 + 4px translate，120ms
- 自动定位（top / right / bottom / left + start / center / end），溢出屏幕时翻转
- z-index：tooltip `--z-popover` / dropdown `--z-dropdown`

---

## Tooltip

- 触发：hover 100ms 延迟显示，离开立即隐藏；键盘 focus 也触发
- 文本 ≤ 14 字，13px，`--color-neutral-50` on `--glass-dark`（即"反白"，提高对比）
- 不允许带按钮 / 链接（请用 Popover）
- 默认置顶 `top`

---

## Popover

- 任意内容（表单 / 列表 / 文字）
- 触发：click（默认） / hover（仅极少场景）
- 关闭：点击外部 / Esc
- 与 Modal 区别：Popover 不锁滚，不阻塞，附着触发元素

---

## Dropdown 菜单

- 选项行高 36 / 字号 14
- hover：`var(--glass-tint)`
- 选中：左侧 4px brand + brand 文字
- 危险项：朱砂文字
- 分组：分组标题 12px gray-500 全大写
- 分隔：1px `var(--color-neutral-200)`
- 键盘：↑↓ 选择、Enter 触发、Esc 关闭、首字母快搜

---

## 二次确认 Popover（删除）

```
┌────────────────────────────┐
│ 删除「{name}」？             │
│ 删除后无法恢复              │
│            [取消] [删除]    │
└────────────────────────────┘
```

宽 280，主按钮 `.btn-danger sm`。

---

## a11y 验收点

- [ ] `role="tooltip"` / `role="menu"` / `role="dialog"`
- [ ] 触发元素 `aria-describedby` / `aria-haspopup` / `aria-expanded`
- [ ] 焦点管理：dropdown 打开后焦点进入第一项，关闭后回到触发元素
