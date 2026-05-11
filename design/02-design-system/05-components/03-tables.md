<!-- TARGET-PATH: design/02-design-system/05-components/03-tables.md -->

# 组件：Table

## 用途与禁忌

- 用：结构化二维数据展示。
- 禁：超过 7 列在 PC 默认密度下出现（必须横滚或卡片化）；用 Table 排版（请用 Grid）；斑马纹（不符合"沉静克制"）。

---

## 容器

```html
<section class="glass-strong card">
  <header class="tbl-toolbar">…搜索 / 过滤 / 批量操作 / 列设置…</header>
  <div class="tbl-scroll">
    <table class="tbl">…</table>
  </div>
  <footer class="tbl-footer">…分页 / 总数…</footer>
</section>
```

- 容器：`glass-strong` + `--radius-xl` + `overflow:hidden`
- 表头 sticky；可排序列右侧附 ↕ 图标
- 行 hover：`var(--glass-tint)`
- 行底线：1px 虚线 `var(--color-neutral-100)`
- 选中行：`var(--color-brand-50)` + 左侧 3px brand 实条
- **禁止**斑马纹

---

## 列宽与对齐

| 类型 | 对齐 | 字体 |
|------|------|------|
| 文本 | 左 | `--font-sans` |
| 数字 | 右 | `--font-sans` + `tabular-nums` |
| 时间 | 左 | `--font-mono` 或 `tabular-nums` |
| 操作 | 右 | — |
| 状态 Tag | 左 | — |

---

## 尺寸（行高）

| density | 表头 | 行 |
|---------|------|----|
| default | 48 | 44 |
| compact | 40 | 36 |
| elder | 64 | 64 |

---

## 状态

- default：见上
- hover：`var(--glass-tint)`
- selected：`var(--color-brand-50)` + 左 3px brand
- focus-row（键盘）：外发光 `--focus-ring` 套整行
- disabled：opacity .45
- loading：表体覆盖 skeleton（详见 07-empty-loading）
- empty：表体替换为 EmptyState 组件（提供"立即创建"主操作）
- error：表体替换为错误卡（"加载失败"+ 重试按钮）

---

## 排序 / 筛选 / 分页

- 排序：单击列头切换 asc / desc / none；当前排序列附朱砂细线 + 箭头
- 筛选：列头右上角漏斗 IconButton，点击弹 Popover（详见 08）
- 分页：表底右对齐，详见 `03-navigation.md` § Pagination

---

## 批量操作

- 表头第一列 Checkbox 全选；
- 选中后 toolbar 切换为"已选 N 项 · 批量删除 · 批量导出"
- 必须保留"取消选中"按钮

---

## 移动端策略

- < md 时，表格自动转为"卡片列表"形态：每行变成一张卡，主字段大字 + 次要字段灰字 + 操作右下角；
- 或保留表格但容器水平滚动（`overflow-x: auto`），首列 sticky。

---

## a11y 验收点

- [ ] `<table>` 必带 `<caption>`（screen reader 用，可视觉隐藏）
- [ ] `<th scope="col|row">`
- [ ] 排序列附 `aria-sort="ascending|descending|none"`
- [ ] 全选 Checkbox `aria-label="全选"`
