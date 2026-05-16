# 00 · G00 Skills 框架 · README

> 一套面向 AI 协同开发的、从「需求」到「上线增长」全链路的标准化提示词模板集。
>
> **核心承诺**
> - 每一步都把「用户填什么 / AI 必须先问什么 / AI 最终输出什么」拆成三件套，杜绝跳步。
> - 每一份 AI 产出都按规范命名、写入 `/docs` 下固定位置，下游可机械引用。
> - 单文件 ≤ 1200 行，超出强拆。
> - 框架本身不绑定任何技术栈、不绑定任何项目。开箱即用。

---

## 阅读顺序

1. [A00-01-框架总览](./A00-01-框架总览.md)
2. [A00-02-端到端工作流](./A00-02-端到端工作流.md)
3. [A00-03-通用约定](./A00-03-通用约定.md)
4. [A00-04-文档目录规划](./A00-04-文档目录规划.md)
5. 然后：先按 `B01~B04` 一次性定调（4 阶段），再按 `C01~D03` 逐 feature 循环（8 阶段）。

---

## 框架结构：F（一次性定调）+ C（按 feature 循环）

本框架把传统瀑布式 12 阶段拆成两层，对齐现代敏捷设计-开发流程：

| 层 | 前缀 | 阶段数 | 触发频率 | 何时执行 |
|----|------|--------|---------|---------|
| **F · Foundation** | `B01~B04` | 4 | 项目级，**一次性** | 项目启动后跑一次，输出全局规范，所有 feature 共用 |
| **C · Cycle** | `C01~D03` | 8 | feature 级，**每个 feature 跑一遍** | F 全部冻结后开始；同一 feature 顺序走完 C01→D03；多 feature 可并行 |

> 只有「F 全部 ✅」之后才能开始任何 feature 的 C 循环；
> 只有「某 feature 的 C01~D02 全部 ✅」之后才能跑该 feature 的 D03（一致性校验）；
> 只有 D03 全绿才能进入开发实现。

---

## F · 一次性定调（项目级，跑一次）

| 阶段码 | 名称 | 角色 | 输出落盘 | 备注 |
|--------|------|------|---------|------|
| **B01 · A** | 技术架构 | 架构师 | `docs/B01-architecture/` | 选栈、目录、DB/API/编码规范 |
| **B02 · P** | 权限与角色 | 安全/权限工程师 | `docs/B02-permissions/` | 角色枚举、认证、授权机制 |
| **B03 · X** | 体验定调（UX 调性）| 体验总监 | `docs/B03-ux/` | — |
| **B04 · S** | 设计系统 + 原型样式包 | UI 设计师 | `docs/B04-design/` | 产出 `design-system/`（规范）+ `prototype-style/`（可运行 CSS/JS 资产） |

> **顺序**：A → P 必须先于 C 循环（C 阶段会引用架构与权限规范）；X → S 必须先于 C03/C04（页面交互与原型直接消费设计 Token）。
> **B04 双产出**：`docs/B04-design/design-system/` 是给前端工程实现 React 组件的 markdown 规范；`docs/B04-design/prototype-style/` 是 C04 HTML 原型直接 vendor 引用的可运行 CSS / JS 资产，两者共享同一套 token，确保「原型一个样、上线一个样」。

---

## C · 按 feature 循环（每个 feature 跑一遍）

| 阶段码 | 名称 | 角色 | 输出落盘 | 触发节点 |
|--------|------|------|---------|---------|
| **C01 · R** | 需求分析（feature 级） | 需求分析师 | `docs/C01-requirements/<feature>/` | feature 启动 |
| **C02 · I** | 信息架构（功能清单 + 流程 + 状态机 + 页面清单）| 信息架构师 | `docs/C02-ia/<feature>/` | C01 冻结后 |
| **C03 · N** | 页面交互 | 交互设计师 | `docs/C03-pages/<feature>/` | C02 冻结后 |
| **C04 · H** | HTML 原型 | 原型工 | `docs/C04-prototype/<feature>/` | C03 冻结后；一次性出齐本 feature 全部 page-id |
| **C05 · E** | 产品需求文档（PRD）| 产品经理 | `docs/C05-prd/<feature>/` | C04 稳定后 |
| **D01 · D** | 数据模型 | 数据建模师 | `docs/D01-data/<feature>/` | C05 冻结后 |
| **D02 · L** | 路由与接口 | 接口设计师 | `docs/D02-api/<feature>/` | D01 冻结后 |
| **D03 · V** | 开发前一致性校验 | QA / 文档审计师 | `docs/D03-validation/<feature>/` | C01~D02 全部冻结后；本 feature 进入开发的最终闸门 |

> **设计先行原则**：本框架把数据模型 / 接口（D01/D02）放在原型 / PRD（C04/C05）之后。
> 这是现代敏捷做法——先用原型把 UX 和产品形态定死，再倒推数据模型与接口契约，避免「先建表后改 UI」的大返工。
> **多 feature 并行**：项目级 F 冻结后，feature A、feature B 的 C 循环可同时进行；它们彼此只通过 F 全局规范、和已冻结的全局 PRD 索引（`docs/C05-prd/_global-index.md`）协调。

---

## 全链路执行顺序速记

```
B01 · A  →  B02 · P  →  B03 · X  →  B04 · S          ← 一次性定调（4 步）
                                ↓
   ┌────────────────────────────┴────────────────────────────┐
   │ for each feature:                                        │
   │   C01 R → C02 I → C03 N → C04 H → C05 E → D01 D → D02 L │
   │   → D03 V (全绿 ✅) → 进入该 feature 的开发实现           │
   └─────────────────────────────────────────────────────────┘
```

---

