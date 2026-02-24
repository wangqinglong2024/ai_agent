/**
 * 可折叠工作流步骤面板
 * 实时展示 Dify 工作流各节点执行进度 + LLM 思考过程
 */
import { useState, useEffect, useRef } from "react";

export interface StepItem {
  title: string;
  status: "running" | "done";
}

/** LLM 思考/推理内容（如 Gemini 扩展思维） */
export interface ThinkingItem {
  nodeTitle: string;
  content: string;
}

interface Props {
  steps: StepItem[];
  thinkings?: ThinkingItem[];
  defaultCollapsed?: boolean;
}

export default function WorkflowSteps({
  steps,
  thinkings = [],
  defaultCollapsed = false,
}: Props) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [expandedThinkings, setExpandedThinkings] = useState<Set<string>>(new Set());
  const contentRef = useRef<HTMLDivElement>(null);

  const visible = steps.filter((s) => s.title !== "工作流启动");
  const allDone = visible.length > 0 && visible.every((s) => s.status === "done");
  const doneCount = visible.filter((s) => s.status === "done").length;

  /* 查找某个步骤关联的 thinking 内容 */
  const getThinkingForStep = (stepTitle: string): ThinkingItem | undefined => {
    return thinkings.find((t) => t.nodeTitle === stepTitle);
  };

  /* 切换某个 thinking 的展开/折叠 */
  const toggleThinking = (nodeTitle: string) => {
    setExpandedThinkings((prev) => {
      const next = new Set(prev);
      if (next.has(nodeTitle)) {
        next.delete(nodeTitle);
      } else {
        next.add(nodeTitle);
      }
      return next;
    });
  };

  /* 全部完成后自动折叠工作流面板 */
  useEffect(() => {
    if (allDone && !defaultCollapsed) {
      const timer = setTimeout(() => setCollapsed(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [allDone, defaultCollapsed]);

  /* 当有新的 thinking 到达时自动展开该条目 */
  useEffect(() => {
    if (thinkings.length > 0) {
      const latest = thinkings[thinkings.length - 1];
      setExpandedThinkings((prev) => {
        const next = new Set(prev);
        next.add(latest.nodeTitle);
        return next;
      });
    }
  }, [thinkings.length]);

  if (visible.length === 0) return null;

  /* 计算内容区域高度（考虑 thinking 展开后需要更多空间） */
  const estimatedHeight = visible.length * 32 + thinkings.length * 120 + 16;

  return (
    <div className="wf-steps-root mb-3">
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="wf-steps-toggle"
      >
        {allDone ? (
          <svg className="wf-steps-icon wf-done" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <div className="wf-steps-spinner" />
        )}

        <span className="wf-steps-summary">
          {allDone
            ? `已完成 ${doneCount} 个步骤`
            : `执行中... ${doneCount}/${visible.length} 步骤`}
        </span>

        <svg
          className={`wf-steps-chevron ${collapsed ? "" : "wf-expanded"}`}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <div
        ref={contentRef}
        className="wf-steps-content"
        style={{
          maxHeight: collapsed ? "0px" : `${estimatedHeight}px`,
          opacity: collapsed ? 0 : 1,
        }}
      >
        <div className="wf-steps-list">
          {visible.map((step, i) => {
            const thinking = getThinkingForStep(step.title);
            const isThinkingExpanded = expandedThinkings.has(step.title);

            return (
              <div key={`${step.title}-${i}`}>
                {/* 步骤行 */}
                <div className="wf-step-item">
                  {step.status === "done" ? (
                    <svg className="wf-step-check" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <div className="wf-step-spinner-sm" />
                  )}
                  <span className={`wf-step-title ${step.status === "running" ? "wf-active" : ""}`}>
                    {step.title}
                  </span>

                  {/* 思考过程标识按钮 */}
                  {thinking && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleThinking(step.title);
                      }}
                      className="wf-thinking-badge"
                      title={isThinkingExpanded ? "收起思考过程" : "展开思考过程"}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
                        <line x1="9" y1="21" x2="15" y2="21" />
                      </svg>
                      <span>思考</span>
                      <svg
                        className={`wf-thinking-chevron ${isThinkingExpanded ? "wf-expanded" : ""}`}
                        width="8"
                        height="8"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* 可折叠的思考过程内容 */}
                {thinking && (
                  <div
                    className={`wf-thinking-panel ${isThinkingExpanded ? "wf-thinking-open" : ""}`}
                  >
                    <div className="wf-thinking-content">
                      <pre>{thinking.content}</pre>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
