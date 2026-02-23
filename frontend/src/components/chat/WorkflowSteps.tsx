/**
 * 可折叠工作流步骤面板
 * 实时展示 Dify 工作流各节点执行进度
 */
import { useState, useEffect, useRef } from "react";

export interface StepItem {
  title: string;
  status: "running" | "done";
}

interface Props {
  steps: StepItem[];
  defaultCollapsed?: boolean;
}

export default function WorkflowSteps({ steps, defaultCollapsed = false }: Props) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const contentRef = useRef<HTMLDivElement>(null);

  const visible = steps.filter((s) => s.title !== "工作流启动");
  const allDone = visible.length > 0 && visible.every((s) => s.status === "done");
  const doneCount = visible.filter((s) => s.status === "done").length;

  useEffect(() => {
    if (allDone && !defaultCollapsed) {
      const timer = setTimeout(() => setCollapsed(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [allDone, defaultCollapsed]);

  if (visible.length === 0) return null;

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
          maxHeight: collapsed ? "0px" : `${(visible.length * 32) + 16}px`,
          opacity: collapsed ? 0 : 1,
        }}
      >
        <div className="wf-steps-list">
          {visible.map((step, i) => (
            <div key={`${step.title}-${i}`} className="wf-step-item">
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
