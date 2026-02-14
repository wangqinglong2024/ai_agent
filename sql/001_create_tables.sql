-- ============================================================================
-- Ideas.top C端应用 - 数据库初始化脚本
-- 在 Supabase Dashboard 的 SQL Editor 中执行本文件
-- ============================================================================

-- ============================================================================
-- 1. 用户档案表 (扩展 auth.users)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    nickname    TEXT,
    avatar_url  TEXT DEFAULT '',
    bio         TEXT DEFAULT '',
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.user_profiles IS 'C端用户档案，自动在注册时创建';

-- ============================================================================
-- 2. 对话表
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.conversations (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title           TEXT DEFAULT '新对话',
    model           TEXT DEFAULT 'default',       -- 使用的模型标识
    dify_conversation_id TEXT DEFAULT '',          -- Dify 侧的对话 ID (用于上下文关联)
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.conversations IS '用户的对话会话';

-- ============================================================================
-- 3. 消息表
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.messages (
    id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id     UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
    role                TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content             TEXT NOT NULL,
    tokens_used         INTEGER DEFAULT 0,
    metadata            JSONB DEFAULT '{}',       -- 存储额外信息，如 Dify message_id 等
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.messages IS '对话中的消息记录';

-- ============================================================================
-- 4. 索引
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON public.conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);

-- ============================================================================
-- 5. 开启 RLS (行级安全)
-- ============================================================================
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 6. RLS 策略 - user_profiles
-- ============================================================================
CREATE POLICY "Users can view own profile"
    ON public.user_profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.user_profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.user_profiles FOR UPDATE
    USING (auth.uid() = id);

-- ============================================================================
-- 7. RLS 策略 - conversations
-- ============================================================================
CREATE POLICY "Users can view own conversations"
    ON public.conversations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create conversations"
    ON public.conversations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
    ON public.conversations FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations"
    ON public.conversations FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================================
-- 8. RLS 策略 - messages
-- ============================================================================
CREATE POLICY "Users can view messages in own conversations"
    ON public.messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.conversations
            WHERE id = messages.conversation_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert messages in own conversations"
    ON public.messages FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.conversations
            WHERE id = messages.conversation_id AND user_id = auth.uid()
        )
    );

-- ============================================================================
-- 9. Service Role 策略 (后端使用 service_role_key 时可访问全部数据)
-- ============================================================================
CREATE POLICY "Service role full access to profiles"
    ON public.user_profiles FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to conversations"
    ON public.conversations FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to messages"
    ON public.messages FOR ALL
    USING (auth.role() = 'service_role');

-- ============================================================================
-- 10. 触发器函数：注册时自动创建用户档案
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, nickname, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'nickname', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 绑定触发器
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 11. 触发器函数：自动更新 updated_at 字段
-- ============================================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 绑定触发器
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_conversations_updated_at ON public.conversations;
CREATE TRIGGER update_conversations_updated_at
    BEFORE UPDATE ON public.conversations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
