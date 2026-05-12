<!-- TARGET-PATH: _DRAFT-docs-tree-preview.md -->
<!-- 临时演示文件 · 走完 prompt 流程后 docs/ 目录会长什么样； -->

# docs/ 目录预览 · 一次性 B + 3 个 feature 循环（C → D 全跑）

> 假设：完全按 `prompt/` 默认流程跑，所有 B / C / D 阶段均由 AI 三件套生成，无任何外部预生成包介入。
> 三个 feature：`order-mgmt`（订单管理）、`user-center`（用户中心）、`reporting`（报表）。

---

## 一、跑完顺序

```
[一次性 · 项目级]
  B01 A → 写 docs/B01-architecture/
  B02 P → 写 docs/B02-permissions/
  B03 X → 写 docs/B03-ux/
  B04 S → 写 docs/B04-design/design-system/   （markdown 规范，给前端实现 React）
        + 写 docs/B04-design/prototype-style/  （可运行 CSS / JS 资产，C04 vendor 引用）
  G-A / G-P / G-X / G-S 全 ✅

[feature 1 = order-mgmt]
  C01 R → C02 I → C03 N → C04 H（迭代到稳）→ C05 E
  D01 D → D02 L → D03 V（V01+V02+V03 全绿）→ 进入开发

[feature 2 = user-center]   同上
[feature 3 = reporting]     同上
```

---

## 二、最终 `docs/` 树

