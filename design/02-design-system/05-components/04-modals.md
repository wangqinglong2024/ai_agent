<!-- TARGET-PATH: design/02-design-system/05-components/04-modals.md -->

# 组件：Modal

## 用途与禁忌

- 用：阻塞式确认 / 编辑 / 详情；不超过 2 步流程。
- 禁：3 步以上向导（请用页面或 Drawer）；嵌套 Modal；自动弹出无用户触发。

---

## 形态（PC vs 移动 自动切换）

### PC：居中玻璃卡

- 宽度：sm 420 / md 560 / lg 720 / xl 920，最大 90vw
- 高度：自适应，最大 80vh，超出 body 内滚
- 圆角：`--radius-xl` (26px)
- 背景：`var(--glass-2)` + `var(--glass-blur-lg)`
- 描边：`var(--glass-border-strong)`
- 阴影：`var(--glass-shadow-lg)`
- 进入：opacity 0→1 + scale .96→1，200ms

### 移动：Bottom Sheet

- 宽 100%，沿底部贴边
- 圆角：`24px 24px 0 0`
- 高度：自适应，最大 88vh，可拉手向下关闭
- 进入：translateY(100% → 0)，250ms

> 双端共用一份 DOM；通过 CSS `[data-mode-mobile] .modal-mask` 区分。
> 实现细节：见 `design/03-prototype-style/app.js` `bindModals()` —— 触发时把 `.modal-mask` 移动到所在设备容器内（保 `position: fixed` 定界）。

---

## Anatomy

```
┌──────────────────────────────────┐
│  H3 标题            [×]            │  ← 18px display
├──────────────────────────────────┤
│                                  │
│  正文内容（表单 / 描述 / 列表）   │
│                                  │
├──────────────────────────────────┤
│              [取消] [主操作]      │  ← 右对齐
└──────────────────────────────────┘
```

- 关闭按钮 `×` 24×24 IconButton，右上角
- 操作区右对齐：次按钮（取消）→ 主按钮
- 危险操作（删除）：主按钮 `.btn-danger`

---

## 状态

- default / hover / focus（焦点循环锁定在 modal 内）/ disabled（提交中按钮 loading） / error（行内 Alert）
- empty：不应该出现空 modal
- loading：覆盖整个 modal body 用 Skeleton

---

## 行为

- `Esc` 关闭（除非 `data-prevent-esc="true"`）
- 点击遮罩关闭（除非 `data-prevent-mask="true"`）
- 焦点首次进入：第一个可聚焦元素（或 `data-autofocus`）
- 焦点循环：`Tab` 在 modal 内循环
- 关闭后焦点回到触发按钮
- 打开时 `body` 锁滚

---

## 遮罩

```css
.modal-mask {
  background: rgba(14,31,56,.55);
  backdrop-filter: saturate(160%) blur(6px);
}
```

---

## 嵌套确认（删除等）

不允许 Modal 嵌套 Modal。改为：在主 Modal 内用 `Popover` 做二次确认（"确认删除？[取消] [删除]"）。

---

## a11y 验收点

- [ ] `role="dialog"` + `aria-modal="true"`
- [ ] `aria-labelledby` 指向标题
- [ ] `aria-describedby` 指向正文（如有描述）
- [ ] 焦点陷阱有效
- [ ] 关闭后焦点回归
