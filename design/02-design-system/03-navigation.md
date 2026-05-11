<!-- TARGET-PATH: design/02-design-system/03-navigation.md -->

# 导航

---

## 一、TopBar

### 1.1 形态

| 维度 | PC | 移动 |
|------|----|----|
| 高度 | 76px | 56px |
| 背景 | `linear-gradient(180deg, rgba(20,48,79,.62), rgba(14,31,56,.72))` 玻璃 | 同 PC |
| 模糊 | `saturate(180%) blur(28px)` | `saturate(160%) blur(16px)` |
| 文字色 | `#FFF8E7` 暖白（**禁纯白 #FFF**） | 同 PC |
| 描边 | 底 1px `rgba(255,250,235,.18)` | 同 PC |
| 阴影 | 滚动 > 8px 后加 `--shadow-2` | 同 PC |
| z | `--z-topbar` | 同 PC |

### 1.2 内部结构（左 → 右）

```
[Brand 区]               [Nav 区(center)]            [Actions 区]
┌────────────────┐  │  ┌─────────────────┐  │  ┌──────────────────────┐
│ logo · 品牌名 · │  │  │ Nav1  Nav2(active)│  │  │ 搜索 · 通知 · 头像   │
│   副标(可选)   │  │  │ Nav3  Nav4 ...    │  │  │                       │
└────────────────┘  │  └─────────────────┘  │  └──────────────────────┘
flex-shrink: 0       flex: 1; nowrap; overflow:hidden    flex-shrink: 0
```

### 1.3 三级辨识（同账户多端）

| 端 | data-属性 | 视觉差异 |
|----|----------|---------|
| 默认 | `<header class="topbar">` | 标准玻璃青 |
| 后台 | `<header class="topbar" data-topbar-variant="admin">` | 更深 `linear-gradient(180deg, rgba(8,18,34,.70), rgba(14,31,56,.80))` |
| 适老 | `<header class="topbar" data-density="elder">` | 高度 96px，nav-item 64px，字号 +30% |

### 1.4 Nav 激活态

- 文字：暖白
- 背景：`rgba(255,250,235,.14)`
- 底部：朱砂细线 2px = `var(--color-danger-500)`（**主题色无关**：保证激活态在所有 accent 下都醒目；如确需跟随主题色可设 `data-active-line="brand"`）
- **禁止**整体填色块

---

## 二、面包屑 Breadcrumb

- 字号 13px，色 `var(--color-neutral-500)`
- 分隔符 `/`，色 `var(--color-neutral-300)`
- 当前页色 `var(--color-brand-default)`
- 移动端默认隐藏，>= md 显示

```
首页 / 二级 / 三级 / 当前页
```

---

## 三、Tabs

### 3.1 页面级 Tabs（顶部主切换）

- 底部下划线 2px，激活色 `var(--color-brand-default)`，过渡 200ms
- 字号 16px，间距 24px
- hover 文字加深一档

### 3.2 组件级 Tabs（卡片内）

- 玻璃胶囊式：`background: var(--glass-tint); border-radius: var(--radius-pill)`
- 激活：`background: var(--color-brand-default); color: var(--color-brand-on)`
- 高度 32px，字号 14px

---

## 四、Pagination

```
[‹]  1  2  [3]  4  5  ...  20  [›]    每页 [20 ▾]    共 1,234 条
```

- 数字按钮 32×32，圆角 8px，激活态 `bg = var(--color-brand-default)`
- 页码字必须 `tabular-nums`
- 移动端简化：`[‹] 3 / 20 [›]`

---

## 五、移动端 BottomBar（移动主导航）

仅当移动端无 TopBar Nav 时启用：

- 高度 64px，玻璃 `var(--glass-2)`
- 4~5 个 Tab，图标 24px + 文字 11px
- 激活态：图标 + 文字 `var(--color-brand-default)` + 顶 2px 下划线
- 安全区：`padding-bottom: env(safe-area-inset-bottom)`

---

## 六、抽屉式"更多"菜单

从右滑入，玻璃 `var(--glass-2)`，最大宽 80vw / 360px。
打开同时遮罩 `rgba(14,31,56,.55) + blur(6px)`。

---

## 七、命令面板（可选）

`Cmd/Ctrl + K` 唤起：

- 居中，420px × 480px，玻璃 `var(--glass-2)`，圆角 `--radius-xl`
- 输入框无边框，48px 高，字号 18px
- 命令分组，每行 hover `var(--glass-tint)`
- 键盘可达 100%（↑↓ 选择，Enter 执行，Esc 关闭）