```
docs/
├── A00-meta/                                ← A 阶段元数据（术语 / 问答归档）
│   ├── glossary.md
│   ├── changelog.md
│   └── questions/
│       ├── B01-A-questions-round1-resolved.md
│       ├── B02-P-questions-round1-resolved.md
│       ├── B03-X-questions-round1-resolved.md
│       ├── B04-S-questions-round1-resolved.md
│       ├── R-order-mgmt-questions-round1-resolved.md
│       ├── R-user-center-questions-round1-resolved.md
│       ├── R-reporting-questions-round1-resolved.md
│       ├── L-order-mgmt-questions-round1-resolved.md
│       └── ...
│
├── B01-architecture/                        ← B01 A 项目级（一次性）
│   ├── 00-index.md
│   ├── 01-tech-stack.md
│   ├── 02-project-structure.md
│   ├── 03-database.md
│   ├── 04-api-conventions.md
│   ├── 05-coding-standards.md
│   ├── 06-deploy-env.md
│   ├── 07-i18n-responsive.md
│   ├── 99-open-questions.md
│   └── _input/preferences.md
│
├── B02-permissions/                         ← B02 P 项目级（一次性）
│   ├── 00-index.md
│   ├── 01-roles.md
│   ├── 02-auth-flow.md
│   ├── 03-authz-mechanism.md
│   ├── 04-user-data-model.md
│   ├── 05-registration.md
│   ├── 99-open-questions.md
│   └── _input/roles-input.md
│
├── B03-ux/                                  ← B03 X 项目级（一次性）
│   ├── 00-index.md
│   ├── 01-direction.md
│   ├── 02-references.md
│   ├── 03-anti-examples.md
│   ├── 04-voice-tone.md
│   ├── 05-moodboard.md
│   ├── 06-experience-principles.md
│   ├── 99-open-questions.md
│   └── _input/style-input.md
│
├── B04-design/                              ← B04 S 项目级（一次性，双子目录）
│   ├── design-system/                       ← markdown 规范，给前端工程实现 React 组件库
│   │   ├── 00-index.md
│   │   ├── 01-tokens.md
│   │   ├── 02-layout.md
│   │   ├── 03-navigation.md
│   │   ├── 04-status-colors.md
│   │   ├── 05-components/
│   │   │   ├── 00-index.md
│   │   │   ├── 01-buttons.md ... 12-decorations.md
│   │   ├── 06-interactions.md
│   │   └── 07-responsive-dark.md
│   ├── prototype-style/                     ← 可运行 CSS / JS 资产，C04 HTML 原型 vendor 引用
│   │   ├── README.md
│   │   ├── tokens.css                       ← 与 design-system/01-tokens.md 逐字同源
│   │   ├── themes.css
│   │   ├── app.css                          ← 总入口：@import tokens + themes + parts/*
│   │   ├── app.js                           ← 暴露全局 proto.bootstrap() 与组件 API
│   │   └── parts/
│   │       ├── 01-base.css
│   │       ├── 02-glass.css
│   │       ├── 03-topbar.css
│   │       ├── 04-buttons-forms.css
│   │       ├── 05-tags-table.css
│   │       ├── 06-modal-dropdown.css
│   │       └── 07-theme-switcher.css
│   ├── 99-open-questions.md
│   └── _input/visual-input.md
│
│ ─────────────────────────────────────────────  以下 per-feature ──────────────
│
│ 【per-feature 拆分约定】
│   每个 C / D 阶段顶层文件夹下，按 feature 名（如 order-mgmt / user-center / reporting）
│   建立同名子目录，每个 feature 自包含完整一份。不使用 Module01 / Module02 这种包裹层。
│   下面以 order-mgmt 完整展开为例；user-center / reporting 同结构，文末仅以“…”略过。
│   同一 feature 在 C01、C02、C03、C04、C05、D01、D02、D03 共 8 个顶层下同名出现 1 次，
│   他们合起来才是该 feature 的“产品+开发全包”。
│
├── C01-requirements/                        ← C01 R
│   ├── order-mgmt/
│   │   ├── 00-index.md
│   │   ├── baseline.md                      ← 需求基线（核心）
│   │   ├── flows/
│   │   │   ├── main-flow.md
│   │   │   └── exception-flow.md
│   │   ├── 99-open-questions.md
│   │   └── _input/draft.md
│   ├── user-center/                         ← 同结构（示例展开）
│   │   ├── 00-index.md
│   │   ├── baseline.md
│   │   ├── flows/…
│   │   ├── 99-open-questions.md
│   │   └── _input/draft.md
│   └── reporting/                           ← 同结构（略）
│
├── C02-ia/                                  ← C02 I
│   ├── _global-routes.md                    ← 全局路由表（3 个 feature 的 delta 累计）
│   ├── order-mgmt/
│   │   ├── 00-index.md
│   │   ├── 01-routes-delta.md               ← 本 feature 增量路由
│   │   ├── 02-pages.md                      ← 页面清单（page-id × R-ID）
│   │   ├── 03-navigation-impact.md          ← 对全局菜单的影响
│   │   ├── 04-coverage-matrix.md            ← R-ID × page-id 矩阵
│   │   ├── 05-error-pages.md                ← 401 / 403 / 404 / 500 / maintenance
│   │   ├── 99-open-questions.md
│   │   └── _input/page-direction.md
│   ├── user-center/  …
│   └── reporting/    …
│
├── C03-pages/                               ← C03 N
│   ├── order-mgmt/
│   │   ├── 00-index.md
│   │   ├── P-order-001.md                   ← 单页交互（含 OP-ID 列表，无 API-ID）
│   │   ├── P-order-001.scenarios.md
│   │   ├── P-order-002.md
│   │   ├── ...
│   │   ├── 99-open-questions.md
│   │   └── _input/<page>-desc.md
│   ├── user-center/  …
│   └── reporting/    …
│
├── C04-prototype/                           ← C04 H · vendor 自 docs/B04-design/prototype-style/
│   ├── order-mgmt/
│   │   ├── index.html                       ← 评审入口
│   │   ├── changelog.md
│   │   ├── feature.css                      ← 仅本 feature 页面级样式（贴 vendor 变量，禁止重定义 token）
│   │   ├── feature.js                       ← 仅本 feature 交互（调 vendor 暴露的 proto.* API）
│   │   ├── mock-data.js                     ← OP-ID 为键的 mock fixture
│   │   ├── vendor/proto-style/              ← 全量拷自 docs/B04-design/prototype-style/，不修改
│   │   │   ├── tokens.css
│   │   │   ├── themes.css
│   │   │   ├── app.css
│   │   │   ├── app.js
│   │   │   └── parts/
│   │   ├── pages/
│   │   │   ├── P-order-001.html
│   │   │   └── ...
│   │   ├── states/
│   │   │   ├── P-order-001.loading.html
│   │   │   ├── P-order-001.empty.html
│   │   │   ├── P-order-001.error.html
│   │   │   └── P-order-001.forbidden.html
│   │   ├── assets/images/
│   │   └── _input/feedback-v1.md
│   ├── user-center/  …
│   └── reporting/    …
│
├── C05-prd/                                 ← C05 E
│   ├── _global-index.md                     ← 全局 feature × 状态总表
│   ├── _glossary.md                         ← 全局术语表（3 个 feature 累计增订）
│   ├── order-mgmt/
│   │   ├── 00-index.md
│   │   ├── 01-overview.md
│   │   ├── 02-glossary.md                   ← 局部术语
│   │   ├── 03-personas.md
│   │   ├── 04-feature-catalog.md
│   │   ├── 05-user-journeys.md
│   │   ├── 06-page-specs/
│   │   │   ├── 00-index.md
│   │   │   ├── P-order-001.md
│   │   │   └── ...
│   │   ├── 07-business-rules.md
│   │   ├── 08-roles-permissions.md
│   │   ├── 09-design-summary.md             ← 摘要 docs/B03-ux/ + docs/B04-design/design-system/
│   │   ├── 10-known-issues.md
│   │   ├── 11-roadmap.md
│   │   ├── 12-changelog.md
│   │   ├── 99-open-questions.md
│   │   └── _input/prd-context.md
│   ├── user-center/  …
│   └── reporting/    …
│
├── D01-data/                                ← D01 D
│   ├── order-mgmt/
│   │   ├── 00-index.md
│   │   ├── 01-tables.md
│   │   ├── 02-enums.md
│   │   ├── 03-relations.md
│   │   ├── 04-state-machine.md
│   │   ├── 05-validations.md
│   │   ├── 06-calculations.md
│   │   ├── 07-seed-data.md
│   │   ├── 99-open-questions.md
│   │   └── _input/data-rules.md
│   ├── user-center/  …
│   └── reporting/    …
│
├── D02-api/                                 ← D02 L
│   ├── order-mgmt/
│   │   ├── 00-index.md                      ← 含 API × OP-ID 反向映射
│   │   ├── 01-overview.md
│   │   ├── 02-endpoints/
│   │   │   ├── post-orders.md
│   │   │   ├── get-orders.md
│   │   │   └── ...
│   │   ├── 03-error-codes.md
│   │   ├── 04-concurrency.md
│   │   ├── 99-open-questions.md
│   │   └── _input/operations.md
│   ├── user-center/  …
│   └── reporting/    …
│
└── D03-validation/                          ← D03 V
    ├── order-mgmt/
    │   ├── 01-upstream-chain.md             ← V01：本 feature R/I/N/H/E + 引用 B 一致性
    │   ├── 02-module-closure.md             ← V02：本 feature D/L/N/H 闭环
    │   └── 03-prd-traceability.md           ← V03：PRD 回链
    ├── user-center/
    │   ├── 01-upstream-chain.md
    │   ├── 02-module-closure.md
    │   └── 03-prd-traceability.md
    └── reporting/
        ├── 01-upstream-chain.md
        ├── 02-module-closure.md
        └── 03-prd-traceability.md
```

