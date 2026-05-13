<!-- TARGET-PATH: design/02-design-system/01-tokens.md -->

# 设计 Token

> 全部以 CSS 自定义属性形式呈现。运行时实现见 `design/03-prototype-style/tokens.css` + `themes.css`。

---

## 一、命名约定

```
--color-{role}-{step}        颜色（role: brand|neutral|success|warning|danger|info；step: 50~900）
--text-{name}                字号 / 行高（pair）
--space-{n}                  间距（n = 1~16，递增）
--radius-{name}              圆角
--shadow-{level}             阴影
--motion-{name}              动效（duration + cubic-bezier）
--z-{layer}                  z-index 分层
--font-{role}                字体栈
--glass-{name}               玻璃专用
```

---

## 二、颜色 · Brand（5 主题色族）

> 默认 `data-accent="ink"`。运行时切换 `<html data-accent="cinnabar|jade|gold|graphite">` 即整体换色。
> 所有按钮 / 链接 / 焦点环 / 激活下划线 / 加载条 / Tag 默认色 必须使用 `--color-brand-*`，**禁止**直接引用任一具体色族（如 `--color-ink-700`）。

### 2.1 默认（ink · 宋瓷墨青）

```css
[data-accent="ink"], :root {
  --color-brand-50:  #F1F5F9;
  --color-brand-100: #E4ECF3;
  --color-brand-200: #CFDDE8;
  --color-brand-300: #A8C0D4;
  --color-brand-400: #7A9CBE;
  --color-brand-500: #4A7AA8;
  --color-brand-600: #2E5C8A;
  --color-brand-700: #1B3A5C;   /* 主锚定 */
  --color-brand-800: #14304F;
  --color-brand-900: #0E1F38;

  --color-brand-default: var(--color-brand-700);
  --color-brand-hover:   var(--color-brand-800);
  --color-brand-active:  var(--color-brand-900);
  --color-brand-on:      #FFF8E7;             /* 文字落在 brand 上 */
  --color-brand-ring:    rgba(46,92,138,.18); /* 焦点环 */
}
```

### 2.2 cinnabar · 朱砂

```css
[data-accent="cinnabar"] {
  --color-brand-50:  #FBF1F1;
  --color-brand-100: #F4DCDC;
  --color-brand-200: #EAB8B8;
  --color-brand-300: #DC9494;
  --color-brand-400: #C76060;
  --color-brand-500: #B14545;   /* 主锚定 */
  --color-brand-600: #9D3A3A;
  --color-brand-700: #8C2F2F;
  --color-brand-800: #6F2424;
  --color-brand-900: #4F1818;

  --color-brand-default: var(--color-brand-500);
  --color-brand-hover:   var(--color-brand-600);
  --color-brand-active:  var(--color-brand-700);
  --color-brand-on:      #FFF8E7;
  --color-brand-ring:    rgba(177,69,69,.18);
}
```

### 2.3 jade · 翠玉

```css
[data-accent="jade"] {
  --color-brand-50:  #F1F6F2;
  --color-brand-100: #DCE9DF;
  --color-brand-200: #B8D2BE;
  --color-brand-300: #94BB9D;
  --color-brand-400: #6E9882;
  --color-brand-500: #4A6F5A;   /* 主锚定 */
  --color-brand-600: #3D5C4A;
  --color-brand-700: #314A3B;
  --color-brand-800: #25382D;
  --color-brand-900: #18241E;

  --color-brand-default: var(--color-brand-500);
  --color-brand-hover:   var(--color-brand-600);
  --color-brand-active:  var(--color-brand-700);
  --color-brand-on:      #FFF8E7;
  --color-brand-ring:    rgba(74,111,90,.18);
}
```

### 2.4 gold · 鎏金

```css
[data-accent="gold"] {
  --color-brand-50:  #FBF6E8;
  --color-brand-100: #F4E6BF;
  --color-brand-200: #E9CD83;
  --color-brand-300: #D9B264;
  --color-brand-400: #C8A04C;
  --color-brand-500: #B8923A;   /* 主锚定 */
  --color-brand-600: #9A7A30;
  --color-brand-700: #7C6226;
  --color-brand-800: #5D4A1D;
  --color-brand-900: #3F3213;

  --color-brand-default: var(--color-brand-500);
  --color-brand-hover:   var(--color-brand-600);
  --color-brand-active:  var(--color-brand-700);
  --color-brand-on:      #FFF8E7;
  --color-brand-ring:    rgba(184,146,58,.20);
}
```

