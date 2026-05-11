<!-- TARGET-PATH: design/README.md -->

# design/ · UX 替换包

本目录是一份**预生成、可冻结、可复用**的 UX 设计包，等价于 `prompt/S06-X03 + S07-S03` 的最终产物。

任何项目沿用本包时，**直接复制覆盖**即可省掉 S06、S07 的两组三件套（X01/X02/X03 + S01/S02/S03）。

---

## 1. 这套包等价什么

| 本目录子目录 | 等价 prompt 阶段 | 等价 docs 落点 |
|------|------|------|
| [01-experience/](./01-experience/00-index.md) | S06 · X 体验定调 | `docs/S06-ux/` |
| [02-design-system/](./02-design-system/00-index.md) | S07 · S 设计系统 | `docs/S07-design-system/` |
| [03-implementation/](./03-implementation/README.md) | （编码层）可运行 CSS / JS 资产 | 直接 `<link>` 引入 HTML 原型与前端工程 |

> 文件命名、目录结构、内部 `<!-- TARGET-PATH -->` 标记均严格遵守 `prompt/S00-04-文档目录规划.md` 与 `S06-X03 / S07-S03` 输出契约。

---

## 2. 怎么"替换"

只在**项目不需要重出 UX/视觉**时使用本包。两步操作：

```bash
# 1) 复制体验定调
cp -r design/01-experience/*  docs/S06-ux/

# 2) 复制设计系统
cp -r design/02-design-system/*  docs/S07-design-system/

# 3) 工程层引入实现资产（HTML 原型 / 前端工程同源）
#    在原型 / 前端入口 <head> 中引入：
#      <link rel="stylesheet" href="/design/03-implementation/app.css">
#      <script src="/design/03-implementation/app.js"></script>
#      <script>qsds.bootstrap();</script>
```

完成后：
- `docs/S06-ux/` 与 `docs/S07-design-system/` 视为**已冻结**；
- `prompt/` 流程**跳过** S06、S07 的全部 6 个三件套；
- 直接进入 S08（信息架构）继续后续阶段。

> 想保留 prompt 流程？那就**不用本包**——按 S06-X01 → X02 → X03、S07-S01 → S02 → S03 走完，最终落到 `docs/S06-ux/`、`docs/S07-design-system/`。

---

## 3. 同时指导原型与前端工程

| 用途 | 引用方式 |
|------|---------|
| HTML 原型（S10 阶段） | `<link>` `app.css` + `<script>` `app.js`；原型 markup 直接套用 `02-design-system/05-components/` 的 Anatomy |
| 前端工程实际开发 | 同上；或在 `tailwind.config.js` 中读 `tokens.css` 的 CSS 变量；组件实现严格遵守 `02-design-system/05-components/` 中各组件的 5 状态 + 异常态契约与 a11y 验收点 |

> 原型与前端工程**共用一套 token、一套组件契约**，避免"原型一个样、上线另一个样"。

---

## 4. 容器与响应式（关键约定）

- **`.container` 流体全宽**：跟随浏览器宽度铺满，**不**设 `max-width`；两侧 padding 按断点 16 → 28 → 36 → 48 → 64 → 96 px 阶梯增长。**禁止**两侧大块留白 + 中间窄内容的写法。
- 阅读 / 单表单等需要**收窄**的场景，用 `.container-narrow`（880）或 `.container-form`（640），**不要**改 `.container`。
- 详细规则见 [02-design-system/02-layout.md](./02-design-system/02-layout.md) §三。

---

## 5. 三轴正交（mode × accent × density）

| 轴 | 取值 | DOM 标记 |
|----|------|---------|
| 模式 | `light` / `dark` / `auto` | `<html data-mode="...">` |
| 主题色 | `ink` / `cinnabar` / `jade` / `gold` / `graphite` | `<html data-accent="...">` |
| 密度 | `default` / `compact` / `elder` | `<html data-density="...">` |

任意组合皆有效，运行时切换。详见 [02-design-system/07-responsive-dark.md](./02-design-system/07-responsive-dark.md)。

---

## 6. 红线（违反即返工）

1. **禁止**给 `.container` 加 `max-width`（流体全宽是硬约束）。
2. **禁止**写死 hex / px；必须引用 `--color-* / --space-* / --text-* / --radius-* / --shadow-* / --motion-* / --z-* / --font-* / --glass-*` 中的 token。
3. **禁止**直接引用具体色族（如 `--color-ink-700`）；只用 `--color-brand-*`，让 `data-accent` 切换生效。
4. **禁止**正文 / 表单使用行楷字（`--font-brush`）；行楷仅用于品牌名 / Hero H1 / 印鉴。
5. **必须**所有可聚焦元素具备可见焦点环（`--focus-ring`），对比度 ≥ 3:1。
6. **必须**支持 `prefers-reduced-motion: reduce`。
7. **必须**所有组件覆盖 5 状态（default / hover / focus-visible / active / disabled / loading）+ 异常态（empty / error）。
8. **必须**单文件 ≤ 1200 行，超出按子目录拆。

---

## 7. 版本

- v1.1 (2026-05-11)：容器改为流体全宽，去掉 1440 上限；目录命名与 S06-X03 / S07-S03 模板对齐；README 重写为"替换包"说明。
- v1.0 (2026-05-11)：从 `planning/prstory/` 蒸馏，去业务化 + 双模式 + 主题色切换。
