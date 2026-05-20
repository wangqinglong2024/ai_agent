/**
 * 页脚组件
 * 扶爻科技品牌信息与导航
 */

import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 mt-auto">
      <div className="glass border-t border-b-0 border-l-0 border-r-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 品牌信息 */}
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-sky-500 flex items-center justify-center text-white font-bold text-sm transition-transform duration-300 group-hover:scale-110">
                  FY
                </div>
                <span className="text-lg font-bold text-gradient">扶爻科技</span>
              </Link>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                赋能个体与企业，以自然语言重塑数字生产力。专注 AIPM 培训、超级个体赋能与企业 AI 战略咨询。
              </p>
            </div>

            {/* 快速链接 */}
            <div className="space-y-4">
              <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>
                快速链接
              </h3>
              <div className="flex flex-col gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                <Link to="/courses" className="hover:text-cyan-500 transition-colors duration-300">课程中心</Link>
                <Link to="/services" className="hover:text-cyan-500 transition-colors duration-300">核心服务</Link>
                <Link to="/technology" className="hover:text-cyan-500 transition-colors duration-300">MCP 技术</Link>
                <Link to="/about" className="hover:text-cyan-500 transition-colors duration-300">关于扶爻</Link>
                <Link to="/contact" className="hover:text-cyan-500 transition-colors duration-300">联系我们</Link>
              </div>
            </div>

            {/* 联系方式 */}
            <div className="space-y-4">
              <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>
                联系方式
              </h3>
              <div className="flex flex-col gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-cyan-500" />
                  <a href="mailto:contact@foryoutech.top" className="hover:text-cyan-500 transition-colors duration-300">contact@foryoutech.top</a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-cyan-500" />
                  <span>上海市</span>
                </div>
              </div>
            </div>
          </div>

          {/* 版权信息 */}
          <div
            className="mt-10 pt-6 text-center text-xs"
            style={{
              borderTop: "1px solid var(--glass-border)",
              color: "var(--text-muted)",
            }}
          >
            © {currentYear} 扶爻（上海）科技有限公司 ForyouTech Co., Ltd. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
