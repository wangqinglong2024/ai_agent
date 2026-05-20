/**
 * 技术页面
 * MCP (Model Context Protocol) 协议深度解读
 * 编程语言演进时间线、三大核心价值、WebMCP 展望
 */

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Cpu, ArrowRight, Layers, ShieldCheck, Bot,
  Terminal, Globe, Puzzle, Workflow, Braces,
  MessageSquare, Sparkles,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};
const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

/** 编程语言演进 */
const langEvolution = [
  { era: "1940-50s", lang: "机器语言", desc: "纯 0/1 编码，人直接与硬件对话", color: "#94a3b8" },
  { era: "1960s", lang: "汇编语言", desc: "助记符代替二进制，第一层抽象", color: "#94a3b8" },
  { era: "1970-80s", lang: "C / Pascal", desc: "结构化与高级语言，第二层抽象", color: "#94a3b8" },
  { era: "1990-2000s", lang: "Java / Python", desc: "面向对象，更接近人类思维的第三层抽象", color: "#0ea5e9" },
  { era: "2023-2025", lang: "Prompt Engineering", desc: "自然语言指令驱动 AI 完成任务，第四层抽象", color: "#06b6d4" },
  { era: "2025+", lang: "MCP + AI Agent", desc: "自然语言直接编排工具与服务——编程的终极形态", color: "#f59e0b" },
];

/** MCP 三大核心价值 */
const mcpValues = [
  {
    icon: <Layers size={24} />,
    title: "算力坍塌",
    en: "Compute Collapse",
    desc: "传统开发需要程序员、设计师、测试团队的层层协作。MCP 协议将这些环节压缩为：一句自然语言 → AI Agent 自动编排工具链 → 完整应用直出。开发成本从数十万降至近乎为零。",
    stat: "90%+",
    statLabel: "人力成本压缩",
  },
  {
    icon: <ShieldCheck size={24} />,
    title: "数据可用不可见",
    en: "Data Usable, Not Visible",
    desc: "MCP Server 作为数据的「安全代理层」，AI Agent 只需要调用接口获取结果，永远无法直接触碰底层原始数据。企业敏感数据在被 AI 利用价值的同时，保持绝对的隐私安全边界。",
    stat: "100%",
    statLabel: "数据安全可控",
  },
  {
    icon: <Bot size={24} />,
    title: "自治代理生态",
    en: "Autonomous Agent Ecosystem",
    desc: "MCP 让 AI Agent 不再是「一问一答」的聊天机器人，而是可以自主规划、调用多种外部工具、协调子任务的「自治智能体」。从被动回答到主动执行，跨越质的飞跃。",
    stat: "∞",
    statLabel: "工具编排能力",
  },
];

/** MCP 架构三层 */
const mcpArchitecture = [
  {
    icon: <MessageSquare size={20} />,
    layer: "MCP Host",
    desc: "自然语言入口——用户用人话描述需求",
    example: "如：Claude Desktop, IDE 插件, 自研 Chat 界面",
  },
  {
    icon: <Puzzle size={20} />,
    layer: "MCP Client",
    desc: "协议翻译层——将自然语言解析为标准化工具调用指令",
    example: "内置于 Host 中，负责发现、连接和管理 MCP Server",
  },
  {
    icon: <Workflow size={20} />,
    layer: "MCP Server",
    desc: "能力暴露层——将数据库、API、文件系统等封装为 AI 可调用的标准接口",
    example: "如：Supabase MCP, GitHub MCP, 企业自建数据 MCP",
  },
];

