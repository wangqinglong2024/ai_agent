<!-- TARGET-PATH: design/02-design-system/02-layout.md -->

# 全局布局

---

## 一、断点

| 名称 | min-width | 适用 |
|------|-----------|------|
| sm | 640 | 大手机横屏 / 小平板 |
| md | 768 | 平板竖屏 |
| lg | 1024 | 平板横屏 / 小桌面 |
| xl | 1280 | 桌面（**主设计基准**） |
| 2xl | 1536 | 大桌面 |

设计稿基线：**桌面 1280×820 / 移动 375×812**。

---

## 二、栅格

- 列数：12
- gutter：`var(--space-4)` (mobile) / `var(--space-6)` (tablet+)
- 推荐使用 CSS Grid，禁止使用 Bootstrap-style float 栅格

---

## 三、容器（**流体全宽**）

| 容器 class | max-width | 内边距（左右，随断点变化） | 用途 |
|------|-----------|---------------|------|
| `.container` | **none** —— 跟随浏览器宽度 | 16 → 28 → 36 → 48 → 64 → 96 px（sm/md/lg/xl/2xl/超大屏） | 全宽页面（默认） |
| `.container-narrow` | `880px` | 同上 padding | 阅读 / 长文 |
| `.container-form` | `640px` | 同上 padding | 表单中卡 |

> **铁律**：`.container` **不设最大宽度**。任何"两侧大块留白 + 中间窄内容"的写法一律返工。
> 大屏（≥ 1920）通过 `--container-pad: 96px` 增加两侧呼吸空间，不通过 `max-width` 收窄；超大屏要求"撑开 + 加 padding"，不是"留白 + 居中"。
> 表格 / Dashboard / 后台主体页 一律用 `.container`（全宽）。
> 写文章 / 设置 / 单表单 才用 `.container-narrow` / `.container-form`。

---

## 三 ·补、断点与设计基准

- 设计稿基线：**桌面 1440×900 / 移动 375×812**。
- ≥ 1920（超宽屏 / 4K 部分窗口）：通过 `--container-pad: 96px` 与组件最大宽自调；不要让单列内容跨度超过 1600 字宽。
- ≥ 2560（4K 全屏）：建议页面内**多列**消化宽度（如双栏 dashboard），而不是把单列拉满。

---

## 四、通用页面骨架

```
┌────────────── TopBar (h=76, glass) ──────────────┐
│ Brand · Nav (center) · Actions (search/avatar)   │
├──────────────────────────────────────────────────┤
│ [Breadcrumb 面包屑]                               │
│ [H1 + 副标 ─────────── Actions 按钮组]            │
│                                                  │
│ ┌──────────┐ ┌────────────────────────────────┐ │
│ │ 侧边过滤 │ │ 主内容（卡片 / 表格 / 表单）   │ │
│ │ (可选)   │ │                                │ │
│ └──────────┘ └────────────────────────────────┘ │
│                                                  │
│ [底部分页 / 底部操作栏（可选 sticky）]            │
└──────────────────────────────────────────────────┘
```

- TopBar 永远 sticky 顶部，z-index `--z-topbar`。
- **禁止**侧栏一级导航（一级导航全部走 TopBar）；侧栏仅作页内过滤 / 子导航。
- 移动端见 `03-navigation.md` § BottomBar。

---

## 五、滚动策略

- 页面滚动：`html` 滚动，`body { overflow-x: hidden }` 防横滚。
- 表格/长列表：容器内独立滚动，外层固定高度，配合 `position: sticky` 表头。
- 模态：模态打开时 `body` 加 `data-scroll-lock="true"` 锁滚（保留滚动条占位防跳动）。
- 抽屉：抽屉外的 `body` 同样锁滚。

---

## 六、Sticky 头部规则

| 元素 | sticky | 阴影规则 |
|------|--------|---------|
| TopBar | 必 sticky | 滚动 > 8px 时加 `--shadow-2` |
| 表格表头 | sticky | 滚动 > 0 时加 `--shadow-1` |
| 页面 H1 区 | 不 sticky（默认） | — |
| 底部操作栏 | sticky bottom | 始终 `--shadow-3` 朝上 |

---

## 七、安全区（移动）

```css
.app-shell {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}
```

---

## 八、可打印

- `@media print { ... }` 隐藏 TopBar / 侧栏 / 底部操作栏；
- 玻璃面板降级为白底 + 1px 灰边；
- Three.js canvas 隐藏。
