# 部署与网关说明

## 注册 404：确保网关转发 `/api/auth`

后端提供以下认证相关接口：

- `GET  /auth/health` — 用于检查网关是否把 `/api/auth` 转发到本后端
- `POST /auth/register` — 用户名+密码注册（不走 Supabase 前端 signup，避免 500）
- `POST /auth/avatar` — 头像上传（需登录，后端代理 Storage 并自动建桶）

**网关必须把 `/api` 下所有路径都转发到同一后端**，例如：

- 请求 `https://ideas.top/api/auth/register` → 转发到后端，路径为 `/auth/register`
- 请求 `https://ideas.top/api/chat/conversations` → 转发到后端，路径为 `/chat/conversations`

若只配置了 `/api/chat` 转发，而 `/api/auth` 未转发或转发到别的服务，就会出现 **注册 404**。

**自检**：在浏览器打开或用 curl 请求：

```text
GET https://ideas.top/api/auth/health
```

若返回 `{"status":"ok","service":"auth"}` 说明路由正确；若 404，需在网关里为 `/api/auth` 配置到本后端。

## 更新代码后必做

1. **重新构建并启动后端**（否则没有 `/auth/register`、`/auth/avatar` 等路由）：
   ```bash
   cd /opt/projects/ai_agent
   docker compose build --no-cache backend && docker compose up -d backend
   ```

2. **重新构建并启动前端**：
   ```bash
   docker compose build --no-cache frontend && docker compose up -d frontend
   ```

## 头像上传

头像改为**走后端代理**：前端把图片发给后端 `POST /api/auth/avatar`，后端用 Service Role 调 Supabase Storage，并在需要时自动创建 `avatars` 桶，**无需在 Supabase 控制台手动建桶**。只要网关能访问到 `/api/auth` 且后端已更新即可。
