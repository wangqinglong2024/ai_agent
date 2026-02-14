/**
 * 登录 / 注册页面 - 炫酷磨砂视觉 (HeroUI V3)
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Tabs, TextField, Label, Input } from "@heroui/react";
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

  const inputClassName =
    "w-full bg-white/[0.03] border border-white/10 hover:border-violet-500/50 focus:border-violet-500 transition-all duration-300 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 outline-none";

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
          <p className="text-neutral-400 text-sm tracking-wide">智能 AI 助手平台</p>
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
            className="mb-8"
          >
            <Tabs.List className="bg-white/5 border border-white/5 rounded-xl p-1 flex">
              <Tabs.Tab
                id="login"
                className="flex-1 h-10 text-sm font-medium rounded-lg text-center cursor-pointer transition-all data-[selected]:bg-gradient-to-r data-[selected]:from-violet-600 data-[selected]:to-cyan-500 data-[selected]:text-white data-[selected]:shadow-lg data-[selected]:shadow-violet-500/20 text-neutral-400 flex items-center justify-center"
              >
                登录
              </Tabs.Tab>
              <Tabs.Tab
                id="signup"
                className="flex-1 h-10 text-sm font-medium rounded-lg text-center cursor-pointer transition-all data-[selected]:bg-gradient-to-r data-[selected]:from-violet-600 data-[selected]:to-cyan-500 data-[selected]:text-white data-[selected]:shadow-lg data-[selected]:shadow-violet-500/20 text-neutral-400 flex items-center justify-center"
              >
                注册
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel id="login">
              <div className="space-y-5 mt-6" onKeyDown={handleKeyDown}>
                <TextField value={email} onChange={setEmail}>
                  <Label className="text-neutral-400 text-sm mb-1 block">邮箱</Label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    className={inputClassName}
                  />
                </TextField>

                <TextField value={password} onChange={setPassword}>
                  <Label className="text-neutral-400 text-sm mb-1 block">密码</Label>
                  <Input
                    type="password"
                    placeholder="至少 6 位"
                    className={inputClassName}
                  />
                </TextField>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5 animate-fade-up">
                    <p className="text-red-400 text-sm text-center">{error}</p>
                  </div>
                )}

                <Button
                  size="lg"
                  isDisabled={loading}
                  onPress={handleLogin}
                  className="btn-glow text-white font-semibold h-12 text-base rounded-xl mt-2 w-full"
                >
                  {loading ? "登录中..." : "登 录"}
                </Button>
              </div>
            </Tabs.Panel>

            <Tabs.Panel id="signup">
              <div className="space-y-5 mt-6" onKeyDown={handleKeyDown}>
                <TextField value={nickname} onChange={setNickname}>
                  <Label className="text-neutral-400 text-sm mb-1 block">昵称</Label>
                  <Input
                    placeholder="输入你的昵称"
                    className={inputClassName}
                  />
                </TextField>

                <TextField value={email} onChange={setEmail}>
                  <Label className="text-neutral-400 text-sm mb-1 block">邮箱</Label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    className={inputClassName}
                  />
                </TextField>

                <TextField value={password} onChange={setPassword}>
                  <Label className="text-neutral-400 text-sm mb-1 block">密码</Label>
                  <Input
                    type="password"
                    placeholder="至少 6 位"
                    className={inputClassName}
                  />
                </TextField>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5 animate-fade-up">
                    <p className="text-red-400 text-sm text-center">{error}</p>
                  </div>
                )}
                {success && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2.5 animate-fade-up">
                    <p className="text-green-400 text-sm text-center">{success}</p>
                  </div>
                )}

                <Button
                  size="lg"
                  isDisabled={loading}
                  onPress={handleSignUp}
                  className="btn-glow text-white font-semibold h-12 text-base rounded-xl mt-2 w-full"
                >
                  {loading ? "注册中..." : "注 册"}
                </Button>
              </div>
            </Tabs.Panel>
          </Tabs>

          {/* 底部装饰 */}
          <div className="mt-8 flex items-center gap-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <span className="text-[10px] text-neutral-500 tracking-widest uppercase">
              Powered by AI
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
        </div>

        {/* 底部版权 */}
        <p className="text-center text-[11px] text-neutral-500 mt-6 tracking-wide">
          &copy; 2026 Ideas.top · Dify + Supabase
        </p>
      </div>
    </div>
  );
}
