<!-- TARGET-PATH: design/02-design-system/05-components/10-tabs-accordion.md -->

# 组件：Tabs / Accordion / Stepper

## Tabs

详见 `02-design-system/03-navigation.md` § Tabs。
组件契约补充：

- 切换动效：内容区 opacity 0→1，120ms
- 异步加载内容：切换时显示 Skeleton
- 数量：≥ 6 个 tab 在移动端必须横滚，左右各 8px 渐隐遮罩

---

## Accordion

- 项容器：玻璃 `var(--glass-1)` + `--radius-md`
- 标题行：48 高，左 16 padding，右 ↓ icon 旋转 180° 表示展开
- 展开内容：padding 16，分隔线 1px `var(--color-neutral-100)`
- 默认单展开（其他自动收起）；可配 `data-multi="true"` 多展开
- 键盘：↑↓ 切换 / Enter / Space 展开收起

```
┌─────────────────────────────┐
│ 问题标题                  ↓  │
└─────────────────────────────┘
┌─────────────────────────────┐
│ 问题标题                  ↑  │
├─────────────────────────────┤
│ 答案内容…                    │
└─────────────────────────────┘
```

---

## Stepper（步骤条）

### 横向

```
①────────②────────③
完成      进行中    未开始
```

- 圆点 28×28；完成态 brand 实色 + 暖白 ✓；进行中 brand 描边 + 数字；未开始 neutral-300 描边 + 数字
- 连接线 2px，已完成段 brand，未到段 neutral-200
- 标题 14，描述 12 gray-500

### 纵向

每步占一行，圆点在左 + 内容在右；适合分步表单。

---

## a11y 验收点

- [ ] Tabs：`role="tablist"` / `role="tab"` / `role="tabpanel"`，`aria-selected`、`aria-controls`、`aria-labelledby`
- [ ] Accordion：触发按钮 `aria-expanded`、`aria-controls`
- [ ] Stepper：当前步 `aria-current="step"`