---

## 三、关键验证点

| 检查 | 验证方式 |
|------|---------|
| **B01 / B02 / B03 / B04 项目级，仅一份** | 顶层无 `<feature-id>/` 子目录 ✅ |
| **B04 双子目录** | `docs/B04-design/design-system/`（markdown 规范）+ `docs/B04-design/prototype-style/`（可运行资产）共存且 token 同源 ✅ |
| **C04 vendor 唯一来源** | 每 feature `vendor/proto-style/` 与 `docs/B04-design/prototype-style/` 字节级一致 ✅ |
| **C 与 D 隔离** | C01–C05 的 markdown 中 grep 不到 `docs/B01-architecture/`、`docs/D01-data/`、`docs/D02-api/`、`docs/D03-validation/` ✅ |
| **B01 不依赖 feature** | B01 文件中 grep 不到任何 `<feature-id>` ✅ |
| **C03 用 OP-ID，D02 用 API-ID + 反向映射** | C03 markdown 不出现 `API-ID`；D02 `00-index.md` 含 `OP-ID → API-ID` 映射列 ✅ |
| **D03 落盘统一无 `/global/`** | 三 feature 的 V01/V02/V03 都直接位于 `docs/D03-validation/<feature-id>/` ✅ |
| **全局索引一致** | `_global-routes.md`、`_global-index.md`、`_glossary.md` 三处累计增订，无重复定义 ✅ |
| **PRD 不含开发域内容** | C05 子文件不出现表结构 / 接口文档 / 技术栈详情；那些都在 D01 / D02 / B01 ✅ |
| **token 不漂移** | feature.css 中 grep 不到 hex / px 硬编码，也不重定义任何 `--*` token ✅ |

---

## 四、合理性结论

1. **可裁剪**：只想要"产品设计包"时，删 `D01-data/` `D02-api/` `D03-validation/` 三个顶层目录即可。
2. **可并行**：3 个 feature 可在 B 冻结后并行跑各自 C → D，互不干扰；只在 `_global-routes.md` 与 `C05-prd/_global-index.md` 处有累计写入。
3. **可独立交付**：每个 feature 的 7 个目录（C01~C05+D01+D02+D03）与 vendor 完全自包含；任意 feature 删除 / 归档不影响其它。
4. **可追溯**：任何一行实现 → API-ID（D02）→ OP-ID（C03）→ R-ID（C01）→ 业务规则（C05/07）链路闭合；V01+V02+V03 全绿才放行。
5. **设计-原型-上线一致**：`B04-design/design-system/` 与 `B04-design/prototype-style/` 共享 token 源；C04 原型 vendor 引用 `prototype-style/`，前端工程实现引用 `design-system/`，两条路径同源不漂移。

> 删除本文件命令：`rm /opt/projects/ai_agent/_DRAFT-docs-tree-preview.md`
