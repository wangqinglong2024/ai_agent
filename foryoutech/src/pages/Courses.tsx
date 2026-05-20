/**
 * 课程列表页面
 * 展示所有课程卡片，点击进入课程详情
 */

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Layers, Clock, Sparkles } from "lucide-react";
import { allCourses } from "../data/courses";

const fadeUp = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };
const scaleIn = {
  hidden: { opacity: 0, scale: 0.9, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function Courses() {
  return (
    <div className="relative">
      {/* 装饰浮块 */}
      <div className="glass-decor absolute w-16 h-16 top-32 left-[7%] animate-float-slow opacity-45" style={{ animationDelay: "0s" }} aria-hidden="true" />
      <div className="glass-decor absolute w-12 h-12 top-[55%] right-[6%] animate-float-medium opacity-35" style={{ animationDelay: "2.5s" }} aria-hidden="true" />

      {/* ══════════ Hero ══════════ */}
      <section className="relative pt-20 pb-12 sm:pt-28 sm:pb-20 px-4">
        <motion.div
          initial="hidden" animate="visible" variants={stagger}
          className="mx-auto max-w-4xl text-center space-y-6"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-xs font-medium rounded-full px-3 py-1" style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>
            <Sparkles size={14} />
            体系化课程
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
            <span style={{ color: "var(--text-primary)" }}>从认知到实战，</span>
            <span className="text-gradient">全链路赋能</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="mx-auto max-w-2xl text-base sm:text-lg" style={{ color: "var(--text-secondary)" }}>
            扶爻科技精心打磨的系统化课程体系，覆盖行业趋势洞察、产品思维构建、
            自然语言编程实操与 AI 产品经理进阶全链路。
          </motion.p>
        </motion.div>
      </section>

      {/* ══════════ 课程卡片列表 ══════════ */}
      <section className="relative px-4 py-10 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {allCourses.map((course) => {
              const totalChapters = course.modules.reduce((s, m) => s + m.chapters.length, 0);
              const totalLessons = course.modules.reduce(
                (s, m) => s + m.chapters.reduce((ss, c) => ss + c.lessons.length, 0), 0,
              );

              return (
                <motion.div key={course.id} variants={scaleIn} whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.3 } }}>
                  <Link to={`/courses/${course.id}`} className="block glass-card p-7 space-y-4 h-full group">
                    {/* 标签 */}
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{course.emoji}</span>
                      <span className={`text-[10px] font-bold text-white px-3 py-1 rounded-full bg-gradient-to-r ${course.tagColor}`}>
                        {course.tag}
                      </span>
                    </div>

                    {/* 标题 */}
                    <div>
                      <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                        {course.title}
                      </h3>
                      <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                        {course.subtitle}
                      </p>
                    </div>

                    {/* 描述 */}
                    <p className="text-xs leading-relaxed line-clamp-3" style={{ color: "var(--text-secondary)" }}>
                      {course.description}
                    </p>

                    {/* 统计 */}
                    <div className="flex items-center gap-4 text-[10px]" style={{ color: "var(--text-muted)" }}>
                      <span className="flex items-center gap-1"><Layers size={12} /> {course.modules.length} 模块</span>
                      <span className="flex items-center gap-1"><BookOpen size={12} /> {totalChapters} 章</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {totalLessons} 节</span>
                    </div>

                    {/* 价格 + 进入 */}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xl font-extrabold text-gradient">{course.price}</span>
                      <span className="flex items-center gap-1 text-sm font-medium text-cyan-500 group-hover:gap-2 transition-all duration-300">
                        查看大纲 <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}

          </motion.div>
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section className="relative px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="glass-elevated rounded-3xl p-10 space-y-5">
            <h2 className="text-xl sm:text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
              不确定哪门课程适合你？
            </h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              联系我们的课程顾问，获取 1 对 1 的学习路径规划建议。
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
