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
      className={`flex max-w-4xl mx-auto ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 transition-all ${
          isUser
            ? "border border-[var(--input-border)] bg-[var(--input-bg)]"
            : "glass-card"
        }`}
      >
        <div className={`mb-1.5 text-[11px] font-medium text-[var(--text-muted)]`}>
          {isUser ? "你" : "AI"}
        </div>

        <div className="prose prose-sm max-w-none text-[var(--text-secondary)] [&_p]:leading-relaxed [&_code]:rounded [&_code]:bg-[var(--input-bg)] [&_code]:px-1.5 [&_code]:py-0.5 [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-[var(--glass-border)] [&_pre]:bg-[var(--input-bg)]">
          {isUser ? (
            <p className="m-0 whitespace-pre-wrap">{content}</p>
          ) : (
            <ReactMarkdown>{content}</ReactMarkdown>
          )}
        </div>

        {isStreaming && <span className="typing-cursor" />}
      </div>
    </div>
  );
}
