/**
 * 消息气泡 - 磨砂卡片
 */
import ReactMarkdown from "react-markdown";

interface Props {
  role: string;
  content: string;
  isStreaming?: boolean;
}

export default function MessageBubble({ role, content, isStreaming }: Props) {
  const isUser = role === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} max-w-4xl mx-auto`}
    >
      <div
        className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 transition-all duration-300 ${
          isUser
            ? "bg-gradient-to-br from-violet-500/15 to-violet-600/10 border border-violet-400/10"
            : "glass-card"
        }`}
      >
        {/* 角色标签 */}
        <div className={`text-[11px] mb-1.5 font-medium ${
          isUser ? "text-violet-300/60" : "text-cyan-300/60"
        }`}>
          {isUser ? "你" : "AI"}
        </div>

        {/* 消息内容 */}
        <div className="prose prose-invert prose-sm max-w-none [&_p]:text-white/70 [&_p]:leading-relaxed [&_code]:bg-white/5 [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5 [&_pre]:bg-white/[0.03] [&_pre]:border [&_pre]:border-white/[0.06] [&_pre]:rounded-xl">
          {isUser ? (
            <p className="whitespace-pre-wrap m-0 text-white/70">{content}</p>
          ) : (
            <ReactMarkdown>{content}</ReactMarkdown>
          )}
        </div>

        {/* 流式光标 */}
        {isStreaming && (
          <span className="typing-cursor" />
        )}
      </div>
    </div>
  );
}
