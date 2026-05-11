<!-- TARGET-PATH: design/02-design-system/05-components/09-avatars-badges-tags.md -->

# 组件：Avatar / Badge / Tag / Chip

## Avatar

- 形态：圆形 `--radius-pill`
- 尺寸：sm 24 / md 32 / lg 40 / xl 56 / 2xl 80
- 默认：用户头像图；无图时用首字母（背景按 user-id 哈希到 brand 100~300，文字 brand-700）
- 状态点：右下角 8×8 圆点，色按状态（在线 success / 离线 neutral-300 / 忙 warning / 勿扰 danger）
- 群组 AvatarGroup：负 margin 叠层 -8px，最多显示 4 + `+N`

---

## Badge

- 红点：8×8 朱砂圆点，绝对定位右上 -2 -2
- 数字徽：min-width 18 / h 18 / 0 6 padding / 朱砂底 / 暖白字 / 圆角 999px / `tabular-nums`
- 数字 > 99 显示 `99+`

---

## Tag

> **Tag 默认色随主题色（accent）切换**，体现"主题色"统一感。

| 类名 | 视觉 | 用途 |
|------|------|------|
| `.tag` | 玻璃浅 + brand 字 | 默认 |
| `.tag-success` | success-50 + success-700 | 通过 / 完成 |
| `.tag-warning` | warning-50 + warning-700 | 待处理 |
| `.tag-danger` | danger-50 + danger-700 | 红色高亮 |
| `.tag-info` | info-50 + info-700 | 中性提示 |
| `.tag-neutral` | neutral-100 + neutral-700 | 极弱化 |

- 高度 24，字号 12，padding 0 10，圆角 `--radius-pill`
- 1px 描边同色族 200 阶
- 可关闭：右侧 12×12 `×`，hover brand-700

---

## Chip（可选中筛选标签）

- 高度 32，padding 0 14
- 选中：`background: var(--color-brand-default); color: var(--color-brand-on)` + 左侧 ✓
- 未选：`background: var(--glass-1)` + 1px 描边
- 用于过滤面板 / 多选场景

---

## a11y 验收点

- [ ] Avatar `<img alt>` 必填
- [ ] Badge 必带 `aria-label`（"3 条未读"）
- [ ] Tag 关闭按钮 `aria-label="移除 {标签}"`
- [ ] Chip 用 `<button aria-pressed>` 或 `role="checkbox"`
