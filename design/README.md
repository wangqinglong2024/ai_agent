<!-- TARGET-PATH: design/README.md -->

# design/ · 预生成 UX 替换包

本目录是一份**预生成、可冻结、可复用**的 UX 设计包，等价于 `prompt/B-foundation/B03-X03 + B04-S03` 的最终产物。

任何项目沿用本包时，**手动复制**到 `docs/` 对应位置即可省掉 `prompt/` 中 B03、B04 的两组三件套（X01/X02/X03 + S01/S02/S03）。

> 本目录与 `prompt/` 完全解耦——`prompt/` 内**不**引用 `design/`。是否使用本包是用户在跑 prompt 之外做的决定。

---

## 1. 包内子目录与等价产物

| 本目录子目录 | 等价 prompt 阶段 | 等价 docs 落点 |
|------|------|------|
| [01-ux/](./01-ux/00-index.md) | B03 · X 体验定调 | `docs/B03-ux/` |
| [02-design-system/](./02-design-system/00-index.md) | B04 · S 设计系统（markdown 规范） | `docs/B04-design/design-system/` |
| [03-prototype-style/](./03-prototype-style/) | B04 · S 原型样式包（可运行 CSS / JS） | `docs/B04-design/prototype-style/` |

> 三个子目录的内部结构、文件命名、`<!-- TARGET-PATH -->` 标记均严格遵守 `prompt/A-framework/A00-04-文档目录规划.md` 与 `B03-X03 / B04-S03` 输出契约——直接 cp 即可视为已完成 B03 + B04 全部 6 个三件套。

---

## 2. 怎么"替换"（一次性操作）

**前提**：先创建好 `docs/B03-ux/`、`docs/B04-design/design-system/`、`docs/B04-design/prototype-style/` 三个目标目录。

```bash
# 0) 准备目标目录
mkdir -p docs/B03-ux docs/B04-design/design-system docs/B04-design/prototype-style

# 1) 体验定调：复制 01-ux/ 的【内容】到 docs/B03-ux/
cp -r design/01-ux/.  docs/B03-ux/

# 2) 设计系统规范：复制 02-design-system/ 的【内容】到 docs/B04-design/design-system/
cp -r design/02-design-system/.  docs/B04-design/design-system/

# 3) 原型样式包：复制 03-prototype-style/ 的【内容】到 docs/B04-design/prototype-style/
cp -r design/03-prototype-style/.  docs/B04-design/prototype-style/
```

> **关键**：上面三条命令的源都是 `<dir>/.`（**目录内容**），不是 `<dir>` 本身。只复制内容、不复制源文件夹的名字与外壳。

完成后：
- `docs/B03-ux/`、`docs/B04-design/design-system/`、`docs/B04-design/prototype-style/` 三个目录视为**已冻结**；
- `prompt/` 流程**跳过** B03 X 与 B04 S 的全部 6 个三件套；
- B 层冻结后即可进入任何 feature 的 C 循环（C01 R 需求分析起步）。

> 想保留 prompt 流程？那就**不用本包**——按 B03-X01 → X02 → X03、B04-S01 → S02 → S03 走完，最终 AI 自行落到 `docs/B03-ux/` 与 `docs/B04-design/{design-system,prototype-style}/`。

---

## 3. `02-design-system/` 与 `03-prototype-style/` 为什么是两份

两份职责完全不同，**不冗余**：

| | `02-design-system/` | `03-prototype-style/` |
|---|---|---|
| 形态 | markdown 规范 | 可运行的 CSS / JS 资产 |
| 目标读者 | 前端工程师（基于此写 React 组件库） | C04 HTML 原型（直接 `<link>` `<script>` 引用） |
| 是否含可执行代码 | 否 | 是 |
| 必备 token 一致性 | — | `tokens.css` 中每条 CSS 变量必须与 `02-design-system/01-tokens.md` 一字不差 |

