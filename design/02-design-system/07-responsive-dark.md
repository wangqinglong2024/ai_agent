<!-- TARGET-PATH: design/02-design-system/07-responsive-dark.md -->

# 响应式 / 亮暗双模 / 主题色切换

---

## 一、响应式断点行为

| 组件 | < md (768) | md ~ lg | ≥ xl (1280) |
|------|-----------|---------|-------------|
| TopBar | 56 高，仅 Brand + 头像；Nav 收入抽屉 | 76 高，Nav 部分显示 + "更多" | 76 高，Nav 全显示 |
| 侧栏过滤 | 隐藏，由"过滤"IconButton 唤起 Drawer | Drawer 形式 | 常驻 240~280 宽 |
| 表格 | 转卡片列表（详 03-tables） | 横滚 | 全列显示 |
| Modal | Bottom Sheet | 居中 | 居中 |
| 表单 | 单列 | 单列 / 双列 | 双列 |
| 卡片网格 | 1 列 | 2 列 | 3~4 列 |
| 字号 | 同默认（不缩） | 同 | 同 |
| 触控 | min hit-area 44×44 | — | — |

---

## 二、亮暗双模总规

### 2.1 触发方式

```html
<html data-mode="light">  <!-- 默认 -->
<html data-mode="dark">
<html data-mode="auto">   <!-- 跟随系统 prefers-color-scheme -->
```

JS 切换：

```js
qsds.setMode('dark');           // 持久化 localStorage
qsds.setMode('auto');           // 跟随系统
qsds.toggleMode();              // light ↔ dark
```

### 2.2 token 映射表

| token | 亮 | 暗 |
|-------|----|----|
| `--bg-page` | 宣纸渐变 | `linear-gradient(180deg, #0B1626 0%, #14304F 38%, #0E1F38 100%)` 墨夜渐变 |
| `--bg-page-glow` | 暖色光晕 | 淡青光晕 `radial-gradient(..., rgba(74,122,168,.10), transparent)` |
| `--glass-1` | `rgba(255,251,240,.55)` | `rgba(20,48,79,.55)` |
| `--glass-2` | `rgba(255,251,240,.72)` | `rgba(20,48,79,.72)` |
| `--glass-3` | `rgba(255,251,240,.42)` | `rgba(20,48,79,.42)` |
| `--glass-tint` | `rgba(207,221,232,.45)` | `rgba(74,122,168,.22)` |
| `--glass-border` | 暖白 .78 | 月白 .22 |
| `--glass-shadow` | 墨青阴影 .14 | 墨夜阴影 .40 |
| `--color-neutral-900` 正文 | `#1F1A14` 暖墨 | `#F2EBD7` 浅米 |
| `--color-neutral-500` 辅助 | `#6F6452` 茶灰 | `#A8C0D4` 烟蓝灰 |
| `--color-neutral-300` 边框 | `#C5BBA8` | `#3F4554` |
| 主品牌 `--color-brand-default` | `--color-brand-700`（深） | `--color-brand-400`（提亮一档） |
| 焦点环 `--focus-ring` | `0 0 0 4px rgba(46,92,138,.18)` | `0 0 0 4px rgba(168,192,212,.28)` |
| 状态色 50 | 浅色 | 半透 .18~.20 |
| 状态色 700 | 深色 | 提亮到 200 阶 |
| TopBar 背景 | 墨青玻璃 | **不变**（TopBar 在亮模式也是反白），仅 blur 一致 |

### 2.3 实现片段

详细 CSS 在 `design/03-prototype-style/themes.css`。摘要：

```css
:root, [data-mode="light"] {
  --bg-page: linear-gradient(180deg, #F8F2E0 0%, #F2EBD3 38%, #E8EFF5 100%);
  --color-neutral-900: #1F1A14;
  /* ... */
}

[data-mode="dark"] {
  --bg-page: linear-gradient(180deg, #0B1626 0%, #14304F 38%, #0E1F38 100%);
  --color-neutral-0:   #100D0A;
  --color-neutral-50:  #14304F;
  --color-neutral-900: #F2EBD7;
  --glass-1: rgba(20,48,79,.55);
  --glass-2: rgba(20,48,79,.72);
  /* 主色提亮 */
  --color-brand-default: var(--color-brand-400);
  --color-brand-hover:   var(--color-brand-300);
  --color-brand-active:  var(--color-brand-500);
  /* ... */
}

@media (prefers-color-scheme: dark) {
  [data-mode="auto"] { /* 同 [data-mode="dark"] */ }
}
```

