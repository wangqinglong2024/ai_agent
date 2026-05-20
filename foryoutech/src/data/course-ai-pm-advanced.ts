/**
 * 课程数据：软件产品设计——AI产品经理阶层跃迁
 * 独立文件，避免单文件行数过多
 */

import type { Course } from "./courses";

export const courseAIPMAdvanced: Course = {
  id: "ai-pm-advanced",
  emoji: "🚀",
  title: "AI产品经理阶层跃迁",
  subtitle: "掌握底层架构，完成阶层跃迁",
  description:
    "深入机器学习与大模型原理，掌握LangChain/LangGraph工作流、Hugging Face生态、Dify/Coze零代码平台实操，以及AI产品商业化变现与合规，助你完成从普通PM到AI产品专家的阶层跃迁。",
  price: "¥5,980",
  tag: "高阶跃迁",
  tagColor: "from-rose-500 to-pink-500",
  audience: "渴望掌握大模型底层原理与智能体（Agent）架构，冲刺百万年薪的操盘手",
  highlights: [
    "7 大模块，20 章深度AI产品知识体系",
    "机器学习、深度学习与大模型原理精讲",
    "LangChain/LangGraph/MCP智能体开发",
    "Dify与Coze零代码AI平台实战对比",
    "AI产品商业化变现与合规风险护城河",
  ],
  benefits: [
    "✅ 资深产品课程学习",
    "💬 线上图文形式答疑",
    "📂 线上项目作品指导",
    "🎓 线上1对1面试指导",
  ],
  modules: [
    {
      emoji: "⚙️",
      title: "模块一：AI的引擎——机器学习与深度学习算法认知",
      chapters: [
        {
          emoji: "🧠",
          title: "第一章：解密\u201C机器如何学习\u201D",
          lessons: [
            { emoji: "📐", title: "基于规则的软件 vs. 基于数据的概率模型" },
            { emoji: "🧹", title: "数据标注与特征工程：AI背后的\u201C脏活累活\u201D" },
          ],
        },
        {
          emoji: "🗺️",
          title: "第二章：算法全景图与商业应用场景映射",
          lessons: [
            { emoji: "🎯", title: "监督学习（Supervised Learning）：精准预测与分类" },
            { emoji: "🌌", title: "无监督学习（Unsupervised Learning）：在混沌中寻找规律" },
            { emoji: "🕹️", title: "强化学习（Reinforcement Learning）：试错中的动态决策" },
          ],
        },
        {
          emoji: "🤿",
          title: "第三章：深潜大脑——深度学习架构解析",
          lessons: [
            { emoji: "⬛", title: "人工神经网络（ANN）的黑盒机制" },
            { emoji: "👁️", title: "感知视觉与听觉：CNN与经典多模态应用" },
            { emoji: "⏳", title: "时间的记忆：从RNN到序列数据处理" },
          ],
        },
      ],
    },
    {
      emoji: "🌊",
      title: "模块二：智能涌现——大模型(LLM)分类、知识与进化过程",
      chapters: [
        {
          emoji: "📜",
          title: "第四章：从统计学到智能涌现的大语言模型进化史",
          lessons: [
            { emoji: "🧮", title: "N-gram与统计语言模型的早期困境" },
            { emoji: "💡", title: "\u201CAttention Is All You Need\u201D：Transformer架构的革命" },
            { emoji: "📈", title: "规模的奇迹：预训练（Pre-training）与涌现能力" },
          ],
        },
        {
          emoji: "🧭",
          title: "第五章：2026年大模型生态分类与技术选型地图",
          lessons: [
            { emoji: "⚖️", title: "前沿闭源 vs. 开放权重：技术政治与商业博弈" },
            { emoji: "🛡️", title: "RLHF与对齐（Alignment）：让AI听懂人话" },
          ],
        },
        {
          emoji: "🛠️",
          title: "第六章：驾驭大模型：微调、RAG与系统评估",
          lessons: [
            { emoji: "🧠", title: "大模型\u201C外挂大脑\u201D：RAG（检索增强生成）原理与应用" },
            { emoji: "🎛️", title: "微调（Fine-tuning）机制与成本ROI考量" },
            { emoji: "🔬", title: "LLMOps与大模型评估（Evals）框架" },
          ],
        },
      ],
    },
    {
      emoji: "🗡️",
      title: "模块三：赋能利器——利用AI与Python实现数据分析与模型集成",
      chapters: [
        {
          emoji: "💻",
          title: "第七章：Vibe Coding：AI编程助手重塑开发体验",
          lessons: [
            { emoji: "⌨️", title: "打破代码恐惧：Cursor与GitHub Copilot环境配置" },
            { emoji: "📝", title: "上下文工程（Context Engineering）在辅助编程中的应用" },
          ],
        },
        {
          emoji: "🐍",
          title: "第八章：用AI写Python：化身超级数据分析师",
          lessons: [
            { emoji: "🚰", title: "数据清洗与处理流水线（Pandas库自动化）" },
            { emoji: "📊", title: "探索性数据分析（EDA）与自动可视化" },
            { emoji: "🔍", title: "SQL生成的智能化：文本转数据库查询（Text-to-SQL）" },
          ],
        },
        {
          emoji: "🔌",
          title: "第九章：连接大模型引擎——API调用实战",
          lessons: [
            { emoji: "🔑", title: "OpenAI与Anthropic API接口接入原理" },
            { emoji: "🗂️", title: "结构化输出：让大模型成为工作流引擎" },
          ],
        },
      ],
    },
    {
      emoji: "📦",
      title: "模块四：模型宝库——Hugging Face与Transformers库深度漫游",
      chapters: [
        {
          emoji: "🤗",
          title: "第十章：Hugging Face生态系统全景图",
          lessons: [
            { emoji: "🔎", title: "Hugging Face Hub探秘：搜寻与评估开源模型" },
            { emoji: "📚", title: "Datasets库与高质量数据基建" },
          ],
        },
        {
          emoji: "⚡",
          title: "第十一章：Transformer库与Spaces快捷验证",
          lessons: [
            { emoji: "🚂", title: "Transformer Pipeline：几行代码实现推理" },
            { emoji: "🚀", title: "Hugging Face Spaces与Gradio：产品原型的极速发布" },
          ],
        },
      ],
    },
    {
      emoji: "🤖",
      title: "模块五：智能体时代——LangChain与LangGraph工作流搭建原理",
      chapters: [
        {
          emoji: "🧬",
          title: "第十二章：Agent（智能体）的解剖与认知",
          lessons: [
            { emoji: "🏃", title: "什么是Agent？从被动问答到主动规划" },
            { emoji: "🧩", title: "高级Agentic设计模式：ReAct、Reflection与Multi-Agent" },
          ],
        },
        {
          emoji: "🌉",
          title: "第十三章：打通孤岛的桥梁——模型上下文协议 (MCP)",
          lessons: [
            { emoji: "🔌", title: "MCP架构解析：AI智能体的\u201CUSB-C接口\u201D" },
            { emoji: "🛡️", title: "设计安全的MCP交互边界" },
          ],
        },
        {
          emoji: "🕸️",
          title: "第十四章：从线性链到状态图——LangChain与LangGraph剖析",
          lessons: [
            { emoji: "⛓️", title: "LangChain核心组件与表达式语言（LCEL）" },
            { emoji: "🗺️", title: "LangGraph原理：引入状态、循环与图神经网络逻辑" },
          ],
        },
      ],
    },
    {
      emoji: "🧱",
      title: "模块六：零代码构建——Coze与Dify智能体与复杂工作流实操",
      chapters: [
        {
          emoji: "⚖️",
          title: "第十五章：零代码AI平台生态横评（2026版）",
          lessons: [
            { emoji: "🥊", title: "Coze vs Dify：架构定位与场景选型" },
          ],
        },
        {
          emoji: "🏗️",
          title: "第十六章：Dify实战：搭建企业级RAG与复杂工作流",
          lessons: [
            { emoji: "🏢", title: "构建高质量知识库与检索增强引擎" },
            { emoji: "🎨", title: "画布编排：拖拽式复杂逻辑（Workflow）搭建" },
          ],
        },
        {
          emoji: "🐙",
          title: "第十七章：Coze实战：多模态智能体与多端分发",
          lessons: [
            { emoji: "🐣", title: "快速孵化全能Bot与插件调用机制" },
            { emoji: "🌐", title: "多智能体编排（Multi-Agent）与生态投放" },
          ],
        },
      ],
    },
    {
      emoji: "🚢",
      title: "模块七：实战与起航——AI产品全生命周期管理与面试通关",
      chapters: [
        {
          emoji: "💰",
          title: "第十八章：商业化变现与合规风险护城河",
          lessons: [
            { emoji: "🪙", title: "不再\u201C烧钱\u201D：AI产品的代币经济学与定价策略" },
            { emoji: "📜", title: "带刺的玫瑰：AI伦理、隐私与全球合规指南" },
          ],
        },
        {
          emoji: "💼",
          title: "第十九章：企业真实案例全场景讲解（保密）",
          lessons: [],
        },
        {
          emoji: "🏆",
          title: "第二十章：决胜2026求职季：作品集与面试冲刺",
          lessons: [
            { emoji: "📂", title: "拒绝空谈：用学习的知识构建硬核作品集" },
            { emoji: "🎤", title: "面试拆解：系统设计、评估指标与场景推演" },
          ],
        },
      ],
    },
  ],
};
