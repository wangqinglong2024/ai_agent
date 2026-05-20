/**
 * 服务页面
 * 三大核心支柱：AIPM 培训 / 超级个体赋能 / 企业 AI 咨询
 * 支持锚点定位 (#aipm, #individual, #enterprise)
 */

import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GraduationCap, Rocket, Building2, ArrowRight,
  DollarSign, TrendingUp, Zap, Shield,
  Code2, Network,
  Server, Lock, BarChart3, Cog,
  Gift, Medal, Crown, Headphones, Check, X,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};
const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

/** AIPM 薪资数据 */
const salaryData = [
  { role: "AI Product Manager (美国)", salary: "$159,000+", source: "Glassdoor 2025" },
  { role: "AI 产品经理 (中国一线)", salary: "¥50 ~ 120 万", source: "前程无忧/猎聘" },
  { role: "传统 PM → AIPM 跳槽涨幅", salary: "40% ~ 80%+", source: "行业调研" },
];

/** 超级个体两阶段 */
const individualPhases = [
  {
    phase: "阶段一",
    title: "职场防身术 · 不被 AI 淘汰",
    icon: <Shield size={22} />,
    items: [
      "掌握 Prompt Engineering 高阶能力，确保在本职工作中效率碾压",
      "学会 AI 辅助文档、报告、数据分析的全自动化工作流",
      "理解 AI 能力边界，在公司内成为最被需要的「AI 翻译官」",
    ],
  },
  {
    phase: "阶段二",
    title: "零成本创业 · AI 超级个体",
    icon: <Rocket size={22} />,
    items: [
      "MCP 协议 + 自然语言编程，用一句话让 AI 帮你搭建完整的 SaaS 产品",
      "打造个人 AI Agent 矩阵：内容创作、客户管理、自动营销一体化",
      "估值导向的产品思维：用 AI 快速验证 MVP，跑通商业闭环",
    ],
  },
];

/** 企业服务矩阵 */
const enterpriseServices = [
  {
    icon: <GraduationCap size={20} />,
    title: "企业内训",
    desc: "定制化 AI 能力提升课程，全员 AI 素养对齐，覆盖从管理层到一线员工的分级培训体系",
  },
  {
    icon: <Cog size={20} />,
    title: "流程重构",
    desc: "深入业务流程诊断，运用 AI Agent + MCP 协议重塑核心业务链路，实现效率指数级提升",
  },
  {
    icon: <Server size={20} />,
    title: "私有化部署",
    desc: "为对数据安全有极致要求的企业提供大模型私有化部署方案，数据不出域，安全可控审计",
  },
  {
    icon: <BarChart3 size={20} />,
    title: "ROI 咨询",
    desc: "基于企业实际场景的 AI 投资回报分析，确保每一分 AI 投入都能带来可量化的降本增效",
  },
];

