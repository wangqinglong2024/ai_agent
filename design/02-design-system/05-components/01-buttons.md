<!-- TARGET-PATH: design/02-design-system/05-components/01-buttons.md -->

# 组件：Button / IconButton

## 用途与禁忌

- 用：触发动作（提交 / 跳转 / 打开模态 / 取消）。
- 禁：用 Button 当链接（导航请用 Link）；同屏出现 ≥ 2 个 `primary`；按钮文字 > 6 个汉字。

---

## 变体

| 变体 | 类名 | 形态 | 用途 |
|------|------|------|------|
| primary | `.btn-primary` | brand 渐变玻璃 + 暖白字 | 主操作（每页 ≤ 1 个） |
| secondary | `.btn-secondary` | 暖白半透 + brand 字 | 次操作 |
| ghost | `.btn-ghost` | 透明 + brand 字 | 轻量操作 / 工具栏 |
| glass | `.btn-glass` | 暖白玻璃 + 强描边 | 在玻璃面板内 |
| danger | `.btn-danger` | 朱砂渐变 + 暖白字 | 删除 / 撤销 |
| success | `.btn-success` | 翠玉渐变 + 暖白字 | 通过 / 同意 |
| iconOnly | `.btn-icon` | 36×36 / 44×44 圆角玻璃 | 工具按钮 |
| linkLike | `.btn-link` | 无背景 brand 字 + 下划线 hover | 替代 `<a>` 视觉时 |

> 历史名 `btn-cinnabar / btn-jade / btn-gold` 已收敛为 `btn-danger / btn-success` + accent 切换；如确需常驻独立色（如颁奖按钮），用 `data-tone="cinnabar|jade|gold"` 显式指定，文档同 `btn-danger`。

---

## 尺寸

| 尺寸 | 高度 | padding | 字号 | 适用 |
|------|------|---------|------|------|
| sm | 34px | 0 14px | 14px | 表内 / 工具栏 |
| md（默认） | 44px | 0 22px | 17px | 普遍 |
| lg | 52px | 0 28px | 18px | 表单提交 |
| elder | 64px | 0 32px | 22px | 适老模式 |

字体：`var(--font-display)` 衬线，letter-spacing 1px，**禁止**行楷。

---

## 状态

| 状态 | 视觉 |
|------|------|
| default | 见变体 |
| hover | 上浮 1px + 阴影 ×1.3，背景加深一档 |
| focus-visible | 加 `--focus-ring` |
| active | 下沉 1px + 阴影 ×0.7 |
| disabled | opacity .45 + 不可点 |
| loading | 文案不变 + 左侧 16px spinner，整体 disabled |

异常态：

- empty（无操作）：不显示按钮（不要灰按钮占位）。
- error（操作失败后再显示）：按钮文案不变，下方 13px 朱砂错误条。

---

## Anatomy

```
┌──────────────────────────┐
│  [icon]  按钮文案          │   ← icon 16~20px 可选；与文字 gap 8px
└──────────────────────────┘
```

---

## 行为

- 键盘：`Enter` / `Space` 触发；
- `aria-busy="true"` 在 loading；
- 二次确认（删除等）必须接 Modal 或 Popover 确认，**禁止**单击直接执行不可逆操作。

---

## 与 token 对应

```css
.btn-primary {
  height: 44px; padding: 0 22px;
  border-radius: var(--radius-md);
  font: var(--weight-semibold) var(--text-base)/1.2 var(--font-display);
  letter-spacing: 1px;
  color: var(--color-brand-on);
  background:
    linear-gradient(180deg, var(--color-brand-default), var(--color-brand-active)),
    var(--glass-1);
  backdrop-filter: var(--glass-blur);
  border: var(--glass-border);
  box-shadow: var(--glass-shadow);
  transition: var(--motion-base);
}
.btn-primary:hover { transform: translateY(-1px); box-shadow: var(--glass-shadow-lg); }
.btn-primary:focus-visible { box-shadow: var(--glass-shadow), var(--focus-ring); outline: none; }
.btn-primary:active { transform: translateY(0); }
.btn-primary[disabled] { opacity: .45; pointer-events: none; }
```

---

## 反例

- 不要：方形直角 + 实色无玻璃；
- 不要：圆角 999px 胶囊（仅 progress / avatar 用）；
- 不要：emoji 在按钮文字里。

---

## a11y 验收点

- [ ] `:focus-visible` 焦点环可见；
- [ ] disabled 时 `aria-disabled="true"`；
- [ ] 仅 icon 按钮必须 `aria-label`；
- [ ] 颜色对比 ≥ 4.5:1（gold 主题已校验通过）。
