<!-- TARGET-PATH: design/02-design-system/05-components/06-toasts-alerts.md -->

# 组件：Toast / Alert / Banner

## Toast（短时浮提示）

- 位置：顶部居中，距顶 20px
- 形态：暖白玻璃 `var(--glass-2)` + 22px blur + 左侧 4px 语义色条
- 字号 14px，padding 12×22，圆角 14px
- 时长：默认 2.4s，可配置 1~6s
- 进入 / 退出：opacity + translateY 4px，250ms
- 同时最多 3 个，新到推到顶部，旧的下移
- **不允许**带按钮（操作请用 Banner / Alert）

```js
qsds.toast("已保存");                     // info
qsds.toast("保存失败：网络中断", "danger");
```

---

## Alert（行内提示卡）

- 形态：圆角 12px，左侧 4px 语义色条，对应背景 `--color-{state}-50`，文字 `--color-{state}-700`
- 4 状态：success / warning / danger / info
- 尺寸：padding 12×16；带图标 16px
- 可关闭：右上 `×` IconButton

---

## Banner（顶部全宽公告）

- 全宽 sticky 顶部，高 44px
- 玻璃底，左 icon + 中文案 + 右"了解更多 / ×"
- 4 状态色映射同 Alert
- 同时最多 1 个

---

## 文案规则

严格遵守 `01-experience/04-voice-tone.md`：

- 禁感叹号 / emoji
- 错误必须 = 现象 + 原因 + 下一步
- 长度：Toast ≤ 18 字 / Alert ≤ 60 字 / Banner ≤ 30 字

---

## a11y 验收点

- [ ] Toast 容器 `role="status"` + `aria-live="polite"`
- [ ] danger Toast：`role="alert"` + `aria-live="assertive"`
- [ ] Alert 关闭按钮 `aria-label="关闭"`
- [ ] 不依赖颜色（必带图标）
