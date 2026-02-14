/**
 * 登录 / 注册页面 - 炫酷磨砂视觉
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Input,
  Button,
  Tabs,
  Tab,
} from "@heroui/react";
import { useAuthStore } from "@/stores/authStore";
import BackgroundScene from "@/components/three/BackgroundScene";

export default function Login() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuthStore();

  const [tab, setTab] = useState<string>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      navigate("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "登录失败");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await signUp(email, password, nickname);
      setSuccess("注册成功！请检查邮箱确认链接（如已关闭邮箱确认则可直接登录）");
      setTab("login");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "注册失败");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      tab === "login" ? handleLogin() : handleSignUp();
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Three.js 粒子宇宙背景 */}
      <div className="three-canvas-wrapper">
        <BackgroundScene />
      </div>

      {/* 装饰性光斑 */}
      <div className="fixed top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 w-[300px] h-[300px] bg-pink-500/5 rounded-full blur-[80px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      {/* 登录卡片 */}
      <div className="main-content w-full max-w-[440px] animate-fade-up">
        {/* Logo 区域 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 mb-4 animate-float shadow-lg shadow-violet-500/20">
            <span className="text-2xl font-black text-white">i</span>
          </div>
          <h1 className="text-4xl font-extrabold glow-text mb-2">Ideas.top</h1>
          <p className="text-default-400 text-sm tracking-wide">智能 AI 助手平台</p>
        </div>

        {/* 磨砂登录卡片 */}
        <div className="glass-card rounded-2xl p-8">
          {/* Tab 切换 */}
          <Tabs
            selectedKey={tab}
            onSelectionChange={(key) => {
              setTab(key as string);
              setError("");
              setSuccess("");
            }}
            fullWidth
            size="lg"
            classNames={{
              tabList: "bg-white/5 border border-white/5 rounded-xl p-1",
              cursor: "bg-gradient-to-r from-violet-600 to-cyan-500 rounded-lg shadow-lg shadow-violet-500/20",
              tab: "h-10 text-sm font-medium",
              tabContent: "group-data-[selected=true]:text-white text-default-400",
            }}
            className="mb-8"
          >
            <Tab key="login" title="登录" />
            <Tab key="signup" title="注册" />
          </Tabs>

          <div className="space-y-5" onKeyDown={handleKeyDown}>
            {tab === "signup" && (
              <div className="animate-fade-up">
                <Input
                  label="昵称"
                  placeholder="输入你的昵称"
                  value={nickname}
                  onValueChange={setNickname}
                  variant="bordered"
                  size="lg"
                  classNames={{
                    inputWrapper: "bg-white/[0.03] border-white/10 hover:border-violet-500/50 focus-within:!border-violet-500 transition-all duration-300",
                    label: "text-default-400",
                    input: "text-white placeholder:text-default-500",
                  }}
                />
              </div>
            )}

            <Input
              label="邮箱"
              type="email"
              placeholder="your@email.com"
              value={email}
              onValueChange={setEmail}
              variant="bordered"
              size="lg"
              isRequired
              classNames={{
                inputWrapper: "bg-white/[0.03] border-white/10 hover:border-violet-500/50 focus-within:!border-violet-500 transition-all duration-300",
                label: "text-default-400",
                input: "text-white placeholder:text-default-500",
              }}
            />

            <Input
              label="密码"
              type="password"
              placeholder="至少 6 位"
              value={password}
              onValueChange={setPassword}
              variant="bordered"
              size="lg"
              isRequired
              classNames={{
                inputWrapper: "bg-white/[0.03] border-white/10 hover:border-violet-500/50 focus-within:!border-violet-500 transition-all duration-300",
                label: "text-default-400",
                input: "text-white placeholder:text-default-500",
              }}
            />

            {error && (
              <div className="bg-danger/10 border border-danger/20 rounded-lg px-4 py-2.5 animate-fade-up">
                <p className="text-danger text-sm text-center">{error}</p>
              </div>
            )}
            {success && (
              <div className="bg-success/10 border border-success/20 rounded-lg px-4 py-2.5 animate-fade-up">
                <p className="text-success text-sm text-center">{success}</p>
              </div>
            )}

            <Button
              fullWidth
              size="lg"
              isLoading={loading}
              onPress={tab === "login" ? handleLogin : handleSignUp}
              className="btn-glow text-white font-semibold h-12 text-base rounded-xl mt-2"
            >
              {tab === "login" ? "登 录" : "注 册"}
            </Button>
          </div>

          {/* 底部装饰 */}
          <div className="mt-8 flex items-center gap-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <span className="text-[10px] text-default-500 tracking-widest uppercase">Powered by AI</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
        </div>

        {/* 底部版权 */}
        <p className="text-center text-[11px] text-default-500 mt-6 tracking-wide">
          &copy; 2026 Ideas.top · Dify + Supabase
        </p>
      </div>
    </div>
  );
}
