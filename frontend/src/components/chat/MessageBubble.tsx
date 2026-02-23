import { useState, useRef, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import ImageLightbox from "./ImageLightbox";
import WorkflowSteps, { type StepItem } from "./WorkflowSteps";

interface Props {
  role: string;
  content: string;
  images?: string[];
  steps?: StepItem[];
  stepsDefaultCollapsed?: boolean;
  imagesLoading?: boolean;
  isStreaming?: boolean;
}

/**
 * 从 AI 回复文本中彻底清除所有链接
 * 图片已在画廊中独立展示，文案中不需要任何 URL
 */
function stripImageUrls(text: string, _imageUrls: string[] = []): string {
  let s = text;
  s = s.replace(/!\[.*?\]\((https?:\/\/\S+?)\)/g, "");
  s = s.replace(/https?:\/\/\S+/gi, "");
  s = s.replace(/^\s*[-*•]\s*$/gm, "");
  s = s.replace(/^\s*\d+[.)]\s*$/gm, "");
  s = s.replace(/\s*[-–—]+\s*$/gm, "");
  s = s.replace(/\(\s*\)/g, "");
  s = s.replace(/\[\s*\]/g, "");
  s = s.replace(/\n{3,}/g, "\n\n");
  s = s.replace(/[ \t]+$/gm, "");
  return s.trim();
}

export default function MessageBubble({
  role,
  content,
  images = [],
  steps = [],
  stepsDefaultCollapsed = false,
  imagesLoading = false,
  isStreaming,
}: Props) {
  const isUser = role === "user";
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const displayText = useMemo(
    () => (isUser ? content : stripImageUrls(content, images)),
    [isUser, content, images],
  );

  const showScrollGallery = images.length > 3;

  const scrollBy = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 220, behavior: "smooth" });
  };

  return (
    <>
      <div
        className={`flex max-w-4xl mx-auto ${isUser ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`rounded-2xl px-5 py-4 transition-all ${
            isUser
              ? "max-w-[80%] md:max-w-[70%] glass-bubble-user"
              : "max-w-[88%] md:max-w-[78%] glass-bubble-ai"
          }`}
        >
          <div className="mb-1.5 text-[11px] font-medium text-[var(--text-muted)]">
            {isUser ? "你" : "AI"}
          </div>

          {/* 工作流步骤面板 */}
          {!isUser && steps.length > 0 && (
            <WorkflowSteps steps={steps} defaultCollapsed={stepsDefaultCollapsed} />
          )}

          {/* 文本内容 */}
          {displayText && (
            <div
              className={
                isUser
                  ? "text-sm text-[var(--text-secondary)]"
                  : "ai-prose text-[var(--text-secondary)]"
              }
            >
              {isUser ? (
                <p className="m-0 whitespace-pre-wrap">{displayText}</p>
              ) : (
                <ReactMarkdown>{displayText}</ReactMarkdown>
              )}
            </div>
          )}

          {/* 流式等待提示：尚无文本时 */}
          {isStreaming && !displayText && steps.length === 0 && (
            <div className="flex items-center gap-2 py-1" role="status">
              <div className="flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--text-muted)] animate-bounce [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--text-muted)] animate-bounce [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--text-muted)] animate-bounce [animation-delay:300ms]" />
              </div>
              <span className="text-xs text-[var(--text-muted)]">AI 正在思考...</span>
            </div>
          )}

          {/* 图片生成中占位 */}
          {imagesLoading && images.length === 0 && (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-[var(--glass-border)] bg-[var(--bg-glass)] px-4 py-3">
              <div className="images-loading-spinner" />
              <span className="text-xs text-[var(--text-muted)]">图片生成中，请稍候...</span>
            </div>
          )}

          {/* 图片画廊 */}
          {images.length > 0 && (
            showScrollGallery ? (
              <div className="relative mt-4">
                <button
                  type="button"
                  onClick={() => scrollBy(-1)}
                  className="gallery-scroll-btn left-0"
                  aria-label="向左滚动"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <button
                  type="button"
                  onClick={() => scrollBy(1)}
                  className="gallery-scroll-btn right-0"
                  aria-label="向右滚动"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>

                <div
                  ref={scrollRef}
                  className="gallery-scroll-track flex gap-2.5 overflow-x-auto pb-2"
                >
                  {images.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setLightboxIndex(i)}
                      className="image-thumb group relative shrink-0 overflow-hidden rounded-xl border border-[var(--glass-border)] w-[180px] aspect-[4/3] cursor-pointer transition-all duration-300 hover:shadow-lg focus:outline-none"
                      aria-label={`查看图片 ${i + 1}`}
                    >
                      <img src={url} alt={`生成图片 ${i + 1}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pb-2">
                        <span className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                          放大
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div
                className={`mt-4 grid gap-2.5 ${
                  images.length === 1
                    ? "grid-cols-1 max-w-[240px]"
                    : images.length === 2
                      ? "grid-cols-2"
                      : "grid-cols-3"
                }`}
              >
                {images.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setLightboxIndex(i)}
                    className="image-thumb group relative overflow-hidden rounded-xl border border-[var(--glass-border)] aspect-[4/3] cursor-pointer transition-all duration-300 hover:shadow-lg focus:outline-none"
                    aria-label={`查看图片 ${i + 1}`}
                  >
                    <img src={url} alt={`生成图片 ${i + 1}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pb-2.5">
                      <span className="flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                        放大
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )
          )}

          {isStreaming && displayText && <span className="typing-cursor" />}
        </div>
      </div>

      {lightboxIndex !== null && (
        <ImageLightbox
          images={images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
