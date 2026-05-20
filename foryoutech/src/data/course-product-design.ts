/**
 * 课程数据：软件产品设计——从小白到产品经理
 * 独立文件，避免单文件行数过多
 */

import type { Course } from "./courses";

export const courseProductDesign: Course = {
  id: "product-design",
  emoji: "🎨",
  title: "软件产品设计",
  subtitle: "从小白到产品经理",
  description:
    "从互联网底层逻辑到产品经理核心方法论，涵盖需求洞察、原型设计、技术扫盲、敏捷开发与面试通关，助你完成从零基础到合格PM的蜕变。",
  price: "¥1,980",
  tag: "基础入局",
  tagColor: "from-sky-500 to-cyan-500",
  audience: "零互联网经验，希望转行互联网产品经理（PM）的人群",
  highlights: [
    "4 大核心模块，12 章系统化内容",
    "互联网底层运作与PM核心认知",
    "需求洞察、原型设计、PRD撰写全链路",
    "非技术PM的IT与架构必修课",
    "真实案例讲解与面试冲刺指南",
  ],
  benefits: [
    "✅ 高级产品课程学习",
    "💬 线上图文形式答疑",
    "📂 线上项目作品指导",
    "🎓 线上1对1面试指导",
  ],
  modules: [
    {
      emoji: "🧊",
      title: "模块一：破冰与重塑——互联网底层逻辑与产品经理核心认知",
      chapters: [
        {
          emoji: "🌐",
          title: "第一章：剥开互联网的\u201C黑盒\u201D——IT基础运作机制",
          lessons: [
            { emoji: "🔌", title: "互联网是如何运转的？（从海底光缆到浏览器）" },
            { emoji: "🖥️", title: "C/S架构与B/S架构：谁在服务，谁在消费？" },
            { emoji: "☁️", title: "漫步云端：云计算与SaaS/PaaS/IaaS商业模式" },
          ],
        },
        {
          emoji: "🧑‍💻",
          title: "第二章：产品经理的真实面貌——角色、能力与日常",
          lessons: [
            { emoji: "👑", title: "CEO的学徒：产品经理到底管什么？" },
            { emoji: "📊", title: "产品经理的能力雷达图（2026版）" },
            { emoji: "⏰", title: "从早会到复盘：产品经理的一天与一周" },
          ],
        },
        {
          emoji: "🤖",
          title: "第三章：时代演进——从传统PM到2026 AI PM的跃迁",
          lessons: [
            { emoji: "🔄", title: "被AI颠覆的产品开发周期" },
            { emoji: "🧠", title: "2026年AI产品经理的新定义：系统思考者与上下文工程师" },
          ],
        },
      ],
    },
    {
      emoji: "🛠️",
      title: "模块二：从抽象需求到具象蓝图——核心产品方法论与基本功",
      chapters: [
        {
          emoji: "👂",
          title: "第四章：听懂用户的声音——需求洞察与市场分析",
          lessons: [
            { emoji: "👥", title: "同理心构建：用户画像（Persona）与用户旅程地图" },
            { emoji: "🎯", title: "焦点的聚焦：Jobs-to-be-Done (JTBD) 框架体系" },
            { emoji: "🔍", title: "知己知彼：现代竞品分析框架与AI辅助调研" },
          ],
        },
        {
          emoji: "📐",
          title: "第五章：画出产品的骨骼——架构图、流程图与敏捷开发",
          lessons: [
            { emoji: "🌳", title: "产品信息架构（IA）的搭建逻辑" },
            { emoji: "🛤️", title: "业务流与交互流：UML与BPMN标准流程图绘制" },
            { emoji: "🏃‍♂️", title: "敏捷（Agile）与Scrum框架下的研发节奏" },
          ],
        },
        {
          emoji: "🎨",
          title: "第六章：看得见的创意——原型设计与PRD文档规范",
          lessons: [
            { emoji: "✍️", title: "从草图到交互：Axure原型设计技巧基础" },
            { emoji: "✨", title: "不写代码的开发：利用AI辅助生成可交互原型" },
            { emoji: "📄", title: "PRD（产品需求文档）的结构与撰写艺术" },
            { emoji: "⚡", title: "AI赋能PRD：利用大模型加速文档输出与逻辑校验" },
          ],
        },
      ],
    },
    {
      emoji: "💻",
      title: "模块三：技术扫盲——非技术PM的IT与架构必修课",
      chapters: [
        {
          emoji: "🔗",
          title: "第七章：万物互联的翻译官——API与前后端交互",
          lessons: [
            { emoji: "🚪", title: "深入浅出API：应用程序接口的商业与技术逻辑" },
            { emoji: "🔤", title: "JSON与数据格式：系统对话的通用语言" },
          ],
        },
        {
          emoji: "📚",
          title: "第八章：2026年主流开发语言与框架全景指南",
          lessons: [
            { emoji: "🖼️", title: "前端技术大观：JavaScript、TypeScript与流行框架" },
            { emoji: "⚙️", title: "后端引擎剖析：Python、Java、Go的适用场景与权衡" },
          ],
        },
        {
          emoji: "⏱️",
          title: "第九章：进度把控与工期博弈——迭代规划与研发排期指南",
          lessons: [
            { emoji: "🚦", title: "需求大塞车怎么办？MVP构建与科学优先级法则" },
            { emoji: "🥊", title: "打破\u201C技术黑盒\u201D：如何听懂并准确评估研发工期？" },
          ],
        },
      ],
    },
    {
      emoji: "🚢",
      title: "模块四：实战与起航——AI产品全生命周期管理与面试通关",
      chapters: [
        {
          emoji: "🗄️",
          title: "第十章：数据资产的保险箱——数据库系统解析",
          lessons: [
            { emoji: "🗂️", title: "关系型数据库（RDBMS）与非关系型数据库（NoSQL）的博弈" },
            { emoji: "🔑", title: "PM的核武器：SQL语言基础与数据自主查询" },
          ],
        },
        {
          emoji: "💼",
          title: "第十一章：企业真实案例全场景讲解（保密）",
          lessons: [],
        },
        {
          emoji: "🏆",
          title: "第十二章：决胜2026求职季：作品集与面试冲刺",
          lessons: [
            { emoji: "📂", title: "拒绝空谈：用全链路知识构建硬核产品作品集" },
            { emoji: "🎤", title: "面试拆解：高频题型、业务深挖与经典场景推演" },
            { emoji: "📈", title: "逆袭破局：AI时代PM的简历包装与红利赛道选择" },
          ],
        },
      ],
    },
  ],
};
