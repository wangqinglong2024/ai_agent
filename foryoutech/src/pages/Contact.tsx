/**
 * 联系我们页面
 * 联系表单 + 公司信息 + 多种联系方式
 */

import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail, MapPin, Send, MessageSquare,
  Building2, Clock, ArrowRight,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};
const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

/** 联系方式 */
const contactInfo = [
  {
    icon: <Mail size={20} />,
    label: "电子邮箱",
    value: "contact@foryoutech.top",
    href: "mailto:contact@foryoutech.top",
  },
  {
    icon: <MapPin size={20} />,
    label: "公司地址",
    value: "上海市",
    href: undefined,
  },
  {
    icon: <Clock size={20} />,
    label: "工作时间",
    value: "周一至周五 9:00 - 18:00",
    href: undefined,
  },
];

/** 咨询类型选项 */
const inquiryTypes = [
  "AIPM 培训咨询",
  "超级个体课程咨询",
  "企业 AI 战略咨询",
  "MCP 技术合作",
  "其他",
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    type: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: 接入 FastAPI 后端接口 POST /api/v1/contact
    setSubmitted(true);
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="relative">
      {/* 装饰 */}
      <div className="glass-decor absolute w-16 h-16 top-28 left-[7%] animate-float-slow opacity-45" style={{ animationDelay: "0s" }} aria-hidden="true" />
      <div className="glass-decor absolute w-12 h-12 top-[60%] right-[8%] animate-float-medium opacity-35" style={{ animationDelay: "2s" }} aria-hidden="true" />
      <div className="glass-decor absolute w-20 h-20 bottom-[15%] left-[12%] animate-float-slow opacity-30" style={{ animationDelay: "5s" }} aria-hidden="true" />

      {/* ══════════ Hero ══════════ */}
      <section className="relative pt-20 pb-12 sm:pt-28 sm:pb-20 px-4">
        <motion.div
          initial="hidden" animate="visible" variants={stagger}
          className="mx-auto max-w-4xl text-center space-y-6"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-xs font-medium rounded-full px-3 py-1" style={{ background: "rgba(6,182,212,0.1)", color: "#06b6d4" }}>
            <MessageSquare size={14} />
            联系我们
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
            <span style={{ color: "var(--text-primary)" }}>让我们一起，</span>
            <span className="text-gradient">扶摇直上</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="mx-auto max-w-2xl text-base sm:text-lg" style={{ color: "var(--text-secondary)" }}>
            无论您是想了解课程详情、咨询企业方案，还是探讨技术合作，
            扶爻科技团队随时恭候您的来信。
          </motion.p>
        </motion.div>
      </section>

      {/* ══════════ 主体 ══════════ */}
      <section className="relative px-4 py-10 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">

            {/* 左：表单 */}
            <motion.div
              initial="hidden" whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
            >
              {submitted ? (
                <motion.div variants={fadeUp} className="glass-elevated rounded-3xl p-12 text-center space-y-5">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-sky-500 text-white flex items-center justify-center mx-auto">
                    <Send size={28} />
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>消息已收到!</h3>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    感谢您的信任。我们的团队将在 24 小时内与您取得联系。
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", phone: "", company: "", type: "", message: "" }); }}
                    className="btn-glass text-sm"
                  >
                    发送新消息
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  variants={fadeUp}
                  onSubmit={handleSubmit}
                  className="glass-elevated rounded-3xl p-8 sm:p-10 space-y-6"
                >
                  <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>发送咨询</h3>

                  {/* 姓名 + 邮箱 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>姓名 *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        placeholder="您的姓名"
                        className="glass-input rounded-xl px-4 py-3 w-full text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>电子邮箱 *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="your@email.com"
                        className="glass-input rounded-xl px-4 py-3 w-full text-sm"
                      />
                    </div>
                  </div>

                  {/* 电话 + 公司 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>联系电话</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        placeholder="可选"
                        className="glass-input rounded-xl px-4 py-3 w-full text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>公司名称</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => updateField("company", e.target.value)}
                        placeholder="可选"
                        className="glass-input rounded-xl px-4 py-3 w-full text-sm"
                      />
                    </div>
                  </div>

                  {/* 咨询类型 */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>咨询类型 *</label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => updateField("type", e.target.value)}
                      className="glass-input rounded-xl px-4 py-3 w-full text-sm appearance-none"
                    >
                      <option value="">请选择咨询类型</option>
                      {inquiryTypes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  {/* 留言 */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>您的需求 *</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => updateField("message", e.target.value)}
                      placeholder="请简要描述您的需求或问题..."
                      className="glass-input rounded-xl px-4 py-3 w-full text-sm resize-none"
                    />
                  </div>

                  <button type="submit" className="btn-primary text-sm w-full sm:w-auto">
                    <Send size={16} />
                    发送消息
                  </button>
                </motion.form>
              )}
            </motion.div>

            {/* 右：联系信息 */}
            <motion.div
              initial="hidden" whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
              className="space-y-6"
            >
              {/* 公司卡片 */}
              <motion.div variants={fadeUp} className="glass-card p-7 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-cyan-500" style={{ background: "rgba(6,182,212,0.12)" }}>
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>扶爻（上海）科技有限公司</h4>
                    <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>ForyouTech Co., Ltd.</span>
                  </div>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  以 AI 赋能个体与企业为核心使命，专注 AIPM 培训、超级个体赋能与企业 AI 战略咨询。
                </p>
              </motion.div>

              {/* 联系方式卡片 */}
              {contactInfo.map((info, i) => (
                <motion.div key={i} variants={fadeUp} className="glass-card p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-amber-500 flex-shrink-0" style={{ background: "rgba(245,158,11,0.12)" }}>
                      {info.icon}
                    </div>
                    <div>
                      <div className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>{info.label}</div>
                      {info.href ? (
                        <a href={info.href} className="text-sm font-medium text-cyan-500 hover:underline">{info.value}</a>
                      ) : (
                        <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{info.value}</div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* 快速入口 */}
              <motion.div variants={fadeUp} className="glass-elevated rounded-2xl p-6 space-y-4">
                <h4 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>快速了解</h4>
                <div className="space-y-2">
                  {[
                    { label: "AIPM 培训课程", to: "/services#aipm" },
                    { label: "超级个体方案", to: "/services#individual" },
                    { label: "企业咨询服务", to: "/services#enterprise" },
                    { label: "MCP 技术详解", to: "/technology" },
                  ].map((link, i) => (
                    <Link
                      key={i}
                      to={link.to}
                      className="flex items-center justify-between p-3 rounded-xl text-xs font-medium transition-all duration-300 hover:translate-x-1"
                      style={{ color: "var(--text-secondary)", background: "rgba(6,182,212,0.05)" }}
                    >
                      {link.label}
                      <ArrowRight size={14} className="text-cyan-500" />
                    </Link>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
