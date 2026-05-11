<!-- TARGET-PATH: design/02-design-system/04-status-colors.md -->

# 状态色

> 状态色**与主题色（accent）无关**，跨主题保持语义稳定。
> 仅在亮/暗模式下做 ±1 阶亮度微调。

---

## 一、4 种语义状态

### 1.1 亮色模式

| 状态 | bg | border | text | icon |
|------|----|--------|------|------|
| success | `--color-success-50: #F0F4F1` | `--color-success-200: #B8D2BE` | `--color-success-700: #314A3B` | `--color-success-600: #3D5C4A` |
| warning | `--color-warning-50: #FBF6E8` | `--color-warning-200: #E9CD83` | `--color-warning-700: #7C6226` | `--color-warning-600: #9A7A30` |
| danger  | `--color-danger-50:  #FBF1F1` | `--color-danger-200:  #EAB8B8` | `--color-danger-700:  #8C2F2F` | `--color-danger-600:  #9D3A3A` |
| info    | `--color-info-50:    #EAF1F8` | `--color-info-200:    #B6CCE0` | `--color-info-700:    #1B3A5C` | `--color-info-600:    #2E5C8A` |

锚定主色（component 中常用）：

```css
--color-success-500: #4A6F5A;  /* 翠玉 */
--color-warning-500: #C68B3A;  /* 鎏金提亮 */
--color-danger-500:  #B14545;  /* 朱砂 */
--color-info-500:    #2E5C8A;  /* 青花 */
```

### 1.2 暗色模式（自动镜像，详见 07）

```css
[data-mode="dark"] {
  --color-success-50: rgba(74,111,90,.18);
  --color-success-700: #94BB9D;
  --color-warning-50: rgba(184,146,58,.20);
  --color-warning-700: #E9CD83;
  --color-danger-50:  rgba(177,69,69,.20);
  --color-danger-700: #EAB8B8;
  --color-info-50:    rgba(46,92,138,.20);
  --color-info-700:   #A8C0D4;
  /* 500 锚定提亮一档：success #6E9882 / warning #D9B264 / danger #C76060 / info #4A7AA8 */
}
```

---

## 二、焦点环（统一）

```css
:root {
  --focus-ring: 0 0 0 4px var(--color-brand-ring);
  --focus-ring-danger: 0 0 0 4px rgba(177,69,69,.18);
}
```

任何可聚焦元素的 `:focus-visible` 必须使用 `--focus-ring`。
**禁止** `outline: none` 而不补焦点环。

---

## 三、禁用态

```css
.is-disabled, [disabled], [aria-disabled="true"] {
  opacity: .45;
  cursor: not-allowed;
  pointer-events: none;
  filter: saturate(.7);
}
```

---

## 四、Loading 态

- 按钮：`spinner 16px` 替换原 icon，文案不变（"保存中…"）。
- 容器：`.skeleton` 玻璃灰 + shimmer（200ms 缓动 ×2 循环），`prefers-reduced-motion` 下不闪烁。
- 全屏：`.global-loading` 中央 32px spinner + "加载中" 文案，背景 `var(--glass-3)` + blur。

---

## 五、对比度自检（WCAG AA）

| 组合 | 比值 | 通过 |
|------|------|------|
| `--color-neutral-900` on `--bg-page` | ≥ 12 | ✅ |
| `--color-brand-on` on `--color-brand-default`（ink） | 9.6 | ✅ |
| `--color-brand-on` on `--color-brand-default`（gold #B8923A） | 4.7 | ✅ AA |
| `--color-success-700` on `--color-success-50` | 8.2 | ✅ |
| `--color-neutral-500` on `--bg-page` | 5.1 | ✅ AA |
| `--color-neutral-300` on `--bg-page` | 2.1 | ❌ 仅装饰 |

> 主理人新增主题色后，必须跑此校验，未达 AA 不允许并入。
