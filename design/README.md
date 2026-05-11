<!-- TARGET-PATH: design/README.md -->

# 默认设计标准 · 「青花宋韵」通用设计体系（Qinghua Songyun Design System, QSDS）

> 本目录是项目**默认前端体验与视觉规范**的标准源。
> 任何新系统、新模块在没有特殊视觉要求时，**默认遵守本目录全部规范**。
> 仅当主理人主动走 `/prompt/` 全套流程并产出 `docs/S06-ux/`、`docs/S07-design-system/` 时，才覆盖本默认规范。

---

## 0. 一句话定调

> **沉静、克制、有气韵的中国风现代后台体验**：
> 行楷大字 × 全域毛玻璃 × 宋瓷墨青主色 × 流体波浪点缀，
> 在不牺牲信息密度与可读性的前提下，提供"温度"与"庄重"。

---

## 1. 在 prompt 模板里如何"白嫖"本规范

### 1.1 在 `S06-X01-用户输入-体验风格.md` 中

直接在第 1 节"一句话定调"后写：

```
默认沿用 design/01-experience/ 下全部结论，无需 AI 重出体验定调。
仅以下几点覆盖：
1. <我这一次想改的点>
2. ...
```

并把第 2~13 节留空（或写"沿用 design/01-experience"）。
AI 在 X 阶段读到此引用后，应：
- **跳过**澄清提问；
- **复用** `design/01-experience/01-direction.md` 等文件作为输出；
- 仅就用户列出的"覆盖项"产出 diff 落盘到 `docs/S06-ux/_diff/`。

### 1.2 在 `S07-S01-用户输入-视觉偏好.md` 中

第 1 节勾选：

```
[x] 完全沿用 design/02-design-system/，仅做以下覆盖：
    - <主题色改成 …>
    - <字号阶梯调整 …>
```

S 阶段 AI 同样跳过澄清，直接复用 `design/02-design-system/` 全部 token，
仅产出 diff 到 `docs/S07-design-system/_diff/`。

### 1.3 直接当 X03 / S03 输出物使用

如果连 prompt 流程都不走（小型项目 / 实现阶段直接接入），
开发可直接：

```html
<link rel="stylesheet" href="/design/03-implementation/tokens.css">
<link rel="stylesheet" href="/design/03-implementation/app.css">
<script src="/design/03-implementation/theme-switcher.js"></script>
```

并按 `02-design-system/05-components/` 的组件契约实现 UI。

---

## 2. 目录索引

| 路径 | 等价 prompt 阶段 | 内容 |
|------|-----------------|------|
| [01-experience/](./01-experience/00-index.md) | S06-X03 | 体验定调（不可逾越 / 参考 / 反例 / 文案语气 / Moodboard / 原则） |
| [02-design-system/](./02-design-system/00-index.md) | S07-S03 | 设计系统（Tokens / 布局 / 导航 / 状态色 / 组件 / 交互 / 响应式与暗黑） |
| [03-implementation/](./03-implementation/README.md) | — | 直接可用的 CSS / JS 资产（含主题色切换 + 亮/暗模式） |

---

## 3. 与原型仓库的关系

- 历史原型 `planning/prstory/ux/` 是本规范的**第一版实物**，主题名「青花宋韵 v4.1」。
- 本目录在其基础上做了三件事：
  1. **去业务化**：删除所有名老中医 / 中医 / 工作室等领域词，标准化为通用规范；
  2. **加亮/暗双模式**：原型仅亮色，本规范定义完整的 `data-theme="dark"` 映射；
  3. **加主题色切换**：原型主品牌色锚定墨青，本规范以 `data-accent` 提供 5 套候选主题色（墨青 / 朱砂 / 翠玉 / 鎏金 / 古墨），切换时按钮 / 链接 / 焦点环等同步换色。

---

## 4. 红线（违反即返工）

1. **禁止**纯白 `#fff` 大面积背景（亮色用宣纸米底渐变，暗色用墨夜渐变）。
2. **禁止**纯黑 `#000` 字 / 纯灰 `#888`（统一用暖墨灰阶 token）。
3. **禁止**装饰用大幅毛笔字 / 卷轴杆 / 印章图章充当 logo。
4. **禁止**业务列表 / 表单页挂 Three.js 流体（仅门面 / 空态 / 错误页）。
5. **禁止**写死 hex（必须用 CSS 变量），按钮配色必须随 `data-accent` 自动切换。
6. **禁止**正文 / 表单使用行楷字（仅品牌名、Hero H1、印鉴允许）。
7. **必须**支持 `prefers-reduced-motion: reduce` 关闭一切动效。
8. **必须**焦点环可见且对比度 ≥ 3:1。
9. **必须**WCAG AA 文字对比度 ≥ 4.5:1（本规范 token 已预校验）。
10. **必须**单文件 ≤ 600 行，超出按子目录拆分。

---

## 5. 版本

- v1.0 (2026-05-11)：从 prstory v4.1「青花宋韵」蒸馏，去业务化 + 双模式 + 主题色切换。
