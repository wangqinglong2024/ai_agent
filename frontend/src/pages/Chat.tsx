import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (conversationId && conversationId !== activeConversationId) {
      selectConversation(conversationId);
    }
  }, [conversationId, activeConversationId, selectConversation]);

  const handleSelect = async (id: string) => {
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
    if (activeConversationId === id) {
      navigate("/chat");
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      <aside
        className={`${
          showSidebar ? "flex" : "hidden"
        } md:flex w-full md:w-72 flex-col border-r border-[var(--glass-border)] glass`}
      >
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            对话
          </h2>
          <button
            type="button"
            onClick={handleNew}
            className="btn-primary h-8 rounded-lg px-3 text-xs"
          >
            + 新建
          </button>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[var(--glass-border)] to-transparent" />

        <div className="custom-scrollbar flex-1 overflow-y-auto p-2">
          {loadingConversations ? (
            <div className="flex justify-center py-10">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--glass-border)] border-t-[var(--gradient-from)]" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="py-12 text-center text-sm text-[var(--text-muted)]">
              暂无对话，点击新建开始
            </div>
          ) : (
            <div className="space-y-1">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSelect(conv.id)}
                  onKeyDown={(e) => e.key === "Enter" && handleSelect(conv.id)}
                  className={`group flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-[var(--input-bg)] ${
                    activeConversationId === conv.id ? "bg-[var(--input-bg)]" : ""
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
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(conv.id);
                    }}
                    className="min-h-5 min-w-5 text-[var(--text-muted)] opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      <div
        className={`${
          showSidebar ? "hidden" : "flex"
        } md:flex flex-1 flex-col`}
      >
        <div className="flex items-center border-b border-[var(--glass-border)] p-2 md:hidden">
          <button
            type="button"
            onClick={() => setShowSidebar(true)}
            className="btn-ghost text-sm"
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
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--glass-border)] bg-[var(--input-bg)]">
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
              <button type="button" onClick={handleNew} className="btn-primary px-6">
                开始对话
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