C04 原型每个 feature 都把 `03-prototype-style/` 的内容 vendor 进自己的 `vendor/proto-style/`，确保所有 feature 视觉统一；前端最终上线时再依据 `02-design-system/` 实现 React，token 同源避免「原型一个样、上线另一个样」。

---

## 4. 引用方式（C04 原型与前端工程）

| 用途 | 引用方式 |
|------|---------|
| HTML 原型（C04 阶段） | 拷贝 `03-prototype-style/` 内容到 `docs/C04-prototype/<feature>/vendor/proto-style/`；页面 `<link>` `app.css` + `<script>` `app.js` + `proto.bootstrap()` |
| 前端工程实际开发 | 严格遵守 `02-design-system/05-components/` 中各组件的 5 状态 + 异常态契约与 a11y 验收点；可在 `tailwind.config.js` 中读 `03-prototype-style/tokens.css` 的 CSS 变量 |

---

## 5. 容器与响应式（关键约定）

- **`.container` 流体全宽**：跟随浏览器宽度铺满，**不**设 `max-width`；两侧 padding 按断点 16 → 28 → 36 → 48 → 64 → 96 px 阶梯增长。**禁止**两侧大块留白 + 中间窄内容的写法。
- 阅读 / 单表单等需要**收窄**的场景，用 `.container-narrow`（880）或 `.container-form`（640），**不要**改 `.container`。
- 详细规则见 [02-design-system/02-layout.md](./02-design-system/02-layout.md) §三。

---

## 6. 三轴正交（mode × accent × density）

| 轴 | 取值 | DOM 标记 |
|----|------|---------|
| 模式 | `light` / `dark` / `auto` | `<html data-mode="...">` |
| 主题色 | `ink` / `cinnabar` / `jade` / `gold` / `graphite` | `<html data-accent="...">` |
| 密度 | `default` / `compact` / `elder` | `<html data-density="...">` |

任意组合皆有效，运行时切换。详见 [02-design-system/07-responsive-dark.md](./02-design-system/07-responsive-dark.md)。

---

## 7. 红线（违反即返工）

1. **禁止**给 `.container` 加 `max-width`（流体全宽是硬约束）。
2. **禁止**写死 hex / px；必须引用 `--color-* / --space-* / --text-* / --radius-* / --shadow-* / --motion-* / --z-* / --font-* / --glass-*` 中的 token。
3. **禁止**直接引用具体色族（如 `--color-ink-700`）；只用 `--color-brand-*`，让 `data-accent` 切换生效。
4. **禁止**正文 / 表单使用行楷字（`--font-brush`）；行楷仅用于品牌名 / Hero H1 / 印鉴。
5. **必须**所有可聚焦元素具备可见焦点环（`--focus-ring`），对比度 ≥ 3:1。
6. **必须**支持 `prefers-reduced-motion: reduce`。
7. **必须**所有组件覆盖 5 状态（default / hover / focus-visible / active / disabled / loading）+ 异常态（empty / error）。
8. **必须**单文件 ≤ 1200 行，超出按子目录拆。
9. **必须** `03-prototype-style/tokens.css` 与 `02-design-system/01-tokens.md` 中的 CSS 变量逐字一致。

---

## 8. 版本

- v2.0 (2026-05-12)：与 prompt 解耦，对齐新结构——`01-experience` → `01-ux`；`03-implementation` → `03-prototype-style`；prompt 内一律不再引用 `design/`；B04 落点改为 `docs/B04-design/{design-system,prototype-style}/`。
- v1.2 (2026-05-12)：与新框架 B-foundation/C-product/D-develop 命名对齐。
- v1.1 (2026-05-11)：容器改为流体全宽，去掉 1440 上限；目录命名与 B03-X03 / B04-S03 模板对齐；README 重写为"替换包"说明。
- v1.0 (2026-05-11)：从 `planning/prstory/` 蒸馏，去业务化 + 双模式 + 主题色切换。