### 2.5 graphite · 古墨

```css
[data-accent="graphite"] {
  --color-brand-50:  #F2EFEA;
  --color-brand-100: #DCD5C9;
  --color-brand-200: #B9AE9A;
  --color-brand-300: #968A6F;
  --color-brand-400: #6F6452;
  --color-brand-500: #54493A;
  --color-brand-600: #443B30;   /* 主锚定 */
  --color-brand-700: #3A332A;
  --color-brand-800: #2A251E;
  --color-brand-900: #1A1612;

  --color-brand-default: var(--color-brand-600);
  --color-brand-hover:   var(--color-brand-700);
  --color-brand-active:  var(--color-brand-800);
  --color-brand-on:      #FFF8E7;
  --color-brand-ring:    rgba(68,59,48,.20);
}
```

---

## 三、颜色 · 中性（暖墨灰阶，accent 无关）

```css
:root {
  --color-neutral-0:   #FFFCEF;  /* 暖白 · 文字落 brand 上时使用 */
  --color-neutral-50:  #F2EBD7;  /* 浅米 */
  --color-neutral-100: #E5DCC7;
  --color-neutral-200: #D4C8AE;
  --color-neutral-300: #C5BBA8;
  --color-neutral-400: #9C8E78;
  --color-neutral-500: #6F6452;  /* 茶灰 · 辅助文字 */
  --color-neutral-600: #5A4F40;
  --color-neutral-700: #443B30;  /* 副文 */
  --color-neutral-800: #2D2620;
  --color-neutral-900: #1F1A14;  /* 暖墨 · 正文 */
  --color-neutral-950: #100D0A;
}
```

> 暗色模式镜像见 `07-responsive-dark.md`。

---

## 四、颜色 · 状态（accent 无关）

详见 [04-status-colors.md](./04-status-colors.md)。摘要：

```css
:root {
  --color-success-500: #4A6F5A;  /* 翠玉 */
  --color-warning-500: #C68B3A;  /* 鎏金提亮 */
  --color-danger-500:  #B14545;  /* 朱砂 */
  --color-info-500:    #2E5C8A;  /* 青花 */
}
```

---

## 五、颜色 · 背景与表面（gradient + glass）

```css
:root {
  /* 页面渐变（亮色 · 宣纸→月白瓷） */
  --bg-page: linear-gradient(180deg, #F8F2E0 0%, #F2EBD3 38%, #E8EFF5 100%);
  --bg-page-glow:
    radial-gradient(1100px 580px at 12% -10%, rgba(27,58,92,.10), transparent 62%),
    radial-gradient(900px  500px at 92% 8%,   rgba(46,92,138,.10), transparent 60%),
    radial-gradient(700px  420px at 50% 110%, rgba(184,146,58,.10), transparent 60%);

  /* 玻璃表面（亮色） */
  --glass-1: rgba(255,251,240,.55);   /* 默认 */
  --glass-2: rgba(255,251,240,.72);   /* 强卡 */
  --glass-3: rgba(255,251,240,.42);   /* 极薄 */
  --glass-tint: rgba(207,221,232,.45); /* 月白瓷蓝 */
  --glass-dark: rgba(14,31,56,.62);   /* 反白·hero / TopBar */

  --glass-border:        1px solid rgba(255,250,235,.78);
  --glass-border-strong: 1px solid rgba(255,250,235,.92);
  --glass-border-ink:    1px solid rgba(27,58,92,.14);

  --glass-blur:    saturate(170%) blur(22px);
  --glass-blur-lg: saturate(190%) blur(34px);
  --glass-blur-mobile: saturate(160%) blur(16px);
}
```

---

## 六、字体

```css
:root {
  --font-brush:   "Ma Shan Zheng", "Long Cang", "STKaiti", "KaiTi", "楷体", cursive;
  --font-display: "ZCOOL XiaoWei", "Noto Serif SC", "Source Han Serif SC", "Songti SC", "STSong", serif;
  --font-sans:    "Noto Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", system-ui, -apple-system, sans-serif;
  --font-mono:    "JetBrains Mono", "SFMono-Regular", Menlo, Consolas, monospace;
}
```

---

## 七、字号 / 行高