## 文件命名规则（贯穿全框架）

- `<前缀><阶段字母><序号>-用途-文件名.md`
  - 示例：`B01-A02-AI澄清-架构提问.md`、`D01-D03-AI输出-数据规范.md`
- 框架层（无阶段字母）：`A00-XX-...`
  - `A00-00-README` / `A00-01-框架总览` / `A00-02-端到端工作流` / `A00-03-通用约定` / `A00-04-文档目录规划`
- 「用户输入」类：用户填写、保存到对应 `docs/` 子目录后发给 AI
- 「AI澄清」类：AI 收到用户输入后**第一轮回复必须是它**，列出阻断级与优化级问题
- 「AI输出」类：用户回答澄清后 AI 才允许输出最终交付物

---

## 三件套铁律

```
① 用户输入模板  →  ② AI 澄清提问模板  →  ③ AI 输出模板
   你填表           AI 必须先问           AI 才允许出报告
```

任何阶段 AI 跳过 ② 直接出 ③ → 立刻打回重做。

> **例外**：
> - D03 V 阶段不需澄清（其输入完全来自上游冻结产物），三份输出按 `D03-V01/V02/V03` 顺序串跑。

---

## 全部 12 阶段 → 文件索引

### F · 一次性定调

| 阶段 | 用户输入 | AI 澄清 | AI 输出 |
|------|---------|---------|---------|
| B01 · A | [B01-A01](../B-foundation/B01-A01-用户输入-技术偏好.md) | [B01-A02](../B-foundation/B01-A02-AI澄清-架构提问.md) | [B01-A03](../B-foundation/B01-A03-AI输出-架构规范.md) |
| B02 · P | [B02-P01](../B-foundation/B02-P01-用户输入-角色描述.md) | [B02-P02](../B-foundation/B02-P02-AI澄清-权限提问.md) | [B02-P03](../B-foundation/B02-P03-AI输出-权限规范.md) |
| B03 · X | [B03-X01](../B-foundation/B03-X01-用户输入-体验风格.md) | [B03-X02](../B-foundation/B03-X02-AI澄清-体验提问.md) | [B03-X03](../B-foundation/B03-X03-AI输出-体验定调.md) |
| B04 · S | [B04-S01](../B-foundation/B04-S01-用户输入-视觉偏好.md) | [B04-S02](../B-foundation/B04-S02-AI澄清-视觉提问.md) | [B04-S03](../B-foundation/B04-S03-AI输出-设计系统.md) |

### C · 按 feature 循环

| 阶段 | 用户输入 | AI 澄清 | AI 输出 |
|------|---------|---------|---------|
| C01 · R | [C01-R01](../C-product/C01-R01-用户输入-需求初稿.md) | [C01-R02](../C-product/C01-R02-AI澄清-需求提问.md) | [C01-R03](../C-product/C01-R03-AI输出-需求基线.md) |
| C02 · I | [C02-I01](../C-product/C02-I01-用户输入-信息架构方向.md) | [C02-I02](../C-product/C02-I02-AI澄清-信息架构提问.md) | [C02-I03](../C-product/C02-I03-AI输出-信息架构.md) |
| C03 · N | [C03-N01](../C-product/C03-N01-用户输入-页面描述.md) | [C03-N02](../C-product/C03-N02-AI澄清-交互提问.md) | [C03-N03](../C-product/C03-N03-AI输出-页面交互规范.md) |
| C04 · H | [C04-H01](../C-product/C04-H01-用户输入-原型方向.md) | [C04-H02](../C-product/C04-H02-AI澄清-原型提问.md) | [C04-H03](../C-product/C04-H03-AI输出-HTML原型规范.md) |
| C05 · E | [C05-E01](../C-product/C05-E01-用户输入-产品背景.md) | [C05-E02](../C-product/C05-E02-AI澄清-PRD提问.md) | [C05-E03](../C-product/C05-E03-AI输出-产品需求文档.md) |
| D01 · D | [D01-D01](../D-develop/D01-D01-用户输入-数据规则.md) | [D01-D02](../D-develop/D01-D02-AI澄清-数据提问.md) | [D01-D03](../D-develop/D01-D03-AI输出-数据规范.md) |
| D02 · L | [D02-L01](../D-develop/D02-L01-用户输入-操作逻辑.md) | [D02-L02](../D-develop/D02-L02-AI澄清-接口提问.md) | [D02-L03](../D-develop/D02-L03-AI输出-接口规范.md) |
| D03 · V | — | — | [D03-V01](../D-develop/D03-V01-AI输出-上游链一致性.md) · [D03-V02](../D-develop/D03-V02-AI输出-模块内闭环.md) · [D03-V03](../D-develop/D03-V03-AI输出-PRD回链校验.md) |

---

## 与 docs 目录的对应关系

| 阶段 | docs 落盘根 |
|------|-------------|
| 框架层 | `docs/A00-meta/` |
| B01 · A | `docs/B01-architecture/` |
| B02 · P | `docs/B02-permissions/` |
| B03 · X | `docs/B03-ux/` |
| B04 · S | `docs/B04-design/` |
| C01 · R | `docs/C01-requirements/<feature>/` |
| C02 · I | `docs/C02-ia/<feature>/` |
| C03 · N | `docs/C03-pages/<feature>/` |
| C04 · H | `docs/C04-prototype/<feature>/` |
| C05 · E | `docs/C05-prd/<feature>/` |
| D01 · D | `docs/D01-data/<feature>/` |
| D02 · L | `docs/D02-api/<feature>/` |
| D03 · V | `docs/D03-validation/<feature>/` |

详见 [A00-04-文档目录规划](./A00-04-文档目录规划.md)。