---

## 三、主题色切换（accent）

### 3.1 触发方式

```html
<html data-accent="ink">       <!-- 默认 · 墨青 -->
<html data-accent="cinnabar">  <!-- 朱砂 -->
<html data-accent="jade">      <!-- 翠玉 -->
<html data-accent="gold">      <!-- 鎏金 -->
<html data-accent="graphite">  <!-- 古墨 -->
```

JS：

```js
qsds.setAccent('cinnabar');     // 持久化
qsds.getAccent();
qsds.listAccents();             // ['ink','cinnabar','jade','gold','graphite']
```

### 3.2 切换时同步换色的元素

- `.btn-primary` 背景渐变（主操作按钮）
- `.btn-icon` hover 色
- 链接 / `<a>`
- 焦点环 `--focus-ring`
- 表单 `:focus-visible` 描边
- Tab 激活下划线（除非 `data-active-line="danger"` 强制朱砂）
- ProgressBar 进度色
- Tag 默认色（`.tag` 无修饰类时）
- Stepper 进行 / 完成态
- 选中行左侧 3px 实条
- Three.js 流体 `baseColor / accent1`（实现 JS 动态读 CSS 变量）

### 3.3 切换时**不**换色的元素

- 状态色（success / warning / danger / info） —— 始终翠玉 / 鎏金 / 朱砂 / 青花
- 中性灰阶 / 背景渐变 / 玻璃表面
- 装饰色（朱砂印鉴恒为朱砂；鎏金 AIDisclaimer 边框恒为鎏金）
- TopBar 玻璃青底色（恒定，保品牌识别）

> **设计意图**：accent 控制"品牌强调色"，状态色 / 装饰色 / 中性色保持稳定保证语义不漂移。

### 3.4 自定义 accent

主理人可在 `themes.css` 增加 `[data-accent="<name>"]` 块，提供完整 50~900 阶 + `--color-brand-default/hover/active/on/ring`。
**必须**通过对比度自检（详 04-status-colors.md § 五），未达 AA 不允许并入。

---

## 四、密度切换

```html
<html data-density="default">  <!-- 默认 -->
<html data-density="compact">  <!-- 紧凑（开发者 / 高频操作者） -->
<html data-density="elder">    <!-- 适老 -->
```

详 01-tokens § 十五。

---

## 五、三轴正交

| 轴 | 取值 | 说明 |
|----|------|------|
| `data-mode` | light / dark / auto | 亮暗 |
| `data-accent` | ink / cinnabar / jade / gold / graphite | 主题色 |
| `data-density` | default / compact / elder | 密度 |

任意组合皆有效。例：

```html
<html data-mode="dark" data-accent="jade" data-density="compact">
```

= 暗色翠玉紧凑（适合开发者后台 / 监控大屏）。

---

## 六、设置面板（推荐 UI）

提供一个右上角"显示设置"IconButton → Popover：

```
┌──────────────────────────┐
│ 显示设置                  │
├──────────────────────────┤
│ 模式  [亮][暗][跟随系统] │
│ 主题色 ⬤ ⬤ ⬤ ⬤ ⬤        │  ← 5 圆点点击切换
│ 密度  [默认][紧凑][适老] │
└──────────────────────────┘
```

参考实现见 `design/03-prototype-style/app.js` `mountSettingsPanel()`。

---

## 七、持久化

- `localStorage`：`qsds:mode` / `qsds:accent` / `qsds:density`
- 首屏 inline 脚本（在 `<head>` 内）读取并设置 `<html>` 属性，避免闪屏：

```html
<script>
  (function(){
    var d = document.documentElement, ls = localStorage;
    d.dataset.mode    = ls.getItem('qsds:mode')    || 'light';
    d.dataset.accent  = ls.getItem('qsds:accent')  || 'ink';
    d.dataset.density = ls.getItem('qsds:density') || 'default';
  })();
</script>
```