```css
:root {
  --text-xs:    12px;    --lh-xs:    18px;
  --text-sm:    14px;    --lh-sm:    22px;
  --text-base:  17px;    --lh-base:  28px;   /* 正文默认 */
  --text-md:    19px;    --lh-md:    30px;   /* body 大版（v4.1 上调） */
  --text-lg:    24px;    --lh-lg:    34px;   /* h3 / 卡片标题 */
  --text-xl:    32px;    --lh-xl:    42px;   /* h2 */
  --text-2xl:   42px;    --lh-2xl:   54px;   /* h1 */
  --text-display: 54px;  --lh-display: 66px; /* 门面 hero */

  /* 适老 */
  --text-elder:    22px;
  --text-elder-h1: 40px;
}
```

> 西文 + 数字默认 `font-variant-numeric: tabular-nums; font-feature-settings: "tnum" 1, "lnum" 1;`

---

## 八、字重

```css
:root {
  --weight-regular:  400;
  --weight-medium:   500;
  --weight-semibold: 600;
  --weight-bold:     700;
}
```

---

## 九、间距

```css
:root {
  --space-1:  4px;  --space-2:  8px;  --space-3: 12px;
  --space-4: 16px;  --space-5: 20px;  --space-6: 24px;
  --space-7: 32px;  --space-8: 40px;  --space-9: 48px;
  --space-10: 64px; --space-11: 80px; --space-12: 96px;
}
```

---

## 十、圆角

```css
:root {
  --radius-none: 0;
  --radius-xs:   4px;
  --radius-sm:   8px;
  --radius-md:  12px;   /* 按钮 / 输入 / Tag 默认 */
  --radius-lg:  18px;   /* 卡 */
  --radius-xl:  26px;   /* 强卡 / 模态 */
  --radius-2xl: 34px;   /* 抽屉 / Hero 容器 */
  --radius-pill: 999px;
}
```

---

## 十一、阴影

```css
:root {
  --shadow-1: 0 1px 2px rgba(14,31,56,.06);
  --shadow-2: 0 6px 18px rgba(14,31,56,.10);
  --shadow-3: 0 16px 40px rgba(14,31,56,.16);
  --glass-shadow:    0 14px 38px rgba(14,31,56,.14), inset 0 1px 0 rgba(255,250,235,.65);
  --glass-shadow-lg: 0 24px 56px rgba(14,31,56,.20), inset 0 1px 0 rgba(255,250,235,.70);
}
```

---

## 十二、动效

```css
:root {
  --motion-fast:  120ms cubic-bezier(.2,0,0,1);
  --motion-base:  200ms cubic-bezier(.2,0,0,1);
  --motion-slow:  300ms cubic-bezier(.2,0,0,1);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

---

## 十三、z-index

```css
:root {
  --z-base:      1;
  --z-sticky:  100;
  --z-topbar:  200;
  --z-dropdown: 1000;
  --z-fixed:    1030;
  --z-modal:    1040;
  --z-popover:  1050;
  --z-toast:    1060;
}
```

---

## 十四、断点（与 02-layout 对齐）

```css
/* @media (min-width: ...) */
--bp-sm:   640px;
--bp-md:   768px;
--bp-lg:  1024px;
--bp-xl:  1280px;
--bp-2xl: 1536px;
```

---

## 十五、密度切换

```css
[data-density="default"] { /* 默认值，所有 token 不变 */ }
[data-density="compact"] {
  --text-base: 15px; --lh-base: 24px;
  --space-row: 12px;
  --row-h:    36px;
}
[data-density="elder"] {
  --text-base: var(--text-elder);
  --row-h:    64px;
}
```

---

## 十六、Token 契约

1. 任何业务 CSS / 组件 / 原型只能引用 `--color-brand-*` `--color-neutral-*` `--color-{success|warning|danger|info}-*` `--space-*` `--radius-*` `--shadow-*` `--motion-*` `--text-*` `--font-*` `--z-*` `--glass-*`。
2. **禁止**引用具体色族（如 `--color-ink-700`、`--color-jade-500`）；后者为 token 内部实现，会因主题切换而易主。
3. 状态色 / 中性色 / 玻璃 / 间距 / 字体 不随 `data-accent` 改变，保证语义稳定。
4. 仅 brand 色随 `data-accent` 切换；仅 brand / 中性 / 玻璃 / 背景 随 `data-mode` 切换。
