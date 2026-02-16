import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useChat } from "@/hooks/useChat";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatInput from "@/components/chat/ChatInput";

export default function Chat() {
  const {
    conversations,
    activeConversationId,
    loadingConversations,
    newConversation,
    removeConversation,
    selectConversation,
  } = useChat();

  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(true);

  // 二次确认删除：记录待确认的对话 ID
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (conversationId && conversationId !== activeConversationId) {
      selectConversation(conversationId);
    }
  }, [conversationId, activeConversationId, selectConversation]);

  // 3 秒后自动取消确认状态
  useEffect(() => {
    if (!confirmDeleteId) return;
    const timer = setTimeout(() => setConfirmDeleteId(null), 3000);
    return () => clearTimeout(timer);
  }, [confirmDeleteId]);

  const handleSelect = async (id: string) => {
    setConfirmDeleteId(null);
    await selectConversation(id);
    navigate(`/chat/${id}`);
    if (window.innerWidth < 768) setShowSidebar(false);
  };

  const handleNew = async () => {
    const conv = await newConversation();
    navigate(`/chat/${conv.id}`);
    if (window.innerWidth < 768) setShowSidebar(false);
  };

  const handleDelete = async (id: string) => {
    await removeConversation(id);
    setConfirmDeleteId(null);
    if (activeConversationId === id) {
      navigate("/chat");
    }
  };

  /** 删除按钮点击：第一次进入确认态，第二次执行删除 */
  const handleDeleteClick = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if (confirmDeleteId === id) {
        handleDelete(id);
      } else {
        setConfirmDeleteId(id);
      }
    },
    [confirmDeleteId],
  );

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      {/* ====== 侧边栏 ====== */}
      <aside
        className={`${
          showSidebar ? "flex w-full md:w-72" : "hidden"
        } shrink-0 flex-col border-r border-[var(--glass-border)] glass transition-all duration-300 ease-out`}
        aria-label="对话侧边栏"
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            {/* 折叠按钮 — 仅桌面端 */}
            <button
              type="button"
              onClick={() => setShowSidebar(false)}
              className="btn-ghost hidden h-8 w-8 items-center justify-center rounded-lg md:flex"
              aria-label="折叠侧边栏"
              title="折叠侧边栏"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              对话列表
            </h2>
          </div>
          <button
            type="button"
            onClick={handleNew}
            className="btn-primary h-8 rounded-xl px-3 text-xs"
            aria-label="新建对话"
          >
            + 新建
          </button>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[var(--glass-border)] to-transparent" />

        <div className="custom-scrollbar flex-1 overflow-y-auto p-2">
          {loadingConversations ? (
            <div className="flex justify-center py-10" role="status" aria-label="正在加载对话">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--glass-border)] border-t-[var(--text-muted)]" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="py-12 text-center text-sm text-[var(--text-muted)]">
              暂无对话，点击新建开始
            </div>
          ) : (
            <div className="space-y-1" role="listbox" aria-label="对话列表">
              {conversations.map((conv) => {
                const isConfirming = confirmDeleteId === conv.id;
                return (
                  <div
                    key={conv.id}
                    role="option"
                    tabIndex={0}
                    aria-selected={activeConversationId === conv.id}
                    onClick={() => handleSelect(conv.id)}
                    onKeyDown={(e) => e.key === "Enter" && handleSelect(conv.id)}
                    className={`group flex cursor-pointer items-center justify-between rounded-2xl px-3 py-2.5 transition-all duration-300 ease-out ${
                      activeConversationId === conv.id
                        ? "bg-[var(--sidebar-active-bg)] border border-[var(--glass-border)] shadow-sm backdrop-blur-sm"
                        : "border border-transparent hover:bg-[var(--sidebar-hover-bg)]"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm text-[var(--text-secondary)]">
                        {conv.title}
                      </div>
                      <div className="mt-0.5 text-[11px] text-[var(--text-muted)]">
                        {new Date(conv.updated_at).toLocaleDateString("zh-CN")}
                      </div>
                    </div>

                    {/* 删除按钮 — 热区 36×36，二次确认 */}
                    <button
                      type="button"
                      onClick={(e) => handleDeleteClick(e, conv.id)}
                      aria-label={isConfirming ? `确认删除: ${conv.title}` : `删除对话: ${conv.title}`}
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ease-out ${
                        isConfirming
                          ? "bg-red-500/15 text-red-400 opacity-100 scale-110"
                          : "text-[var(--text-muted)] opacity-0 hover:bg-[var(--bg-glass-hover)] hover:text-red-400 group-hover:opacity-100"
                      }`}
                    >
                      {isConfirming ? (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </aside>

      {/* ====== 主聊天区域 ====== */}
      <div
        className={`${
          showSidebar ? "hidden md:flex" : "flex"
        } relative min-h-0 flex-1 flex-col overflow-hidden`}
      >
        {/* 展开侧边栏按钮 — 侧边栏隐藏时浮于左上角，仅桌面端 */}
        {!showSidebar && (
          <button
            type="button"
            onClick={() => setShowSidebar(true)}
            className="btn-ghost absolute left-3 top-3 z-10 hidden h-9 w-9 items-center justify-center rounded-xl md:flex"
            aria-label="展开侧边栏"
            title="展开侧边栏"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* 移动端返回按钮 */}
        <div className="glass flex shrink-0 items-center border-b border-[var(--glass-border)] p-2 md:hidden">
          <button
            type="button"
            onClick={() => setShowSidebar(true)}
            className="btn-ghost text-sm"
            aria-label="显示侧边栏"
          >
            ← 返回
          </button>
        </div>

        {activeConversationId ? (
          <>
            <ChatWindow />
            <ChatInput />
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="animate-fade-up space-y-5 text-center">
              <div className="glass-card mx-auto flex h-16 w-16 items-center justify-center rounded-2xl">
                <svg
                  className="h-7 w-7 text-[var(--text-muted)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
                  />
                </svg>
              </div>
              <p className="text-sm text-[var(--text-muted)]">选择对话或新建开始</p>
              <button
                type="button"
                onClick={handleNew}
                className="btn-primary rounded-2xl px-6"
                aria-label="开始新对话"
              >
                开始对话
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
