# Ideas.top - C端智能对话应用

基于 **Supabase + FastAPI + React + Dify** 的全栈 AI 对话平台。

---

## 📐 架构总览

```
用户浏览器
    │
    ▼
Nginx Gateway (ideas.top:443)
    ├── /api/*  ──→  FastAPI 后端 (:8080)  ──→  Supabase (数据&认证)
    │                                       ──→  Dify (AI对话/工作流)
    │                                       ──→  Openclaw (企微/飞书)
    └── /*      ──→  React 前端 (:80)
```

**核心原则**：前端只负责 UI & 认证，所有业务逻辑走后端；Supabase 负责用户管理/鉴权/数据存储，后端只写业务逻辑。

---

## 📁 目录结构详解

```
ai_agent/
├── README.md                          # 本文件：项目说明文档
├── .gitignore                         # Git 忽略规则
├── docker-compose.yml                 # 生产环境容器编排
├── docker-compose.dev.yml             # 本地开发容器编排 (可选)
│
├── .github/
│   └── workflows/
│       └── deploy.yml                 # GitHub Actions 自动部署脚本
│
├── deploy/
│   └── nginx/
│       └── ideas.top.conf             # Nginx 网关路由配置 (替换服务器上的同名文件)
│
├── sql/
│   └── 001_create_tables.sql          # 数据库建表脚本 (在 Supabase SQL Editor 中执行)
│
├── backend/                           # ====== FastAPI 后端 ======
│   ├── Dockerfile                     # 后端镜像构建 (多阶段: dev/production)
│   ├── .dockerignore                  # Docker 构建忽略规则
│   ├── .env.example                   # 环境变量模板 (复制为 .env)
│   ├── requirements.txt               # Python 依赖清单
│   └── app/                           # FastAPI 应用源码
│       ├── __init__.py
│       ├── main.py                    # 应用入口：创建 FastAPI 实例、注册中间件和路由
│       ├── config.py                  # 配置管理：从环境变量加载所有配置项
│       ├── dependencies.py            # 依赖注入：JWT 认证、获取当前用户等
│       │
│       ├── middleware/                # 中间件层
│       │   ├── __init__.py
│       │   └── auth.py                # Supabase JWT Token 验证逻辑
│       │
│       ├── routers/                   # 路由层 (API 端点定义)
│       │   ├── __init__.py
│       │   ├── health.py              # GET /health - 健康检查
│       │   ├── chat.py                # /chat/* - 对话管理 & 消息发送 (SSE 流式)
│       │   └── dify.py                # /dify/* - Dify 工作流直调接口
│       │
│       ├── services/                  # 服务层 (外部 API 调用)
│       │   ├── __init__.py
│       │   ├── supabase_client.py     # Supabase 客户端工厂 (Admin / User 模式)
│       │   └── dify_service.py        # Dify API 集成 (Chat 流式 / Workflow)
│       │
│       └── models/                    # 数据模型 (Pydantic)
│           ├── __init__.py
│           └── chat.py                # 对话 & 消息的请求/响应模型
│
└── frontend/                          # ====== React 前端 ======
    ├── Dockerfile                     # 前端镜像构建 (多阶段: dev/build/production)
    ├── .dockerignore                  # Docker 构建忽略规则
    ├── .env.example                   # 环境变量模板 (复制为 .env)
    ├── package.json                   # Node.js 依赖和脚本
    ├── vite.config.ts                 # Vite 构建配置 (别名、代理)
    ├── tsconfig.json                  # TypeScript 配置
    ├── tailwind.config.js             # TailwindCSS + HeroUI 主题配置
    ├── postcss.config.js              # PostCSS 配置
    ├── index.html                     # HTML 入口
    ├── nginx.conf                     # 容器内 Nginx 配置 (SPA 路由、静态资源缓存)
    │
    ├── public/
    │   └── vite.svg                   # 网站图标
    │
    └── src/
        ├── main.tsx                   # React 入口：Provider 链 (HeroUI + Router)
        ├── App.tsx                    # 路由定义 & 权限守卫
        ├── vite-env.d.ts              # Vite 环境变量类型声明
        │
        ├── styles/
        │   └── globals.css            # 全局样式 (Tailwind、滚动条、Three.js 层级)
        │
        ├── lib/                       # 基础库封装
        │   ├── supabase.ts            # Supabase 浏览器客户端 (认证用)
        │   └── api.ts                 # 后端 API 调用封装 (自动附带 JWT)
        │
        ├── types/
        │   └── index.ts               # 全局 TypeScript 类型定义
        │
        ├── stores/                    # Zustand 状态管理
        │   ├── authStore.ts           # 认证状态：登录/注册/登出/会话监听
        │   └── chatStore.ts           # 对话状态：对话列表/消息/发送/流式接收
        │
        ├── hooks/                     # 自定义 React Hooks
        │   ├── useAuth.ts             # 认证 Hook：初始化监听 + 暴露方法
        │   └── useChat.ts             # 对话 Hook：自动加载对话列表
        │
        ├── components/                # UI 组件
        │   ├── layout/
        │   │   ├── Layout.tsx         # 主布局：Header + 内容区 + Three.js 背景
        │   │   └── Header.tsx         # 顶部导航栏：Logo、导航、用户菜单
        │   │
        │   ├── chat/
        │   │   ├── ChatWindow.tsx     # 消息展示区 (自动滚动、流式显示)
        │   │   ├── ChatInput.tsx      # 消息输入框 (Enter 发送、Shift+Enter 换行)
        │   │   └── MessageBubble.tsx  # 消息气泡 (Markdown 渲染、流式光标)
        │   │
        │   └── three/
        │       └── BackgroundScene.tsx # Three.js 粒子背景动画
        │
        └── pages/                     # 页面组件
            ├── Home.tsx               # 首页：功能介绍卡片
            ├── Chat.tsx               # 对话页：左侧会话列表 + 右侧消息区 (响应式)
            └── Login.tsx              # 登录/注册页：Supabase Auth
```

