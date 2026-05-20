/**
 * 课程详情页面
 * 展示单门课程的完整大纲：模块 → 章节 → 小节
 * 支持手风琴展开/折叠交互
 */

import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowLeft, ChevronDown, BookOpen,
  Layers, Clock, Users, Sparkles, CheckCircle2,
} from "lucide-react";
import { getCourseById } from "../data/courses";

const fadeUp = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const course = getCourseById(courseId ?? "");

  /* 手风琴：记录当前展开的章节 key (moduleIdx-chapterIdx) */
  const [openChapter, setOpenChapter] = useState<string | null>("0-0");

  if (!course) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="glass-card p-12 text-center space-y-4 max-w-md">
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            课程未找到
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            请检查链接是否正确，或返回课程列表。
          </p>
          <Link to="/courses" className="btn-primary text-sm inline-flex">
            <ArrowLeft size={16} /> 返回课程
          </Link>
        </div>
      </div>
    );
  }

  /* 统计汇总 */
  const totalChapters = course.modules.reduce((sum, m) => sum + m.chapters.length, 0);
  const totalLessons = course.modules.reduce(
    (sum, m) => sum + m.chapters.reduce((s, c) => s + c.lessons.length, 0),
    0,
  );

  const toggle = (key: string) => setOpenChapter((prev) => (prev === key ? null : key));

  return (
    <div className="relative">
      {/* 装饰浮块 */}
      <div
        className="glass-decor absolute w-16 h-16 top-28 left-[6%] animate-float-slow opacity-50"
        style={{ animationDelay: "0s" }}
        aria-hidden="true"
      />
      <div
        className="glass-decor absolute w-20 h-20 top-[40%] right-[5%] animate-float-medium opacity-35"
        style={{ animationDelay: "3s" }}
        aria-hidden="true"
      />
      <div
        className="glass-decor absolute w-14 h-14 bottom-[20%] left-[10%] animate-float-slow opacity-40"
        style={{ animationDelay: "5s" }}
        aria-hidden="true"
      />

      {/* ══════════════════════════════════════════════════
         Hero Banner
         ══════════════════════════════════════════════════ */}
      <section className="relative pt-20 pb-12 sm:pt-28 sm:pb-20 px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="mx-auto max-w-5xl"
        >
          {/* 返回按钮 */}
          <motion.div variants={fadeUp}>
            <Link
              to="/courses"
              className="btn-ghost text-xs inline-flex mb-6"
            >
              <ArrowLeft size={14} /> 返回全部课程
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
            {/* 左侧：课程信息 */}
            <motion.div variants={fadeUp} className="space-y-6">
              <div
                className="inline-flex items-center gap-2 text-xs font-medium rounded-full px-4 py-1.5"
                style={{
                  background: "rgba(6,182,212,0.1)",
                  color: "#06b6d4",
                }}
              >
                <BookOpen size={14} />
                {course.tag}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
                <span className="text-gradient">{course.emoji} {course.title}</span>
                <br />
                <span
                  className="text-xl sm:text-2xl font-semibold"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {course.subtitle}
                </span>
              </h1>

              <p
                className="text-sm sm:text-base leading-relaxed max-w-2xl"
                style={{ color: "var(--text-secondary)" }}
              >
                {course.description}
              </p>

              {/* 统计条 */}
              <div className="flex flex-wrap gap-5">
                {[
                  { icon: <Layers size={16} />, label: `${course.modules.length} 大模块` },
                  { icon: <BookOpen size={16} />, label: `${totalChapters} 章` },
                  { icon: <Clock size={16} />, label: `${totalLessons} 节` },
                  { icon: <Users size={16} />, label: "零基础友好" },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <span className="text-cyan-500">{s.icon}</span>
                    {s.label}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 右侧：价格卡片（sticky） */}
            <motion.div variants={fadeUp} className="lg:sticky lg:top-24">
              <div className="glass-elevated rounded-3xl p-7 space-y-5">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-gradient">
                    {course.price}
                  </span>
                </div>

                <div className="space-y-2">
                  <div
                    className="text-[10px] font-semibold uppercase tracking-wide"
                    style={{ color: "var(--text-muted)" }}
                  >
                    适用人群
                  </div>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    {course.audience}
                  </p>
                </div>

                <div className="space-y-2">
                  {course.highlights.map((h, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-xs"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <CheckCircle2
                        size={14}
                        className="text-emerald-500 flex-shrink-0 mt-0.5"
                      />
                      {h}
                    </div>
                  ))}
                </div>

                {/* 专属权益保障 */}
                {course.benefits && course.benefits.length > 0 && (
                  <div className="space-y-2 pt-2 border-t" style={{ borderColor: "var(--glass-border)" }}>
                    <div
                      className="text-[10px] font-semibold uppercase tracking-wide"
                      style={{ color: "var(--text-muted)" }}
                    >
                      专属权益保障
                    </div>
                    {course.benefits.map((b, i) => (
                      <div
                        key={i}
                        className="text-xs"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {b}
                      </div>
                    ))}
                  </div>
                )}

                <Link to="/contact" className="btn-primary text-sm w-full">
                  立即报名 <ArrowRight size={16} />
                </Link>

                <p
                  className="text-[10px] text-center"
                  style={{ color: "var(--text-muted)" }}
                >
                  支持微信 / 支付宝
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════
         课程大纲 (手风琴)
         ══════════════════════════════════════════════════ */}
      <section className="relative px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center mb-12 space-y-3">
              <div
                className="inline-flex items-center gap-2 text-xs font-medium rounded-full px-3 py-1"
                style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}
              >
                <Sparkles size={14} />
                完整大纲
              </div>
              <h2
                className="text-2xl sm:text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {totalChapters} 章 · {totalLessons} 节 · 深度拆解
              </h2>
            </motion.div>

            {/* 按模块分组 */}
            <div className="space-y-10">
              {course.modules.map((mod, mi) => (
                <motion.div key={mi} variants={fadeUp}>
                  {/* 模块标题 */}
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg"
                      style={{
                        background: "rgba(6,182,212,0.12)",
                      }}
                    >
                      {mod.emoji}
                    </div>
                    <h3
                      className="text-lg sm:text-xl font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {mod.title}
                    </h3>
                  </div>

                  {/* 章节手风琴 */}
                  <div className="space-y-3">
                    {mod.chapters.map((chap, ci) => {
                      const key = `${mi}-${ci}`;
                      const isOpen = openChapter === key;

                      return (
                        <div
                          key={key}
                          className="glass-card overflow-hidden !rounded-2xl"
                        >
                          {/* 章节头部 */}
                          <button
                            onClick={() => toggle(key)}
                            className="w-full flex items-center justify-between gap-3 p-5 sm:p-6 text-left transition-colors duration-200 hover:bg-white/5"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="text-lg flex-shrink-0">
                                {chap.emoji}
                              </span>
                              <span
                                className="text-sm sm:text-base font-semibold truncate"
                                style={{ color: "var(--text-primary)" }}
                              >
                                {chap.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span
                                className="text-[10px] hidden sm:inline"
                                style={{ color: "var(--text-muted)" }}
                              >
                                {chap.lessons.length} 节
                              </span>
                              <ChevronDown
                                size={18}
                                className="transition-transform duration-300"
                                style={{
                                  color: "var(--text-muted)",
                                  transform: isOpen
                                    ? "rotate(180deg)"
                                    : "rotate(0deg)",
                                }}
                              />
                            </div>
                          </button>

                          {/* 小节列表 (动画展开) */}
                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div
                                key="content"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{
                                  height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                                  opacity: { duration: 0.25 },
                                }}
                                className="overflow-hidden"
                              >
                                <div
                                  className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0"
                                  style={{
                                    borderTop: "1px solid var(--glass-border)",
                                  }}
                                >
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-4">
                                    {chap.lessons.map((lesson, li) => (
                                      <div
                                        key={li}
                                        className="flex items-start gap-2.5 p-3 rounded-xl transition-all duration-200"
                                        style={{
                                          background: "rgba(6,182,212,0.04)",
                                        }}
                                      >
                                        <span className="text-sm flex-shrink-0 mt-0.5">
                                          {lesson.emoji}
                                        </span>
                                        <span
                                          className="text-xs leading-relaxed"
                                          style={{
                                            color: "var(--text-secondary)",
                                          }}
                                        >
                                          第{li + 1}节：{lesson.title}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
         底部 CTA
         ══════════════════════════════════════════════════ */}
      <section className="relative px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="glass-elevated rounded-3xl p-10 space-y-5">
            <h2
              className="text-xl sm:text-2xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              准备好改变了吗？
            </h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {totalLessons} 节深度内容，从认知破局到商业变现，仅需{" "}
              <span className="font-bold text-gradient">{course.price}</span>
            </p>
            <Link to="/contact" className="btn-primary text-sm inline-flex">
              立即报名 <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
