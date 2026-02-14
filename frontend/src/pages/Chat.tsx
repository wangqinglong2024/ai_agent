/**
 * 对话页面
 * 左侧: 磨砂对话列表  |  右侧: 消息窗口 + 输入框
 */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Listbox,
  ListboxItem,
  Spinner,
} from "@heroui/react";
import { useChat } from "@/hooks/useChat";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatInput from "@/components/chat/ChatInput";

export default function Chat() {
  const {
    conversations,
    activeConversationId,
    loadingConversations,
    fetchConversations,
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
  }, [conversationId]);

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
    <div className="flex-1 flex overflow-hidden">
      {/* ===== 磨砂侧边栏 ===== */}
      <aside
        className={`${
          showSidebar ? "flex" : "hidden"
        } md:flex flex-col w-full md:w-72 glass border-r border-white/[0.04]`}
      >
        {/* 标题 + 新建 */}
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white/60 tracking-wide uppercase">对话</h2>
          <Button
            size="sm"
            variant="flat"
            onPress={handleNew}
            className="btn-glow text-xs px-3 h-7"
          >
            + 新建
          </Button>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        {/* 对话列表 */}
        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
          {loadingConversations ? (
            <div className="flex justify-center py-10">
              <Spinner size="sm" color="white" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-12 text-white/30 text-sm">
              暂无对话，创建一个开始
            </div>
          ) : (
            <Listbox
              aria-label="对话列表"
              selectionMode="single"
              selectedKeys={activeConversationId ? new Set([activeConversationId]) : new Set()}
              onAction={(key) => handleSelect(key as string)}
              itemClasses={{
                base: "rounded-xl data-[hover=true]:bg-white/[0.04] data-[selected=true]:bg-white/[0.06] transition-all duration-200 mb-1",
              }}
            >
              {conversations.map((conv) => (
                <ListboxItem
                  key={conv.id}
                  textValue={conv.title}
                  endContent={
                    <Button
                      size="sm"
                      variant="light"
                      isIconOnly
                      onPress={() => handleDelete(conv.id)}
                      className="opacity-0 group-hover:opacity-100 min-w-5 h-5 text-white/30 hover:text-red-400"
                    >
                      ×
                    </Button>
                  }
                  className="group px-3 py-2.5"
                >
                  <div className="truncate text-sm text-white/70">{conv.title}</div>
                  <div className="text-[11px] text-white/25 mt-0.5">
                    {new Date(conv.updated_at).toLocaleDateString("zh-CN")}
                  </div>
                </ListboxItem>
              ))}
            </Listbox>
          )}
        </div>
      </aside>

      {/* ===== 右侧消息区 ===== */}
      <div
        className={`${
          showSidebar ? "hidden" : "flex"
        } md:flex flex-1 flex-col`}
      >
        {/* 移动端返回按钮 */}
        <div className="md:hidden p-2 border-b border-white/[0.04]">
          <Button
            size="sm"
            variant="light"
            onPress={() => setShowSidebar(true)}
            className="text-white/50 hover:text-white"
          >
            ← 返回
          </Button>
        </div>

        {activeConversationId ? (
          <>
            <ChatWindow />
            <ChatInput />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-5 animate-fade-up">
              {/* 装饰图标 */}
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-400/20 border border-white/[0.06] flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="url(#grd)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <defs><linearGradient id="grd" x1="0" y1="0" x2="24" y2="24"><stop offset="0%" stopColor="#8b5cf6" /><stop offset="100%" stopColor="#06b6d4" /></linearGradient></defs>
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
              </div>
              <p className="text-white/30 text-sm">选择一个对话或创建新对话</p>
              <Button
                onPress={handleNew}
                className="btn-glow px-6"
              >
                开始对话
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
