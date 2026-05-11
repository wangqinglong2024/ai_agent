<!-- TARGET-PATH: design/02-design-system/05-components/05-drawers.md -->

# 组件：Drawer（侧抽屉）

## 用途与禁忌

- 用：多步表单 / 长详情 / 不阻塞主流程的编辑面板。
- 禁：用 Drawer 替代页面（如果是独立信息架构请走路由）；同时打开 ≥ 2 个 Drawer。

---

## 形态

| 维度 | PC | 移动 |
|------|----|----|
| 方向 | 右 | 右 / 全屏 |
| 宽度 | sm 360 / md 480 / lg 640 / xl 880，最大 90vw | 100vw |
| 高度 | 100vh | 100vh |
| 背景 | `var(--glass-2)` + `var(--glass-blur-lg)` | 同 |
| 描边 | 左侧 1px `var(--glass-border-strong)` | — |
| 进入 | translateX(100% → 0)，220ms | 同 |

---

## Anatomy

```
┌────────────────────────────┐
│ H3 标题       [×]            │  ← sticky top
├────────────────────────────┤
│                            │
│  正文（可滚动）              │
│                            │
├────────────────────────────┤
│           [取消] [保存]      │  ← sticky bottom
└────────────────────────────┘
```

- 顶 footer 都 sticky，保证长内容滚动时操作可见
- 顶部 56~64px / 底部 64~72px，玻璃同 Drawer

---

## 状态 / 行为

- 同 Modal：Esc 关、点击遮罩关、焦点陷阱、关闭后焦点回归
- 区别：默认**不锁滚 body**（业务上 Drawer 常作为"侧编辑"，主页可以同时滚动）；如需锁滚加 `data-scroll-lock="true"`

---

## 与 Modal 选择

| 场景 | 选 |
|------|----|
| ≤ 5 字段简单确认 | Modal |
| 长表单 / 详情查看 | Drawer |
| 阻塞式高优先级提示 | Modal |
| 不打断主流程的编辑 | Drawer |

---

## a11y 验收点

- [ ] `role="dialog"` + `aria-modal="true"`（即使非阻塞，键盘焦点也应陷阱）
- [ ] `aria-labelledby` 指向标题
- [ ] 焦点陷阱有效
- [ ] 关闭后焦点回归
