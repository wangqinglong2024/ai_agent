/**
 * 对话窗口 - 消息展示区域
 */
import { useEffect, useRef } from "react";
import { Spinner } from "@heroui/react";
import MessageBubble from "./MessageBubble";
import { useChatStore } from "@/stores/chatStore";

export default function ChatWindow() {
  const messages = useChatStore((s) => s.messages);
  const streaming = useChatStore((s) => s.streaming);
  const streamingContent = useChatStore((s) => s.streamingContent);
  const loadingMessages = useChatStore((s) => s.loadingMessages);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  if (loadingMessages) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Spinner size="lg" color="white" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 custom-scrollbar">
      {messages.length === 0 && !streaming && (
        <div className="flex flex-col items-center justify-center h-full gap-4 animate-fade-up">
          {/* 装饰光圈 */}
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/10 to-cyan-400/10 animate-pulse" />
            <div className="absolute inset-3 rounded-full border border-white/[0.06] flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-white/20">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>
          <p className="text-white/25 text-sm">发送消息开始对话</p>
          <p className="text-white/15 text-xs">Dify + AI 驱动</p>
        </div>
      )}

      {messages.map((msg) => (
        <MessageBubble key={msg.id} role={msg.role} content={msg.content} />
      ))}

      {streaming && streamingContent && (
        <MessageBubble role="assistant" content={streamingContent} isStreaming />
      )}

      {streaming && !streamingContent && (
        <div className="flex items-center gap-3 px-4 py-3 max-w-4xl mx-auto">
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400/60 animate-bounce [animation-delay:0ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400/60 animate-bounce [animation-delay:150ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400/60 animate-bounce [animation-delay:300ms]" />
          </div>
          <span className="text-xs text-white/30">AI 正在思考...</span>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
