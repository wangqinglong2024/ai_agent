/**
 * 首页 (Home Page)
 * 扶爻科技官网 - 全屏 Hero + 三大支柱 + 品牌哲学 + CTA
 * 高级动效：视差滚动、模糊渐显、弹性缩放、计数动画
 */

import { useRef } from "react";
import { ArrowRight, Cpu, Users, Building2, Binary, Globe, Sparkles, BookOpen, Rocket, Shield, Layers, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { allCourses } from "../data/courses";

/** 三大核心商业支柱 */
const pillars = [
  {
    icon: <Rocket size={28} />,
    title: "AI 产品经理培养",
    subtitle: "跨越阶层的高薪红利",
    desc: "对标一线大厂用人标准，培养具备大模型边界认知、LUI 设计范式和多智能体编排能力的 AI 产品经理，助您拿到百万年薪入场券。",
    link: "/services#aipm",
  },
  {
    icon: <Users size={28} />,
    title: "超级个体孵化",
    subtitle: "自然语言编程平权",
    desc: "用母语描述需求，AI 即刻生成代码。将普通职场人武装为「一人抵一司」的超级个体，实现零成本创业与睡后收入。",
    link: "/services#individual",
  },
  {
    icon: <Building2 size={28} />,
    title: "企业 AI 落地咨询",
    subtitle: "拒绝空谈 · 直击落地",
    desc: "从高管认知内训到业务流程重构、私有化知识库部署，为中腰部企业提供去伪存真、快速见效的全链路 AI 转型方案。",
    link: "/services#enterprise",
  },
];

/** 品牌核心价值 */
const values = [
  { icon: <Globe size={20} />, label: "客户至上", en: "Foryou" },
  { icon: <Binary size={20} />, label: "融通古今", en: "爻" },
  { icon: <Sparkles size={20} />, label: "智力平权", en: "Breaking Barriers" },
  { icon: <BookOpen size={20} />, label: "价值共生", en: "扶摇" },
];

/** 数据亮点 */
const stats = [
  { value: "$159K+", label: "全球 AIPM 平均年薪" },
  { value: "万亿$", label: "全球 NLP 市场规模" },
  { value: "90%+", label: "MCP 降低开发成本" },
  { value: "∞", label: "自然语言无门槛" },
];

// 高级动画配置
const fadeUp = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85, filter: "blur(8px)" },
  visible: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  return (
    <div className="relative">
      {/* ── 装饰性浮动玻璃方块 ── */}
      <div className="glass-decor absolute w-20 h-20 top-32 left-[8%] animate-float-slow opacity-60" style={{ animationDelay: "0s" }} aria-hidden="true" />
      <div className="glass-decor absolute w-14 h-14 top-64 right-[12%] animate-float-medium opacity-50" style={{ animationDelay: "1.5s" }} aria-hidden="true" />
      <div className="glass-decor absolute w-24 h-24 bottom-[30%] left-[5%] animate-float-slow opacity-40" style={{ animationDelay: "3s" }} aria-hidden="true" />

      {/* ══════════════════════════════════════════════════
         HERO SECTION — 带视差滚动
         ══════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-[92vh] flex items-center justify-center px-4 overflow-hidden">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="will-change-transform"
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="mx-auto max-w-5xl text-center space-y-8"
          >
          {/* 徽章 */}
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            扶爻（上海）科技有限公司 · ForyouTech
          </motion.div>

          {/* 主标题 */}
          <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
            <span style={{ color: "var(--text-primary)" }}>赋能个体与企业</span>
            <br />
            <span className="text-gradient">用自然语言重塑数字生产力</span>
          </motion.h1>

          {/* 副标题 */}
          <motion.p
            variants={fadeUp}
            className="mx-auto max-w-3xl text-base sm:text-lg md:text-xl leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            在 AI 智能体工程化大规模落地的 2026 年，扶爻科技构建连接前沿人工智能技术与广泛商业场景的坚实桥梁——
            从赋能打工人成为手握百万年薪的 AI 产品经理，到帮助传统企业完成安全高效的 AI 系统架构落地。
          </motion.p>

          {/* CTA 按钮组 */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/services" className="btn-primary text-base">
              探索我们的服务
              <ArrowRight size={18} />
            </Link>
            <Link to="/about" className="btn-glass text-base">
              了解扶爻科技
            </Link>
          </motion.div>

          {/* 数据亮点 - 带计数动画 */}
          <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 max-w-3xl mx-auto">
            {stats.map((s, i) => (
              <div key={i} className="glass rounded-2xl p-4 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gradient">{s.value}</div>
                <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════
         品牌哲学简介 SECTION
         ══════════════════════════════════════════════════ */}
      <section className="relative px-4 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="glass-elevated rounded-3xl p-8 sm:p-12 lg:p-16"
          >
            <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              {/* 左侧：文字 */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 text-xs font-medium rounded-full px-3 py-1" style={{ background: "rgba(6,182,212,0.1)", color: "#06b6d4" }}>
                  <Binary size={14} />
                  品牌哲学 · 从易经到 AI
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight" style={{ color: "var(--text-primary)" }}>
                  「爻」—— 跨越五千年的
                  <br />
                  <span className="text-gradient">文明密码</span>
                </h2>
                <p className="text-sm sm:text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  《易经》中代表阴阳的「爻」，正是莱布尼茨发明二进制的灵感源泉。
                  从古代两仪推演万物，到现代 0 和 1 构建 AI 大模型——人工智能的尽头，
                  是对人类最古老二元智慧的现代映射。「扶爻」以此为名，昭示技术回归人文的哲学闭环。
                </p>
                <Link to="/about" className="btn-ghost text-sm inline-flex">
                  深入了解品牌故事 <ArrowRight size={16} />
                </Link>
              </div>

              {/* 右侧：核心价值观卡片 */}
              <div className="grid grid-cols-2 gap-4">
                {values.map((v, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    className="glass-card p-5 space-y-2 !rounded-2xl"
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-cyan-500" style={{ background: "rgba(6,182,212,0.12)" }}>
                      {v.icon}
                    </div>
                    <div className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{v.label}</div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>{v.en}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
         三大核心支柱 SECTION
         ══════════════════════════════════════════════════ */}
      <section className="relative px-4 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-16 space-y-4"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-xs font-medium rounded-full px-3 py-1" style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>
              <Cpu size={14} />
              核心商业支柱
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
              三位一体的 AI 赋能体系
            </motion.h2>
            <motion.p variants={fadeUp} className="max-w-2xl mx-auto text-base" style={{ color: "var(--text-secondary)" }}>
              从个人职业跃迁到企业数字化转型，覆盖 AI 落地全生命周期
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          >
            {pillars.map((p, idx) => (
              <motion.div key={idx} variants={scaleIn} whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.3 } }}>
                <Link to={p.link} className="block glass-card p-8 space-y-4 h-full group">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-sky-500/20 flex items-center justify-center text-cyan-500 group-hover:scale-110 transition-transform duration-300">
                    {p.icon}
                  </div>
                  <h3 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
                    {p.title}
                  </h3>
                  <div className="text-xs font-medium" style={{ color: "#06b6d4" }}>
                    {p.subtitle}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {p.desc}
                  </p>
                  <div className="flex items-center gap-1 text-sm font-medium text-cyan-500 pt-2">
                    了解详情 <ArrowRight size={14} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
         课程体系预览 SECTION
         ══════════════════════════════════════════════════ */}
      <section className="relative px-4 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-16 space-y-4"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-xs font-medium rounded-full px-3 py-1" style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>
              <BookOpen size={14} />
              体系化课程
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
              从认知觉醒到实战变现
            </motion.h2>
            <motion.p variants={fadeUp} className="max-w-2xl mx-auto text-base" style={{ color: "var(--text-secondary)" }}>
              精心打磨的系统化课程，覆盖行业趋势、产品设计、编程实操与产品经理进阶
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {allCourses.map((course) => {
              const totalChapters = course.modules.reduce((s, m) => s + m.chapters.length, 0);
              const totalLessons = course.modules.reduce(
                (s, m) => s + m.chapters.reduce((ss, c) => ss + c.lessons.length, 0), 0,
              );

              return (
                <motion.div key={course.id} variants={scaleIn} whileHover={{ y: -4, transition: { duration: 0.3 } }}>
                  <Link to={`/courses/${course.id}`} className="block glass-elevated rounded-3xl p-8 sm:p-10 space-y-6 h-full group">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3">
                        <span className={`text-[10px] font-bold text-white px-3 py-1 rounded-full bg-gradient-to-r ${course.tagColor}`}>
                          {course.tag} · {course.price}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                          {course.emoji} {course.title}
                        </h3>
                        <p className="text-sm" style={{ color: "var(--text-muted)" }}>{course.subtitle}</p>
                      </div>
                    </div>

                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {course.description}
                    </p>

                    {/* 模块概览 */}
                    <div className="grid grid-cols-2 gap-3">
                      {course.modules.map((mod, i) => (
                        <div key={i} className="glass p-3 rounded-xl flex items-center gap-2">
                          <span className="text-base">{mod.emoji}</span>
                          <span className="text-[11px] leading-tight" style={{ color: "var(--text-secondary)" }}>{mod.title.replace(/^模块[一二三四五六七八九十]+：/, "")}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-4 text-[10px]" style={{ color: "var(--text-muted)" }}>
                        <span className="flex items-center gap-1"><Layers size={12} /> {course.modules.length} 模块</span>
                        <span className="flex items-center gap-1"><BookOpen size={12} /> {totalChapters} 章</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {totalLessons} 节</span>
                      </div>
                      <span className="flex items-center gap-1 text-sm font-medium text-cyan-500 group-hover:gap-2 transition-all duration-300">
                        查看完整大纲 <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mt-10"
          >
            <Link to="/courses" className="btn-glass text-sm inline-flex">
              查看全部课程 <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
         技术护城河预览 SECTION
         ══════════════════════════════════════════════════ */}
      <section className="relative px-4 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="glass-elevated rounded-3xl p-8 sm:p-12 lg:p-16"
          >
            <motion.div variants={fadeUp} className="text-center mb-10 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-medium rounded-full px-3 py-1" style={{ background: "rgba(6,182,212,0.1)", color: "#06b6d4" }}>
                <Shield size={14} />
                技术底座
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                MCP —— AI 时代的 <span className="text-gradient">USB 接口</span>
              </h2>
              <p className="max-w-2xl mx-auto text-sm sm:text-base" style={{ color: "var(--text-secondary)" }}>
                模型上下文协议（Model Context Protocol）为大模型与外部数据源提供通用安全连接标准，
                打破信息孤岛、实现 90%+ 成本坍塌、守护企业数据隐私。
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { title: "算力成本断崖", desc: "精准分层请求外部数据，减少无效 Token 传输，开发运行成本降低 90% 以上。" },
                { title: "数据可用不可见", desc: "敏感数据永留企业防火墙内，MCP 服务器本地执行查询仅返回脱敏结果。" },
                { title: "自治代理基石", desc: "赋予智能体直连代码库、自动修复 Bug、提交 PR 的跨平台多步执行能力。" },
              ].map((item, i) => (
                <div key={i} className="glass-card p-6 space-y-3 !rounded-2xl">
                  <h4 className="font-semibold" style={{ color: "var(--text-primary)" }}>{item.title}</h4>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{item.desc}</p>
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="text-center mt-8">
              <Link to="/technology" className="btn-ghost text-sm inline-flex">
                深入了解技术架构 <ArrowRight size={16} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
         底部 CTA SECTION
         ══════════════════════════════════════════════════ */}
      <section className="relative px-4 py-24 sm:py-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="glass-elevated rounded-3xl p-10 sm:p-16 space-y-6">
            <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
              乘 AI 时代之风，扶摇直上九万里
            </motion.h2>
            <motion.p variants={fadeUp} className="text-base" style={{ color: "var(--text-secondary)" }}>
              无论您是寻求职场跃迁的个人，还是面临数字化转型的企业，
              扶爻科技都将作为那股托举力量，与您携手破浪前行。
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link to="/contact" className="btn-primary text-base inline-flex">
                立即咨询
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
