# ==============================================================================
# 前端 Dockerfile (多阶段构建)
# ==============================================================================

# --- 依赖安装 / 开发阶段 ---
FROM node:20-alpine AS dev

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# --- 构建阶段 ---
FROM dev AS build

RUN npm run build

# --- 生产阶段 (Nginx 托管) ---
FROM nginx:alpine AS production

# 复制自定义 Nginx 配置 (SPA 路由)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 复制构建产物
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
