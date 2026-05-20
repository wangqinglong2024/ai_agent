/**
 * 课程数据：自然语言编程——用AI构建企业级应用
 * 独立文件，避免单文件行数过多
 */

import type { Course } from "./courses";

export const courseNaturalLangProg: Course = {
  id: "natural-lang-prog",
  emoji: "🚀",
  title: "自然语言编程",
  subtitle: "用AI构建企业级应用",
  description:
    "从零搭建云端开发环境，掌握Docker容器化、Supabase数据库、Dify AI工作流、FastAPI后端到React前端的全栈技能，用自然语言指挥AI完成企业级软件开发。",
  price: "¥3,980",
  tag: "极客开发",
  tagColor: "from-amber-500 to-orange-500",
  audience: "渴望解放双手、用自然语言替代传统代码构建SaaS及系统应用的人群",
  highlights: [
    "9 大模块，22 章完整全栈实战体系",
    "云服务器、Docker、Supabase基础设施全覆盖",
    "Dify AI平台工作流与Agent深度开发",
    "FastAPI + React + TS 全栈闭环",
    "Nginx反向代理与SSL证书部署上线",
  ],
  benefits: [
    "✅ 硬核技术课程学习",
    "💬 线上图文形式答疑",
  ],
  modules: [
    {
      emoji: "🧊",
      title: "模块一：破冰启航——从零理解软件开发与AI编程新范式",
      chapters: [
        {
          emoji: "🌐",
          title: "第一章：解密数字世界——现代软件是如何运转的？",
          lessons: [
            { emoji: "🏪", title: "软件的\u201C前店后厂\u201D模型：客户端与服务端的对话" },
            { emoji: "🗄️", title: "数据的记忆中枢：数据库的作用与分类" },
            { emoji: "🗣️", title: "重新定义开发：什么是自然语言编程（Vibe Coding）？" },
          ],
        },
        {
          emoji: "☁️",
          title: "第二章：云端筑基——拥抱服务器与算力基础设施",
          lessons: [
            { emoji: "💻", title: "云上的专属电脑：腾讯云服务器（CVM）购买指南" },
            { emoji: "🌍", title: "跨越网络高墙：Ubuntu环境下的网络问题排查与Clash部署" },
            { emoji: "🔑", title: "连接云端的桥梁：SSH协议与密钥登录" },
          ],
        },
      ],
    },
    {
      emoji: "⚔️",
      title: "模块二：利器出鞘——AI开发工作流与环境全副武装",
      chapters: [
        {
          emoji: "💻",
          title: "第三章：开发指挥中心——VSCode远程开发环境搭建",
          lessons: [
            { emoji: "📝", title: "宇宙第一编辑器：VSCode的安装与基础汉化配置" },
            { emoji: "📡", title: "天涯若比邻：配置Remote-SSH连接腾讯云" },
            { emoji: "🤖", title: "AI副驾入驻：接入Claude大模型与Rules规则设定" },
          ],
        },
        {
          emoji: "🧠",
          title: "第四章：AI外脑扩展——MCP协议与自动化工具链集成",
          lessons: [
            { emoji: "🔌", title: "打破信息孤岛：模型上下文协议（MCP）白话解析" },
            { emoji: "🗃️", title: "让AI接管数据库：MCP直连Supabase配置实战" },
            { emoji: "👁️", title: "赋予AI联网慧眼与自动双臂：Tavily与Browser集成" },
            { emoji: "⚙️", title: "全域自动化协同：Openclaw连接飞书与Brave浏览器" },
          ],
        },
      ],
    },
    {
      emoji: "🐳",
      title: "模块三：容器魔法——Docker生态与核心基建部署",
      chapters: [
        {
          emoji: "📦",
          title: "第五章：装载万物的集装箱——Docker技术速成",
          lessons: [
            { emoji: "🚢", title: "告别\u201C在我的电脑上能跑\u201D：Docker核心理念与架构" },
            { emoji: "🏗️", title: "集装箱装卸工：Docker与Docker Compose在Ubuntu上的安装" },
          ],
        },
        {
          emoji: "🏛️",
          title: "第六章：搭建应用骨架——Supabase与Nocobase容器部署",
          lessons: [
            { emoji: "🔥", title: "开源版Firebase：Supabase的全功能私有化部署" },
            { emoji: "🧩", title: "拒绝重复造轮子：Nocobase无代码后台部署" },
            { emoji: "🌉", title: "打通任督二脉：S-N网桥（Nocobase读取Supabase）配置" },
          ],
        },
      ],
    },
    {
      emoji: "⚙️",
      title: "模块四：AI大核引擎——Dify全功能深度解析与工作流构建",
      chapters: [
        {
          emoji: "🎯",
          title: "第七章：初识Dify与提示词工程进阶",
          lessons: [
            { emoji: "🏗️", title: "私有化AI平台：Dify在服务器上的Docker化部署与配置" },
            { emoji: "💬", title: "对话即服务：在Dify中创建第一个基础聊天应用" },
            { emoji: "🪄", title: "驯服大语言模型：系统性Prompt框架与变量插值技术" },
          ],
        },
        {
          emoji: "📚",
          title: "第八章：赋予AI私有记忆——知识库（RAG）深度实操",
          lessons: [
            { emoji: "🔍", title: "RAG原理解析：向量数据库与文本切片（Chunking）的奥秘" },
            { emoji: "🧹", title: "高质量知识回召：Dify数据清洗与分段策略调优" },
            { emoji: "🎯", title: "精准打击：混合检索（Hybrid Search）与重排（Rerank）模型配置" },
          ],
        },
        {
          emoji: "🛤️",
          title: "第九章：编排复杂的思考路径——Dify Workflow（工作流）全解",
          lessons: [
            { emoji: "🧩", title: "可视化逻辑拼图：Workflow核心节点组件功能精讲" },
            { emoji: "🌐", title: "连接外部世界：通过HTTP节点调用第三方API服务" },
            { emoji: "🔄", title: "多模型接力赛：构建\u201C思考-校验-输出\u201D的自纠错工作流" },
            { emoji: "🐍", title: "代码节点的魅力：利用AI生成轻量数据处理脚本" },
          ],
        },
        {
          emoji: "🤖",
          title: "第十章：行动的智能体——Dify Agent开发与调试",
          lessons: [
            { emoji: "🏃", title: "从被动到主动：Agent与Workflow的本质区别与选型" },
            { emoji: "🧰", title: "武装智能体：为Agent挂载内置工具与自定义API工具" },
            { emoji: "🐛", title: "Agent性能调优与Debug追踪：看懂AI的\u201C心理活动\u201D" },
          ],
        },
      ],
    },
    {
      emoji: "🧠",
      title: "模块五：中枢大脑——用自然语言指挥FastAPI构建后端逻辑",
      chapters: [
        {
          emoji: "⚡",
          title: "第十一章：让AI为你写接口：FastAPI极速入门与环境构建",
          lessons: [
            { emoji: "🥇", title: "后端框架选型解析：为什么是FastAPI？" },
            { emoji: "🪄", title: "魔法指令初探：通过Claude生成FastAPI项目骨架" },
            { emoji: "🚀", title: "让接口跑起来：Uvicorn服务器配置与Swagger文档联调" },
          ],
        },
        {
          emoji: "🛡️",
          title: "第十二章：坚实的后盾：FastAPI与Supabase的AI深度整合",
          lessons: [
            { emoji: "🔑", title: "卸下鉴权包袱：接入Supabase JWT身份认证体系" },
            { emoji: "⚔️", title: "MCP降维打击：让Claude直连Supabase生成CRUD代码" },
            { emoji: "🧹", title: "数据清洗与校验：Pydantic模型与自然语言的碰撞" },
          ],
        },
        {
          emoji: "🔗",
          title: "第十三章：打通大模型：封装Dify API与流式输出（Streaming）",
          lessons: [
            { emoji: "📡", title: "对接智能中枢：在FastAPI中调用Dify工作流API" },
            { emoji: "🖨️", title: "打字机效果的秘密：Server-Sent Events (SSE) 流式传输" },
            { emoji: "🛡️", title: "异常熔断与重试机制：构建高可用AI中间件" },
          ],
        },
      ],
    },
    {
      emoji: "🎨",
      title: "模块六：颜值与交互——React+TS前端AI生成实战",
      chapters: [
        {
          emoji: "🧱",
          title: "第十四章：构建现代化前端基建：React与Tailwind CSS",
          lessons: [
            { emoji: "🧩", title: "组件化思维：现代前端是如何拼装的？" },
            { emoji: "🖌️", title: "让AI做UI设计师：Tailwind CSS原子化样式入门" },
            { emoji: "🚀", title: "脚手架启动：用Vite极速创建React+TS项目环境" },
          ],
        },
        {
          emoji: "✨",
          title: "第十五章：AI智能体前端页面搭建：从登录到对话框",
          lessons: [
            { emoji: "🚪", title: "第一印象：利用AI生成高转化率的登录与注册页" },
            { emoji: "💬", title: "主战场：构建仿ChatGPT风格的流式对话UI" },
            { emoji: "⚡", title: "连接神经：前端Fetch请求与SSE流式数据解析" },
          ],
        },
        {
          emoji: "🚦",
          title: "第十六章：打磨与优化：全局状态管理与路由守卫",
          lessons: [
            { emoji: "🧠", title: "记住我是谁：Zustand轻量级全局状态管理" },
            { emoji: "🗺️", title: "无缝跳转：React Router页面路由配置" },
            { emoji: "🚧", title: "闲人免进：路由守卫（Route Guards）与权限拦截" },
          ],
        },
      ],
    },
    {
      emoji: "📊",
      title: "模块七：数据可视化与运营——Nocobase低代码管理后台",
      chapters: [
        {
          emoji: "🪄",
          title: "第十七章：零代码的魔力：Nocobase界面配置与数据映射",
          lessons: [
            { emoji: "🔗", title: "数据认领：在Nocobase中同步Supabase业务表" },
            { emoji: "👁️", title: "所见即所得：配置列表视图与表单视图" },
            { emoji: "🔐", title: "权限的艺术：基于角色（RBAC）的访问控制配置" },
          ],
        },
        {
          emoji: "📈",
          title: "第十八章：洞察业务：统计仪表盘与自动化工作流",
          lessons: [
            { emoji: "📊", title: "仪表盘搭建：配置多维数据统计图表" },
            { emoji: "⚙️", title: "化繁为简：Nocobase内置自动化动作配置" },
          ],
        },
      ],
    },
    {
      emoji: "🌍",
      title: "模块八：走向公网——Nginx反向代理与域名SSL配置",
      chapters: [
        {
          emoji: "🚪",
          title: "第十九章：互联网的门牌号：域名解析与Nginx反向代理",
          lessons: [
            { emoji: "🏷️", title: "购买与绑定：域名注册与DNS解析实操" },
            { emoji: "🚦", title: "流量的交通警察：Nginx安装与基础配置" },
            { emoji: "📜", title: "编写交通规则：配置Nginx代理前端与后端服务" },
          ],
        },
        {
          emoji: "🔒",
          title: "第二十章：披上安全的铠甲：HTTPS加密与SSL证书",
          lessons: [
            { emoji: "🛡️", title: "拒绝裸奔：为什么现代应用必须使用HTTPS？" },
            { emoji: "🆓", title: "免费的午餐：利用Certbot一键申请Let's Encrypt证书" },
            { emoji: "🔐", title: "强制加密：配置Nginx自动跳转HTTPS与证书续期" },
          ],
        },
      ],
    },
    {
      emoji: "🌅",
      title: "模块九：终局与新生——云资源管理、复盘与独立开发者之路",
      chapters: [
        {
          emoji: "🩺",
          title: "第二十一章：防患于未然：日志监控与日常排障",
          lessons: [
            { emoji: "🔎", title: "追踪蛛丝马迹：Docker与Nginx日志查看技巧" },
            { emoji: "📊", title: "服务器体检：CPU、内存与磁盘的监控命令" },
          ],
        },
        {
          emoji: "💸",
          title: "第二十二章：避免被云账单背刺：腾讯云的清理与降本",
          lessons: [
            { emoji: "⏸️", title: "按下暂停键：安全停止与备份Docker容器数据" },
            { emoji: "🗑️", title: "彻底断舍离：腾讯云服务器的退订与彻底销毁逻辑" },
          ],
        },
      ],
    },
  ],
};
