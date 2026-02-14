/**
 * 首页 - 高端科技感展示页 (HeroUI V3)
 */
import { useNavigate } from "react-router-dom";
import { Button } from "@heroui/react";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* 装饰性光斑 */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-violet-600/8 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/6 rounded-full blur-[120px] pointer-events-none" />

      {/* 主标题区域 */}
      <div className="text-center mb-12 animate-fade-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 text-xs text-neutral-400 tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          AI 智能平台已就绪
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-6">
          <span className="text-gradient">Ideas</span>
          <span className="text-white/80">.</span>
          <span className="text-gradient-accent">top</span>
        </h1>

        <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          发布指令，AI 为你思考
          <br />
          <span className="text-neutral-500">
            对接 Dify 工作流 · Openclaw 多模型 · 企微飞书多通道
          </span>
        </p>
      </div>

      {/* 功能卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl w-full mb-12">
        {[
          {
            icon: "💬",
            title: "智能对话",
            desc: "多轮上下文对话，SSE 流式实时输出",
            color: "from-violet-500/20 to-violet-600/5",
            delay: "animate-fade-up-delay-1",
          },
          {
            icon: "⚡",
            title: "工作流引擎",
            desc: "Dify 可视化工作流，一键触发自动化任务",
            color: "from-cyan-500/20 to-cyan-600/5",
            delay: "animate-fade-up-delay-2",
          },
          {
            icon: "🔗",
            title: "多模型接入",
            desc: "Openclaw 多通道调度，企微飞书无缝协作",
            color: "from-pink-500/20 to-pink-600/5",
            delay: "animate-fade-up-delay-3",
          },
        ].map((item) => (
          <div
            key={item.title}
            className={`glass-card rounded-2xl p-6 cursor-pointer group ${item.delay}`}
            onClick={() => navigate("/chat")}
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
              {item.icon}
            </div>
            <h3 className="text-lg font-bold text-white/90 mb-2 group-hover:text-gradient transition-all">
              {item.title}
            </h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* CTA 按钮 */}
      <div className="flex flex-col sm:flex-row gap-4 animate-fade-up-delay-3">
        <Button
          size="lg"
          onPress={() => navigate("/chat")}
          className="btn-glow text-white font-semibold px-10 h-13 text-base rounded-xl"
        >
          开始对话
          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="border-white/10 text-neutral-300 hover:border-violet-500/30 hover:text-white px-8 h-13 rounded-xl transition-all duration-300"
        >
          了解更多
        </Button>
      </div>

      {/* 底部技术栈标记 */}
      <div className="mt-16 flex items-center gap-6 text-[11px] text-neutral-500 tracking-widest uppercase animate-fade-up-delay-3">
        <span>Supabase</span>
        <span className="w-1 h-1 rounded-full bg-neutral-600" />
        <span>FastAPI</span>
        <span className="w-1 h-1 rounded-full bg-neutral-600" />
        <span>Dify</span>
        <span className="w-1 h-1 rounded-full bg-neutral-600" />
        <span>Openclaw</span>
      </div>
    </div>
  );
}
