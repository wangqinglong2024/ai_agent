/**
 * Supabase 客户端
 * 浏览器端使用 anon_key + 用户 JWT 进行操作
 */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "⚠️ 缺少 Supabase 配置！请在 frontend/.env 中设置 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
