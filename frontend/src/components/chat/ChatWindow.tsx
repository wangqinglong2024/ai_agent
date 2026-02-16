import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { useChatStore } from "@/stores/chatStore";

export default function ChatWindow() {
  const messages = useChatStore((s) => s.messages);
  const streaming = useChatStore((s) => s.streaming);
  const streamingContent = useChatStore((s) => s.streamingContent);
  const loadingMessages = useChatStore((s) => s.loadingMessages);
  const sendError = useChatStore((s) => s.sendError);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  if (loadingMessages) {
    return (
      <div className="flex flex-1 items-center justify-center" role="status" aria-label="正在加载消息">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--glass-border)] border-t-[var(--text-muted)]" />
      </div>
    );
  }

  return (
    <div className="custom-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-6">
      {sendError && (
        <div className="mx-auto max-w-4xl rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400" role="alert">
          {sendError}
        </div>
      )}
      {messages.length === 0 && !streaming && (
        <div className="flex h-full flex-col items-center justify-center gap-4 animate-fade-up">
          <div className="glass-card flex h-20 w-20 items-center justify-center rounded-2xl">
            <svg
              className="h-8 w-8 text-[var(--text-muted)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <p className="text-sm text-[var(--text-muted)]">发送消息开始对话</p>
          <p className="text-xs text-[var(--text-muted)]">Dify AI 驱动</p>
        </div>
      )}

      {messages.map((msg) => (
        <MessageBubble key={msg.id} role={msg.role} content={msg.content} />
      ))}

      {streaming && streamingContent && (
        <MessageBubble role="assistant" content={streamingContent} isStreaming />
      )}

      {streaming && !streamingContent && (
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3" role="status" aria-label="AI 正在思考">
          <div className="flex gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--text-muted)] animate-bounce [animation-delay:0ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--text-muted)] animate-bounce [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--text-muted)] animate-bounce [animation-delay:300ms]" />
          </div>
          <span className="text-xs text-[var(--text-muted)]">AI 正在思考...</span>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
