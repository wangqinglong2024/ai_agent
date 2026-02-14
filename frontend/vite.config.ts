import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // hls.js 包的 ESM 入口文件缺失，指向 CJS 入口
      "hls.js": "hls.js/dist/hls.js",
    },
  },
  server: {
    port: 5173,
    // 本地开发时，将 /api 请求代理到后端
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
