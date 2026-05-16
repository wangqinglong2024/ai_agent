# 40 · V03 AI 输出：PRD 回链校验

> **阶段**：D03 · V 一致性校验（最终阶段，开发前）
> **谁产出**：AI（QA / 文档审计师）
> **落盘**：`docs/D03-validation/<feature-id>/03-prd-traceability.md`
> **何时跑**：V01 + 所有模块 V02 全部通过后；这是开发前最后一道闸门。

---

## 触发提示词

```
请你扮演"PRD 回链审计师"，只读 docs/ 已冻结文件，重点对比 本 feature docs/C05-prd/<feature-id>/ 与上游 B01/B02/B03/B04 + 本 feature C01/C02/C03/C04/D01/D02 全部冻结产物。
按 /prompt/D-develop/D03-V03-AI输出-PRD回链校验.md 输出 PRD 段落 → 上游 ID 回链矩阵与冲突清单，
落盘 docs/D03-validation/<feature-id>/03-prd-traceability.md。
凡 PRD 中找不到上游来源的句子一律列入"红色项"。不要替 PRD 调和。
```

---

## V01 vs V02 vs V03 分工（再次声明）

| 阶段 | 看哪一层 | 看什么 |
|------|---------|-------|
| V01 | 全局上游链 | 本 feature R/I/N/H/E 之间是否对齐 + 对 B01~B04 引用是否真实 |
| V02 | 单模块内 | D/L/N/H/scenarios 是否闭环（按 feature 跑） |
| **V03** | **PRD ↔ 全部规范** | **PRD 每段能否回链上游 ID；是否引入规范外内容** |

> V03 是开发前最后一闸；通过后才允许动代码。

---

## 输出文件骨架

```markdown
<!-- TARGET-PATH: docs/D03-validation/<feature-id>/03-prd-traceability.md -->

# PRD 回链校验 · 全局

> **生成时间**：YYYY-MM-DD HH:MM
> **PRD 版本**：v1.x（commit hash）
> **依赖**：V01 + 所有模块 V02 已通过

---

## 1. PRD 子文件覆盖矩阵

| PRD 子文件 | 应覆盖的上游域 | 是否落实 | 缺口 |
|----------|--------------|---------|------|
| 01-overview | 本 feature R 基线 §1 / E01 §1 | ✅ | — |
| 02-glossary | E01 §6 + 本 feature R 基线术语 | ✅ | — |
| 03-personas | P 01-roles + R 用户场景 | ✅ | — |
| 04-feature-catalog | C02 01-feature-catalog（模块 M-ID） | ❓ | 缺 M-007 |
| 05-user-journeys | C02 02-flows（主流程 + 异常） + R 场景 | | |
| 06-page-specs | C02 04-pages × N × H × D02 _global-routes（URL）| | |
| 07-business-rules | C02 03-state-machines + D 03-business-rules + L 04-error-codes | | |
| 08-roles-permissions | P 02-authz × 各 L 接口 | | |
| 09-design-summary | X + S 摘要 | | |
| 10-known-issues | V01/V02 报告 + 历史 changelog | | |

---

## 2. 段落级回链抽样

> 抽 PRD 每个子文件 ≥ 5 段（短文件可全抽），每段标注上游来源 ID。

| PRD 段落定位（文件:行） | 摘要 | 应回链的上游 ID | 是否标注 | 是否真实存在 | 备注 |
|--------------------|-----|---------------|---------|------------|------|
| 01-overview.md:23 | "支持 OAuth 登录" | R-014 | ❌ 未标 | ✅ R-014 存在 | 加链接 |
| 04-feature-catalog.md:48 | "AI 自动审稿" | — | — | ❌ 上游无定义 | **红色项**：PRD 自创 |

---

## 3. 术语统一性

> 全 PRD 全文 grep，禁止使用 `02-glossary.md` 中"不要用的同义词"。

| 违规词 | 出现位置 | 应改为 |
|--------|---------|-------|

---

## 4. 范围声明三桶覆盖

| 桶 | 来源 | PRD 体现位置 | 是否完整 |
|----|------|------------|---------|
| ① 已实现 | E01 §3 ① | 04 模块清单 + 06 页面规格 | |
| ② 已规划未实现 | E01 §3 ② | 11-roadmap.md | |
| ③ 已废弃 | E01 §3 ③ | 不出现 | |

> ②/③ 误入正文 → 阻断。

---

## 5. 99 节状态

| PRD 子文件 | 99 节是否为空 |
|----------|-------------|

> 任意 99 非空 → 阻断（必须先回到对应阶段补答）。

---

## 6. 必须修复清单（阻断 V03 通过 = 阻断进入开发）

- [ ] FIX-1：04-feature-catalog.md 出现"AI 自动审稿"无上游 → 删除或回 R 阶段补 R-ID
- [ ] FIX-2：07-business-rules.md §3.2 与 C02 03-state-machines 冲突 → 回 C02 重定状态机或改 PRD

## 7. 建议优化（不阻断）

- ...

## 8. V03 通过判定

- [ ] §1 矩阵全 ✅
- [ ] §2 抽样无 ❌
- [ ] §3 违规词为空
- [ ] §4 ②/③ 未误入正文
- [ ] §5 全部 99 节为空
- [ ] §6 必须修复清单为空

六项全 ✅ → **进入开发**。任意一项 ❌ → 不许写代码。
```

---

## 输出质量自检

- [ ] 8 节齐？
- [ ] §2 段落抽样 ≥ 每子文件 5 段？
- [ ] §6 每条 FIX 都给了"回到哪个阶段"？
- [ ] 单文件 ≤ 1200 行？