---

## 🚀 快速开始

### 一、建表（在 Supabase 管理后台执行）

1. 打开你的 Supabase Dashboard → **SQL Editor**
2. 粘贴 `sql/001_create_tables.sql` 的全部内容并执行
3. 脚本会创建以下内容：
   - `user_profiles` 表：用户档案，注册时自动创建
   - `conversations` 表：对话会话
   - `messages` 表：消息记录
   - **RLS 策略**：每个用户只能访问自己的数据
   - **Service Role 策略**：后端可用 service_role_key 访问全部数据
   - **触发器**：自动创建用户档案、自动更新 updated_at

### 二、获取 Supabase 密钥

从你服务器上 Supabase 的 `.env` 文件中获取以下值：

| 变量 | 来源 |
|------|------|
| `SUPABASE_URL` | Docker 内: `http://supabase-kong:8000`；本地开发: `http://<服务器IP>:8000` |
| `SUPABASE_ANON_KEY` | Supabase `.env` 中的 `ANON_KEY` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase `.env` 中的 `SERVICE_ROLE_KEY` |
| `SUPABASE_JWT_SECRET` | Supabase `.env` 中的 `JWT_SECRET` |

### 三、获取 Dify API 密钥

1. 打开 Dify 管理面板
2. 创建一个 **Chat 类型** 的应用（或使用已有应用）
3. 进入应用 → **访问 API** → 复制 API 密钥
4. API 地址通常为：
   - Docker 内: `http://dify-api:5001/v1`（需确认你的 Dify 容器服务名）
   - 本地开发: `http://<服务器IP>:<Dify端口>/v1`

### 四、本地开发

#### 后端

```bash
cd backend
cp .env.example .env      # 复制并填写环境变量
python -m venv venv        # 创建虚拟环境
source venv/bin/activate   # 激活虚拟环境
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8080 --reload
```

#### 前端

```bash
cd frontend
cp .env.example .env       # 复制并填写环境变量
npm install
npm run dev                # 启动 → http://localhost:5173
```

> 本地开发时，Vite 会自动将 `/api/*` 请求代理到 `localhost:8080`。

### 五、生产部署

1. **更新 Nginx 网关配置**：

   ```bash
   # 在腾讯云服务器上
   cp deploy/nginx/ideas.top.conf /opt/gateway/conf.d/ideas.top.conf
   docker exec global-gateway nginx -s reload
   ```

2. **构建并启动容器**：

   ```bash
   # 在项目目录
   cp backend/.env.example backend/.env   # 填写生产环境变量
   docker compose up -d --build
   ```

3. **自动部署**：推送到 GitHub `main` 分支会自动触发部署（需配置 GitHub Secrets）。

---

## 🔑 环境变量说明

### 后端 (`backend/.env`)