export default function Technology() {
  return (
    <div className="relative">
      {/* 装饰 */}
      <div className="glass-decor absolute w-16 h-16 top-36 right-[8%] animate-float-slow opacity-40" style={{ animationDelay: "1s" }} aria-hidden="true" />
      <div className="glass-decor absolute w-14 h-14 top-[55%] left-[5%] animate-float-medium opacity-35" style={{ animationDelay: "4s" }} aria-hidden="true" />

      {/* ══════════ Hero ══════════ */}
      <section className="relative pt-20 pb-12 sm:pt-28 sm:pb-20 px-4">
        <motion.div
          initial="hidden" animate="visible" variants={stagger}
          className="mx-auto max-w-4xl text-center space-y-6"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-xs font-medium rounded-full px-3 py-1" style={{ background: "rgba(6,182,212,0.1)", color: "#06b6d4" }}>
            <Cpu size={14} />
            核心技术
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
            <span style={{ color: "var(--text-primary)" }}>MCP 协议：</span>
            <span className="text-gradient">AI 的「USB-C 接口」</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="mx-auto max-w-2xl text-base sm:text-lg" style={{ color: "var(--text-secondary)" }}>
            Model Context Protocol 是 Anthropic 提出的开放标准，
            让 AI 大模型能够安全、标准化地连接任何外部数据与工具——
            就像 USB-C 统一了所有设备的充电接口。
          </motion.p>
        </motion.div>
      </section>

      {/* ══════════ 编程语言演进 ══════════ */}
      <section className="relative px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center mb-12 space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                编程语言的终极演进
              </h2>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                从二进制到自然语言——每一次跃迁都是让人类离「直接表达意图」更近一步
              </p>
            </motion.div>

            <div className="space-y-0">
              {langEvolution.map((item, i) => (
                <motion.div key={i} variants={fadeUp} className="relative flex gap-5 pb-8 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full flex-shrink-0 mt-1.5" style={{ background: item.color }} />
                    {i < langEvolution.length - 1 && (
                      <div className="w-px flex-1 mt-2" style={{ background: "var(--glass-border)" }} />
                    )}
                  </div>
                  <div className="glass-card p-5 !rounded-2xl flex-1">
                    <div className="flex flex-wrap items-baseline gap-3 mb-1">
                      <span className="text-[10px] font-semibold" style={{ color: item.color }}>{item.era}</span>
                      <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{item.lang}</span>
                    </div>
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ MCP 架构 ══════════ */}
      <section className="relative px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center mb-12 space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>MCP 三层架构</h2>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Host → Client → Server 的标准化调用链路</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mcpArchitecture.map((layer, i) => (
                <motion.div key={i} variants={fadeUp} className="glass-card p-7 space-y-4 relative">
                  {/* 步骤 */}
                  <div className="absolute -top-3 -left-2 w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-sky-500 text-white text-xs font-bold flex items-center justify-center shadow-lg">
                    {i + 1}
                  </div>
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-cyan-500" style={{ background: "rgba(6,182,212,0.12)" }}>
                    {layer.icon}
                  </div>
                  <h3 className="font-bold text-base" style={{ color: "var(--text-primary)" }}>{layer.layer}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{layer.desc}</p>
                  <div className="glass p-3 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Terminal size={12} className="text-amber-500 flex-shrink-0" />
                      <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{layer.example}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ 三大核心价值 ══════════ */}
      <section className="relative px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center mb-12 space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>MCP 带来的三大核心价值</h2>
            </motion.div>

            <div className="space-y-6">
              {mcpValues.map((v, i) => (
                <motion.div key={i} variants={fadeUp} className="glass-elevated rounded-3xl p-8 sm:p-10">
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-cyan-500" style={{ background: "rgba(6,182,212,0.12)" }}>
                          {v.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{v.title}</h3>
                          <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{v.en}</span>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{v.desc}</p>
                    </div>
                    <div className="text-center lg:text-right">
                      <div className="text-3xl font-extrabold text-gradient">{v.stat}</div>
                      <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{v.statLabel}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ WebMCP 展望 ══════════ */}
      <section className="relative px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="glass-elevated rounded-3xl p-8 sm:p-12 lg:p-16"
          >
            <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 text-[10px] font-bold rounded-full px-3 py-1 text-amber-500" style={{ background: "rgba(245,158,11,0.12)" }}>
                  <Sparkles size={12} />
                  未来展望
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                  WebMCP：浏览器里的 AI 革命
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  当 MCP 协议被嵌入浏览器内核，任何网页都将成为 AI 可操控的接口。
                  用户不再需要安装任何 App，只需打开浏览器，用自然语言告诉 AI 你要做什么：
                  "帮我把这个月的所有发票整理成报销单"、"分析竞品的价格策略并生成报告"。
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  这不是科幻。Chrome 已经在实验性地集成 AI 能力，WebMCP 的到来只是时间问题。
                  扶爻科技正在为这个未来做好准备——让我们的学员和客户在浪潮到来之前，率先站上风口。
                </p>
              </div>
              <div className="space-y-4">
                {[
                  { icon: <Globe size={18} />, label: "零安装", desc: "浏览器即平台，打开即用" },
                  { icon: <Braces size={18} />, label: "全网互联", desc: "每个网站都是 MCP Server" },
                  { icon: <Bot size={18} />, label: "自然语言驱动", desc: "用人话完成一切数字操作" },
                ].map((item, i) => (
                  <div key={i} className="glass p-4 rounded-2xl flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-amber-500 flex-shrink-0" style={{ background: "rgba(245,158,11,0.12)" }}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{item.label}</div>
                      <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
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
              掌握 MCP，站在 AI 时代最前沿
            </h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              MCP 是自然语言编程的基础设施。现在学会，就是在未来占据先机。
            </p>
            <Link to="/services#aipm" className="btn-primary text-sm inline-flex">
              了解 AIPM 课程 <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
