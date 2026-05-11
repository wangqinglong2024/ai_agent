<!-- TARGET-PATH: design/02-design-system/05-components/02-forms.md -->

# 组件：表单族（Input / Textarea / Select / Checkbox / Radio / Switch / DatePicker / FileUpload）

## 用途与禁忌

- 用：所有数据采集场景。
- 禁：占位符 (`placeholder`) 充当 label；将必填用纯红字 `*` 不带说明；将错误信息隐藏在 tooltip 里。

---

## 一、Input / Textarea

### 尺寸

| 尺寸 | 高度 | padding | 字号 |
|------|------|---------|------|
| sm | 34px | 0 12px | 14px |
| md（默认） | 44px | 0 14px | 17px |
| lg | 52px | 0 16px | 18px |
| elder | 64px | 0 20px | 22px |

Textarea 默认 4 行 (`min-height: 116px`)，可调高度。

### Anatomy

```
┌─────────────────── Field ───────────────────┐
│ [Label  *(必填红)]                          │  ← 14px display
│ ┌─────────────────────────────────────┐   │
│ │  [icon]  输入文本             [clear]│   │  ← 44px input
│ └─────────────────────────────────────┘   │
│ Help / Error  (13px)                        │
└─────────────────────────────────────────────┘
```

### 状态

| 状态 | 边框 | 背景 | 备注 |
|------|------|------|------|
| default | `1px solid var(--color-neutral-300)` | `rgba(255,251,240,.92)` | 几乎实色保可读 |
| hover | `var(--color-neutral-400)` | 同上 | — |
| focus-visible | `1px solid var(--color-brand-default)` + `--focus-ring` | 同上 | — |
| disabled | `var(--color-neutral-200)` | `var(--color-neutral-50)` | 文字 `--color-neutral-400` |
| readonly | 同 default 但 `cursor: default` | 浅一档 | — |
| error | `1px solid var(--color-danger-500)` + `0 0 0 4px var(--color-danger-50)` | — | 下方 13px `--color-danger-700` |

### 暗色模式

- 输入框背景：`rgba(20,48,79,.42)`；文字 `var(--color-neutral-50)`。

---

## 二、Select / Combobox

- 触发态视觉同 Input；
- 弹层用 `Popover`（详见 08），玻璃 `var(--glass-2)` + blur 22px；
- 选项 hover：`var(--glass-tint)`；选中：`var(--color-brand-50)` + `var(--color-brand-default)` 文字 + 右侧 ✓；
- 键盘：↑↓ 选择，Enter 确认，Esc 关闭，输入即筛选；
- 多选：选中项以 Tag 形式呈现在触发框内，超出折叠为 `+N`。

---

## 三、Checkbox

- 框 18×18，圆角 4px；
- 未选：边框 `var(--color-neutral-400)` + 透明底；
- 选中：背景 `var(--color-brand-default)` + 暖白 ✓；
- 键盘：Space 切换；focus 加 `--focus-ring`。

---

## 四、Radio

- 圆 18×18；
- 选中：环 `var(--color-brand-default)` + 内圆 8px；
- 同组内键盘 ↑↓ / ←→ 切换。

---

## 五、Switch

- 38×22 椭圆，圆角 999px；
- off：背景 `var(--color-neutral-300)` + 内圆 18×18 暖白偏右；
- on：背景 `var(--color-brand-default)` + 内圆移到右；
- 过渡 `var(--motion-base)`；
- 不允许"切换即生效但无 toast 反馈"——必须有视觉/语义反馈。

---

## 六、DatePicker

- 触发 = Input + 右侧 calendar icon；
- 弹层 320×320 玻璃面板，年月可下拉切换；
- 当日：圆点 + brand；选中：圆角 8 实色 brand；范围：起止两端实色 + 中间 `var(--color-brand-50)` 浅染；
- 键盘：方向键移动，Enter 选定，PgUp/PgDn 上下月。

---

## 七、FileUpload

- 拖放区：玻璃 `var(--glass-3)` + 1px 虚线 `var(--color-brand-300)` + cloud icon + "拖入文件或点击选择"；
- 拖入高亮：边框 `var(--color-brand-default)` + 背景 `var(--color-brand-50)`；
- 列表：每文件一行，左 icon + 中文件名 + 右进度 + 删除 IconButton；
- 错误：行变 `var(--color-danger-50)` 底 + 朱砂边 + 下方错误说明。

---

## 八、Form 容器规则

- 标准纵向 Form：字段间距 `var(--space-5)`，每字段 label 在上 input 在下；
- Label 字体 `var(--font-display)`，字号 14px，letter-spacing 1px；
- 必填：label 后加 `<span class="field-required">*</span>` 朱砂；
- Help / Error：紧贴 input 下方 `var(--space-1)` 间距，13px；
- 提交按钮：右下角，主按钮配次按钮"取消/重置"；
- 离开未保存保护：见 `06-interactions.md`。

---

## 九、a11y 验收点

- [ ] 所有 input 必有 `<label for>` 或 `aria-label`；
- [ ] 错误用 `aria-invalid="true"` + `aria-describedby`；
- [ ] 必填 `aria-required="true"`；
- [ ] focus 顺序逻辑、焦点环可见；
- [ ] error 文字对比 ≥ 4.5:1。