| 变量 | 说明 |
|------|------|
| `SUPABASE_URL` | Supabase Kong 网关地址 |
| `SUPABASE_ANON_KEY` | Supabase 匿名密钥 |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 服务端密钥 (有完全访问权限) |
| `SUPABASE_JWT_SECRET` | JWT 签名密钥 (用于验证前端传来的 token) |
| `DIFY_API_URL` | Dify API 地址 |
| `DIFY_API_KEY` | Dify 应用的 API 密钥 |
| `OPENCLAW_API_URL` | Openclaw API 地址 |
| `OPENCLAW_API_KEY` | Openclaw API 密钥 |
| `CORS_ORIGINS` | 允许的前端域名 (逗号分隔) |

### 前端 (`frontend/.env`)

| 变量 | 说明 |
|------|------|
| `VITE_SUPABASE_URL` | Supabase 地址 (浏览器可访问的公网地址) |
| `VITE_SUPABASE_ANON_KEY` | Supabase 匿名密钥 |
| `VITE_API_BASE_URL` | 后端 API 前缀 (本地开发留空，由 Vite proxy 处理) |

---

## 🗄️ 数据库设计

### 表结构

| 表名 | 用途 | 关键字段 |
|------|------|----------|
| `user_profiles` | 用户档案 (auth.users 扩展) | nickname, avatar_url, bio |
| `conversations` | 对话会话 | user_id, title, dify_conversation_id |
| `messages` | 消息记录 | conversation_id, role, content |

### RLS (行级安全) 策略

- 所有表都启用了 RLS
- **用户端**：只能访问自己的数据（通过 `auth.uid()` 校验）
- **服务端**：使用 `service_role_key` 可访问全部数据（后端使用）
- **消息表**：通过关联 `conversations` 表的 `user_id` 来校验权限

---

## 📡 API 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/health` | 健康检查 |
| `POST` | `/chat/conversations` | 创建新对话 |
| `GET` | `/chat/conversations` | 获取对话列表 |
| `DELETE` | `/chat/conversations/:id` | 删除对话 |
| `GET` | `/chat/conversations/:id/messages` | 获取消息列表 |
| `POST` | `/chat/conversations/:id/messages` | 发送消息 (SSE 流式返回 AI 回复) |
| `POST` | `/dify/workflow/run` | 执行 Dify 工作流 |

> 所有接口 (除 `/health`) 都需要在请求头附带 `Authorization: Bearer <supabase_jwt>`

---

## 🔄 数据流

```
1. 用户在前端登录 → Supabase Auth
2. 前端拿到 JWT → 存在内存中
3. 用户发送消息 → POST /api/chat/conversations/:id/messages
4. FastAPI 验证 JWT → 保存用户消息到 Supabase
5. FastAPI 调用 Dify Chat API (streaming)
6. Dify 流式返回 → FastAPI 转发 SSE → 前端实时显示
7. 流结束 → FastAPI 保存 AI 完整回复到 Supabase
8. Nocobase 可通过 DFW 查看 conversations & messages 表数据 (B端管控)
```

---

## 🏗️ 技术栈

| 层 | 技术 | 用途 |
|----|------|------|
| 前端 UI | HeroUI + TailwindCSS | 组件库 & 样式 |
| 前端框架 | React 18 + Vite | SPA 构建 |
| 3D 效果 | Three.js + R3F | 粒子背景动画 |
| 状态管理 | Zustand | 轻量级状态管理 |
| 路由 | React Router v7 | 客户端路由 |
| 后端框架 | FastAPI | 异步 API + SSE 流式 |
| 认证 | Supabase Auth | JWT 用户管理 |
| 数据库 | Supabase (PostgreSQL) | 数据存储 + RLS |
| AI 引擎 | Dify | 对话 & 工作流 |
| 消息通道 | Openclaw | 企微 & 飞书接入 |
| 部署 | Docker + Nginx | 容器化部署 |
| CI/CD | GitHub Actions | 自动部署 |

---

## ⚠️ 注意事项

1. **Supabase 端口**: 确保你的 Supabase Kong (8000) 对后端容器可达（通过 `gateway_net` 网络）
2. **Dify 网络**: 确保 Dify API 容器也加入了 `gateway_net` 网络，或后端容器能访问到它
3. **前端 Supabase URL**: 浏览器端需要公网可达的 Supabase 地址
4. **密钥安全**: `SERVICE_ROLE_KEY` 绝对不能暴露到前端代码中
5. **Nginx 配置**: `proxy_pass http://custom_backend/;` 末尾的 `/` 会去掉 `/api/` 前缀
