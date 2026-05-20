/**
 * 关于我们页面
 * 品牌哲学溯源：易经 → 二进制 → AI 的千年闭环
 * 企业使命、愿景与核心价值观
 */

import { Binary, Globe, Sparkles, BookOpen, ArrowRight, Target, Eye, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

/** 企业使命、愿景 */
const missionVision = [
  {
    icon: <Target size={24} />,
    title: "企业使命",
    en: "Mission",
    zh: "赋能个体与企业，以自然语言重塑数字生产力，让技术进步真正惠及每一个人。",
    enText: "To empower individuals and enterprises by reshaping digital productivity through natural language, ensuring technological advancement truly benefits everyone.",
  },
  {
    icon: <Eye size={24} />,
    title: "企业愿景",
    en: "Vision",
    zh: "成为全球领先的 AI 智能化底座与新质生产力布道者，帮助亿万超级个体与企业乘风破浪，扶摇直上。",
    enText: "To become the world's leading AI intelligence infrastructure and evangelist of new quality productive forces.",
  },
];

/** 核心价值观 */
const coreValues = [
  {
    icon: <Heart size={22} />,
    title: "客户至上，服务为本",
    en: "Customer First · Foryou",
    desc: "所有技术创新、课程设计与咨询方案，以解决客户真实痛点为唯一检验标准，坚决抵制脱离商业价值的伪需求。",
  },
  {
    icon: <Binary size={22} />,
    title: "融通古今，持续演进",
    en: "Integrating Wisdom · 爻",
    desc: "敬畏底层逻辑，保持对前沿技术的敏锐嗅觉。在快速迭代的 AI 周期中，拒绝经验主义，保持永远在进化的极客精神。",
  },
  {
    icon: <Sparkles size={22} />,
    title: "智力平权，打破壁垒",
    en: "Intellectual Egalitarianism",
    desc: "自然语言编程是对全人类的知识平权。致力于降低软件开发门槛，消除技术阶层与普通劳动者之间的技术霸权。",
  },
  {
    icon: <Globe size={22} />,
    title: "价值共生，赋能共赢",
    en: "Symbiotic Value · 扶摇",
    desc: "与学员、企业客户及全球开源生态建立长期赋能关系。公司的成功必须建立在学员获得高薪、企业获得降本增效的绝对前提之下。",
  },
];

/** 时间线：从易经到 AI */
const timeline = [
  { era: "约公元前 1000 年", event: "《易经》：用阴爻（--）和阳爻（—）推演宇宙万物运行规律" },
  { era: "1703 年", event: "莱布尼茨发表《二进制算术的阐释》，指出阴阳爻与 0/1 完美对应" },
  { era: "20 世纪", event: "二进制成为计算机科学绝对基石，驱动信息时代全面爆发" },
  { era: "2026 年", event: "大模型 + MCP + 自然语言编程——「爻」的现代映射，AI 时代全面降临" },
];

export default function About() {
  return (
    <div className="relative">
      {/* 装饰 */}
      <div className="glass-decor absolute w-16 h-16 top-28 right-[10%] animate-float-slow opacity-50" style={{ animationDelay: "0s" }} aria-hidden="true" />
      <div className="glass-decor absolute w-20 h-20 top-[40%] left-[6%] animate-float-medium opacity-40" style={{ animationDelay: "2s" }} aria-hidden="true" />

      {/* ══════════════════════════════════════════════════
         Hero
         ══════════════════════════════════════════════════ */}
      <section className="relative pt-20 pb-16 sm:pt-28 sm:pb-24 px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="mx-auto max-w-4xl text-center space-y-6"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-xs font-medium rounded-full px-3 py-1" style={{ background: "rgba(6,182,212,0.1)", color: "#06b6d4" }}>
            <BookOpen size={14} />
            品牌哲学 · 关于扶爻
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
            <span style={{ color: "var(--text-primary)" }}>从「爻」到 AI：</span>
            <br />
            <span className="text-gradient">跨越五千年的文明密码</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="mx-auto max-w-2xl text-base sm:text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            古代人用「爻」预测未知的命运，现代人用 0 和 1 构建预测未来的 AI 大模型。
            人工智能的尽头，是对人类最古老二元智慧的现代映射。
          </motion.p>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════
         时间线：易经 → AI 的千年闭环
         ══════════════════════════════════════════════════ */}
      <section className="relative px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="space-y-0"
          >
            {timeline.map((item, i) => (
              <motion.div key={i} variants={fadeUp} className="relative flex gap-6 pb-10 last:pb-0">
                {/* 竖线 */}
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-br from-cyan-500 to-sky-500 flex-shrink-0 mt-1.5" />
                  {i < timeline.length - 1 && (
                    <div className="w-px flex-1 mt-2" style={{ background: "var(--glass-border)" }} />
                  )}
                </div>
                {/* 内容 */}
                <div className="glass-card p-5 !rounded-2xl flex-1 space-y-2">
                  <div className="text-xs font-semibold text-cyan-500">{item.era}</div>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{item.event}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
         品牌名解读
         ══════════════════════════════════════════════════ */}
      <section className="relative px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="glass-elevated rounded-3xl p-8 sm:p-12 lg:p-16 space-y-10"
          >
            <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                  「扶爻」= 扶 + 爻
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  「扶」意为帮扶、赋能与托举；「爻」代表二元底层技术——利用底层技术（爻）去赋能客户（扶）。
                  发音上巧妙谐音「扶摇」，典出庄子《逍遥游》："鹏之徙于南冥也，水击三千里，抟扶摇而上者九万里，去以六月息者也"。
                  后诗仙李白在《上李邕》中写道“大鹏一日同风起，扶摇直上九万里”，从此扶摇直上成为了无数普通人的追求与向往。
                  在 2026 年，AI 就是那股改变世界格局的时代飓风。
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                  「ForyouTech」= For You
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  英文名不仅是「扶爻」的精准音译，更是 "For You"（一切为你）的直白表达。
                  向全球客户传递清晰信号：无论技术如何高深，最终目的是回归人的需求，服务于人、赋能于人。
                  这是一个没有文化隔阂的国际品牌标识。
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
         使命与愿景
         ══════════════════════════════════════════════════ */}
      <section className="relative px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {missionVision.map((item, i) => (
              <motion.div key={i} variants={fadeUp} className="glass-card p-8 space-y-4">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-cyan-500" style={{ background: "rgba(6,182,212,0.12)" }}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{item.title}</h3>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>{item.en}</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{item.zh}</p>
                <p className="text-xs leading-relaxed italic" style={{ color: "var(--text-muted)" }}>{item.enText}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
         核心价值观
         ══════════════════════════════════════════════════ */}
      <section className="relative px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center mb-12 space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>核心价值观</h2>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>指导课程研发与服务交付的最高行为准则</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {coreValues.map((v, i) => (
                <motion.div key={i} variants={fadeUp} className="glass-card p-6 space-y-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-amber-500" style={{ background: "rgba(245,158,11,0.12)" }}>
                    {v.icon}
                  </div>
                  <h4 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{v.title}</h4>
                  <div className="text-[10px] font-medium" style={{ color: "#06b6d4" }}>{v.en}</div>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="glass-elevated rounded-3xl p-10 space-y-5">
            <h2 className="text-xl sm:text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
              与我们同行，乘风破浪
            </h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              无论您是个人还是企业，扶爻科技都将作为您的 AI 赋能伙伴。
            </p>
            <Link to="/contact" className="btn-primary text-sm inline-flex">
              联系我们 <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