export default function Services() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
      }
    }
  }, [hash]);

  return (
    <div className="relative">
      {/* 装饰 */}
      <div className="glass-decor absolute w-14 h-14 top-32 left-[8%] animate-float-slow opacity-40" style={{ animationDelay: "0s" }} aria-hidden="true" />
      <div className="glass-decor absolute w-18 h-18 top-[50%] right-[5%] animate-float-medium opacity-30" style={{ animationDelay: "3s" }} aria-hidden="true" />

      {/* ══════════ Hero ══════════ */}
      <section className="relative pt-20 pb-12 sm:pt-28 sm:pb-20 px-4">
        <motion.div
          initial="hidden" animate="visible" variants={stagger}
          className="mx-auto max-w-4xl text-center space-y-6"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-xs font-medium rounded-full px-3 py-1" style={{ background: "rgba(6,182,212,0.1)", color: "#06b6d4" }}>
            <Zap size={14} />
            核心服务
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
            <span style={{ color: "var(--text-primary)" }}>三大支柱，</span>
            <span className="text-gradient">全域赋能</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="mx-auto max-w-2xl text-base sm:text-lg" style={{ color: "var(--text-secondary)" }}>
            从个人职业跃迁到企业全面智能化，扶爻科技提供完整的 AI 赋能服务矩阵。
          </motion.p>
        </motion.div>
      </section>

      {/* ══════════ 支柱一：AIPM ══════════ */}
      <section id="aipm" className="scroll-mt-24 relative px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br from-cyan-500 to-sky-500">
                <GraduationCap size={20} />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>AI 产品经理 (AIPM) 培训</h2>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>Pillar 1 — Training & Certification</span>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 左：核心价值 */}
              <motion.div variants={fadeUp} className="glass-card p-8 space-y-6">
                <h3 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>为什么选择 AIPM?</h3>
                <div className="space-y-4">
                  {[
                    { icon: <DollarSign size={18} />, title: "高薪天花板", desc: "全球 AIPM 平均年薪 $159K+，中国一线城市 50~120 万" },
                    { icon: <TrendingUp size={18} />, title: "万亿级赛道", desc: "NLP 市场 2029 年预计突破 $1,500 亿，AIPM 是核心枢纽角色" },
                    { icon: <Code2 size={18} />, title: "技术+商业双轮", desc: "不只是技术，更是商业思维与 AI 能力的交叉融合" },
                    { icon: <Network size={18} />, title: "稀缺复合人才", desc: "懂 AI、懂产品、懂商业的三栖人才，市场严重供不应求" },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-cyan-500" style={{ background: "rgba(6,182,212,0.12)" }}>
                        {item.icon}
                      </div>
                      <div>
                        <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{item.title}</div>
                        <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* 右：薪资数据 */}
              <motion.div variants={fadeUp} className="glass-card p-8 space-y-6">
                <h3 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>全球薪资一览</h3>
                <div className="space-y-3">
                  {salaryData.map((row, i) => (
                    <div key={i} className="glass p-4 rounded-2xl flex justify-between items-center">
                      <div>
                        <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{row.role}</div>
                        <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{row.source}</div>
                      </div>
                      <div className="text-lg font-bold text-cyan-500">{row.salary}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ 支柱二：超级个体 ══════════ */}
      <section id="individual" className="scroll-mt-24 relative px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br from-amber-500 to-amber-600">
                <Rocket size={20} />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>超级个体赋能</h2>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>Pillar 2 — Super Individual Empowerment</span>
              </div>
            </motion.div>

            <motion.p variants={fadeUp} className="text-sm mb-10 max-w-3xl" style={{ color: "var(--text-secondary)" }}>
              未来不需要你变成程序员，只需要你学会用自然语言"指挥"AI。
              通过 MCP 协议与 Prompt 工程的系统化学习，普通人也能构建 AI 驱动的数字产品，成为「一人公司」级别的超级个体。
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {individualPhases.map((phase, i) => (
                <motion.div key={i} variants={fadeUp} className="glass-card p-8 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-amber-500" style={{ background: "rgba(245,158,11,0.12)" }}>
                      {phase.icon}
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-amber-500">{phase.phase}</div>
                      <h4 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{phase.title}</h4>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {phase.items.map((item, j) => (
                      <li key={j} className="flex gap-2 text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                        <span className="text-amber-500 mt-0.5 flex-shrink-0">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ 支柱三：企业咨询 ══════════ */}
      <section id="enterprise" className="scroll-mt-24 relative px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br from-sky-500 to-cyan-500">
                <Building2 size={20} />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>企业 AI 战略咨询</h2>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>Pillar 3 — Enterprise AI Consulting</span>
              </div>
            </motion.div>

            <motion.p variants={fadeUp} className="text-sm mb-10 max-w-3xl" style={{ color: "var(--text-secondary)" }}>
              帮助企业从"观望 AI "走向"驾驭 AI"。提供从战略规划、流程重构到私有化部署的全链路 AI 转型方案，让 AI 真正在企业内部落地生根，产生可量化的 ROI。
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {enterpriseServices.map((svc, i) => (
                <motion.div key={i} variants={fadeUp} className="glass-card p-6 space-y-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sky-500" style={{ background: "rgba(14,165,233,0.12)" }}>
                    {svc.icon}
                  </div>
                  <h4 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{svc.title}</h4>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{svc.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* 企业核心价值承诺 */}
            <motion.div variants={fadeUp} className="mt-10 glass-elevated rounded-3xl p-8 sm:p-10">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                {[
                  { num: "90%+", label: "人力成本降低", icon: <TrendingUp size={20} /> },
                  { num: "10×", label: "开发效率提升", icon: <Zap size={20} /> },
                  { num: "100%", label: "数据安全可控", icon: <Lock size={20} /> },
                ].map((stat, i) => (
                  <div key={i} className="space-y-2">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-cyan-500 mx-auto" style={{ background: "rgba(6,182,212,0.12)" }}>
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-extrabold text-gradient">{stat.num}</div>
                    <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ 课程投资指南 ══════════ */}
      <section id="pricing" className="scroll-mt-24 relative px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center mb-12 space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-medium rounded-full px-3 py-1" style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>
                <DollarSign size={14} />
                官方投资指南
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                💎 2026 AI 超级个体实战体系
              </h2>
              <p className="text-sm max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
                从认知破局到阶层跃迁，选择最适合你当前阶段的投资路径
              </p>
            </motion.div>

            {/* 课程卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {/* 🎁 破冰福利版 */}
              <motion.div variants={fadeUp} className="glass-card p-7 space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 px-3 py-1 text-[10px] font-bold text-white rounded-bl-xl" style={{ background: "linear-gradient(135deg, #06b6d4, #0ea5e9)" }}>
                  破冰福利
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-cyan-500" style={{ background: "rgba(6,182,212,0.12)" }}>
                    <Gift size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>行业趋势分析</h4>
                    <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>AI 编程认知与商业变现</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-gradient">¥19.80</span>
                </div>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  适用人群：零基础小白、处于职业迷茫期的传统行业从业者
                </p>
                <div className="glass p-3 rounded-xl">
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    12 节深度认知启蒙，打破信息茧房，建立 AI 时代财富获取的底层逻辑
                  </p>
                </div>
                <Link to="/contact" className="btn-primary text-xs w-full !py-2.5">
                  立即报名 <ArrowRight size={14} />
                </Link>
              </motion.div>

              {/* 🥉 基础入局版 */}
              <motion.div variants={fadeUp} className="glass-card p-7 space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 px-3 py-1 text-[10px] font-bold text-white rounded-bl-xl" style={{ background: "linear-gradient(135deg, #cd7f32, #b8860b)" }}>
                  🥉 基础入局
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-amber-600" style={{ background: "rgba(180,83,9,0.12)" }}>
                    <Medal size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>软件产品设计</h4>
                    <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>从小白到产品经理</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-gradient">¥1,980</span>
                </div>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  适用人群：零互联网经验，希望转行互联网产品经理的人群
                </p>
                <div className="space-y-2">
                  {["高级产品课程学习", "线上图文形式答疑", "线上项目作品指导", "线上 1 对 1 面试指导"].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                      <Check size={14} className="text-emerald-500 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
                <Link to="/contact" className="btn-primary text-xs w-full !py-2.5">
                  立即报名 <ArrowRight size={14} />
                </Link>
              </motion.div>

              {/* 🥈 极客开发版 */}
              <motion.div variants={fadeUp} className="glass-card p-7 space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 px-3 py-1 text-[10px] font-bold text-white rounded-bl-xl" style={{ background: "linear-gradient(135deg, #94a3b8, #64748b)" }}>
                  🥈 极客开发
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-sky-500" style={{ background: "rgba(14,165,233,0.12)" }}>
                    <Code2 size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>自然语言编程</h4>
                    <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>用 AI 构建企业级应用</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-gradient">¥3,980</span>
                </div>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  适用人群：渴望用自然语言替代传统代码构建 SaaS 及系统应用的人群
                </p>
                <div className="space-y-2">
                  {["硬核技术课程学习", "线上图文形式答疑"].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                      <Check size={14} className="text-emerald-500 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
                <Link to="/contact" className="btn-primary text-xs w-full !py-2.5">
                  立即报名 <ArrowRight size={14} />
                </Link>
              </motion.div>

              {/* 🥇 高阶跃迁版 — 推荐 */}
              <motion.div variants={fadeUp} className="glass-elevated p-7 space-y-4 relative overflow-hidden rounded-3xl ring-2 ring-amber-500/30">
                <div className="absolute top-0 right-0 px-4 py-1.5 text-[10px] font-bold text-white rounded-bl-xl" style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
                  🥇 推荐 · 高阶跃迁
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-amber-500" style={{ background: "rgba(245,158,11,0.15)" }}>
                    <Crown size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>AI 产品经理阶层跃迁</h4>
                    <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>冲刺百万年薪</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-gradient">¥5,980</span>
                </div>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  适用人群：渴望掌握大模型底层原理与智能体架构，冲刺百万年薪的操盘手
                </p>
                <div className="space-y-2">
                  {["资深产品课程学习", "线上图文形式答疑", "线上项目作品指导", "线上 1 对 1 面试指导"].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                      <Check size={14} className="text-emerald-500 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
                <Link to="/contact" className="btn-primary text-xs w-full !py-2.5">
                  立即报名 <ArrowRight size={14} />
                </Link>
              </motion.div>

              {/* 🤝 专家私教服务 */}
              <motion.div variants={fadeUp} className="glass-card p-7 space-y-4 relative overflow-hidden md:col-span-2 lg:col-span-2">
                <div className="absolute top-0 right-0 px-3 py-1 text-[10px] font-bold text-white rounded-bl-xl" style={{ background: "linear-gradient(135deg, #06b6d4, #0284c7)" }}>
                  🤝 专家私教
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-cyan-500" style={{ background: "rgba(6,182,212,0.12)" }}>
                        <Headphones size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>专属工作陪跑与深度咨询</h4>
                        <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>语音 / 视频实时连线</span>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-gradient">¥600</span>
                      <span className="text-sm" style={{ color: "var(--text-muted)" }}>/ 小时</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      拒绝纸上谈兵。直接针对你在真实工作场景中遇到的业务瓶颈、架构难题或职场博弈进行 1 对 1 深度拆解与"急救"指导。
                    </p>
                    <Link to="/contact" className="btn-primary text-xs inline-flex !py-2.5">
                      预约私教 <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* 权益全景对比表 */}
            <motion.div variants={fadeUp} className="glass-elevated rounded-3xl overflow-hidden">
              <div className="p-6 sm:p-8">
                <h3 className="font-bold text-base mb-6" style={{ color: "var(--text-primary)" }}>📕 课程权益全景速览</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs" style={{ minWidth: 640 }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--glass-border)" }}>
                        {["课程模块", "投资金额", "图文答疑", "作品指导", "1对1面试", "核心定位"].map((h, i) => (
                          <th key={i} className="text-left py-3 px-3 font-semibold" style={{ color: "var(--text-primary)" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: "行业趋势分析", price: "¥19.80", qa: false, work: false, interview: false, pos: "认知破局，打破信息茧房" },
                        { name: "基础产品经理", price: "¥1,980", qa: true, work: true, interview: true, pos: "零基础转行，搞定入行 Offer" },
                        { name: "自然语言编程", price: "¥3,980", qa: true, work: false, interview: false, pos: "掌握前沿技术，一人抵一个团队" },
                        { name: "AI 产品经理", price: "¥5,980", qa: true, work: true, interview: true, pos: "掌握底层架构，完成阶层跃迁" },
                        { name: "定制工作陪跑", price: "¥600/时", qa: null, work: null, interview: null, pos: "视频/语音连线，解决真实工作卡点" },
                      ].map((row, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid var(--glass-border)" }}>
                          <td className="py-3 px-3 font-medium" style={{ color: "var(--text-primary)" }}>{row.name}</td>
                          <td className="py-3 px-3 font-bold text-cyan-500">{row.price}</td>
                          {[row.qa, row.work, row.interview].map((v, j) => (
                            <td key={j} className="py-3 px-3">
                              {v === null ? <span style={{ color: "var(--text-muted)" }}>—</span> : v ? <Check size={14} className="text-emerald-500" /> : <X size={14} style={{ color: "var(--text-muted)" }} />}
                            </td>
                          ))}
                          <td className="py-3 px-3" style={{ color: "var(--text-secondary)" }}>{row.pos}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="glass-elevated rounded-3xl p-10 space-y-5">
            <h2 className="text-xl sm:text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
              找到适合您的赋能方案
            </h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              无论个人进阶还是企业转型，扶爻科技为您量身定制 AI 赋能路径。
            </p>
            <Link to="/contact" className="btn-primary text-sm inline-flex">
              预约咨询 <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
