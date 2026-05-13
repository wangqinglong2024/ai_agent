<!-- TARGET-PATH: design/01-ux/05-moodboard.md -->

# Moodboard（设计语言原料）

> 这是 S 阶段（`design/02-design-system/`）的输入。S 阶段在这上面定具体 token。

---

## 一、关键词（10 个，每个有可验证含义 + 反例）

| 形容词 | 可验证含义（量化或可观察） | 反例（这就不是它） |
|-------|--------------------------|--------------------|
| 沉静 | 主色明度 L ≤ 30%；正文行高 1.65；动效 ≤ 250ms | Material 高对比 ripple |
| 温润 | 背景渐变含 ≥30% 暖米色；正文字色 `#1F1A14` 暖墨而非 `#000` | 纯白 `#FFF` + 纯黑 `#000` 极端组合 |
| 釉光 | 玻璃面板顶 `inset 0 1px 0 rgba(255,250,235,.65)`；卡片 `clearcoat` 感 | 完全无高光的纯哑光 flat |
| 留白克制 | 卡 padding 22~24px；表格行高 44px；不大量"高级感"留白 | Apple 官网产品页那种半屏巨标 |
| 庄重 | H1 衬线 32~42px；letter-spacing 1.5~2px；不用 emoji | 圆体 / Comic Sans / 卡通插画 |
| 气韵 | Three.js 流体波浪（仅门面）；过渡缓动 `cubic-bezier(.2,0,0,1)` | 线性动画 / 弹跳缓动 |
| 锋利 | 朱砂激活下划线 2px；焦点环 4px 青花；按钮 12px 圆角不做胶囊 | 圆角 999px 大胶囊全场 |
| 高密度 | 表格 ≤ 36px 行高（紧凑模式）；表单字段间距 16px | 一屏只放 3 个字段的引导式 |
| 真诚 | 错误"给下一步"；空态"给路径" | "Oops 出错啦~" |
| 一致 | 全部颜色走 token；按钮随 `data-accent` 同步切换 | 单页面 hex 硬编码 + 孤岛色 |

---

## 二、主色族倾向

### 2.1 默认主色：**宋瓷墨青 ink**（HSL ≈ 212, 53%, 23%）

10 阶色阶（参见 `design/02-design-system/01-tokens.md`）：

| 阶 | HEX | 用途 |
|----|-----|------|
| 50 | `#F1F5F9` | 极浅辅助 |
| 100 | `#E4ECF3` | hover bg |
| 200 | `#CFDDE8` | 月白 / tag 底 |
| 300 | `#A8C0D4` | 浅瓷 / 边框 |
| 400 | `#7A9CBE` | 烟蓝 / hover |
| 500 | `#4A7AA8` | 远山 / 辅助按钮 |
| 600 | `#2E5C8A` | 青花 / 链接 / info / 焦点环 |
| **700** | **`#1B3A5C`** | **品牌锚定 · 默认主色** |
| 800 | `#14304F` | TopBar 底 |
| 900 | `#0E1F38` | 墨夜 / 文字最深 |

### 2.2 候选主题色族（5 套，运行时切换）

通过 `<html data-accent="ink|cinnabar|jade|gold|graphite">` 切换：

| accent | 中文 | 锚定 hex | 适用场景 |
|--------|------|---------|---------|
| `ink`（默认） | 墨青 | `#1B3A5C` | 通用 / 严肃后台 |
| `cinnabar` | 朱砂 | `#B14545` | 强警示 / 红色品牌项目 |
| `jade` | 翠玉 | `#4A6F5A` | 健康 / 农业 / 教育 |
| `gold` | 鎏金 | `#B8923A` | 金融 / 奢品 / 颁奖 |
| `graphite` | 古墨 | `#3A332A` | 极简 / 文化 / 出版 |

每套都提供完整 50~900 阶。切换 accent 时：链接、主按钮、焦点环、激活下划线、tag 默认色、加载条 全部跟随；中性灰 / 背景渐变 / 玻璃 / 状态色（成功/警告/错误/信息）**保持不变**（保证语义稳定）。

---

## 三、中性色族

- **暖偏**（核心选择）：基于 `#1F1A14` 古墨黑 → `#F2EBD7` 浅米的暖墨灰阶。
- 禁用纯灰 `#888 / #999`；禁用纯黑 `#000`。
- 暗色模式镜像：`#0E1F38` 墨夜 → `#3F4554` 雾灰。

---

## 四、字体族

| 角色 | CSS 变量 | 字体栈 |
|------|---------|-------|
| 行楷书法 | `--font-brush` | `"Ma Shan Zheng", "Long Cang", "STKaiti", "KaiTi", cursive` |
| 衬线书法 | `--font-display` | `"ZCOOL XiaoWei", "Noto Serif SC", "Source Han Serif SC", "Songti SC", serif` |
| 无衬线 UI | `--font-sans` | `"Noto Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", system-ui, sans-serif` |
| 等宽 | `--font-mono` | `"JetBrains Mono", "SFMono-Regular", Menlo, Consolas, monospace` |
| 数字 | 全局 `font-variant-numeric: tabular-nums`，西文/数字 fallback 走 `--font-sans` |

字体许可：Google Fonts CN 在线 CDN（默认） / 自托管（需要审计时切换 `--font-loader: self-hosted`）。

---

## 五、圆角语言

| 控件类 | 圆角 | 备注 |
|--------|------|------|
| 按钮 / 输入 / Tag / Chip | 12px (`--radius-md`) | 不做胶囊 |
| 卡片 / 玻璃面板 | 18~26px (`--radius-lg / xl`) | 玻璃必带 |
| 模态 / 抽屉 | 26~34px (`--radius-xl / 2xl`) | 移动端 Bottom Sheet 顶 24px |
| 印鉴 / 角标 | 6px / 4px | 朱砂方印感 |
| 全圆胶囊 | `--radius-pill: 999px` | 仅 progress 条 / Avatar |

---

## 六、阴影语言

3 档 + 玻璃专用：

```
--shadow-1: 0 1px 2px rgba(14,31,56,0.06);
--shadow-2: 0 6px 18px rgba(14,31,56,0.10);
--shadow-3: 0 16px 40px rgba(14,31,56,0.16);
--glass-shadow:    0 14px 38px rgba(14,31,56,0.14), inset 0 1px 0 rgba(255,250,235,0.65);
--glass-shadow-lg: 0 24px 56px rgba(14,31,56,0.20), inset 0 1px 0 rgba(255,250,235,0.70);
```

> 暗色模式下投影颜色不变（仍偏墨青），强度 ×0.6。

---

## 七、密度

| 区域 | 默认 | 紧凑 | 适老 |
|------|------|------|------|
| 表格行高 | 44px | 36px | 64px |
| 表单输入 | 44px | 36px | 64px |
| 按钮高度 | 44px | 34px | 64px |
| 卡片 padding | 22×24 | 16×18 | 28×32 |
| 字号正文 | 17px | 15px | 22px |

切换：`<html data-density="default|compact|elder">`。

---

## 八、动效

- 时长：`--motion-fast: 120ms` / `--motion-base: 200ms` / `--motion-slow: 300ms`（不再有更长）
- 缓动：统一 `cubic-bezier(.2,0,0,1)`
- 进入：`opacity 0→1` + `translateY(4px → 0)`（≤ 200ms）
- 退出：`opacity 1→0`（≤ 120ms）
- 禁止：bounce / elastic / 视差 / 旋转入场
- 关闭：`@media (prefers-reduced-motion: reduce)` 下全部置零

---

## 九、暗黑模式策略

| 维度 | 亮色 | 暗色 |
|------|------|------|
| 触发 | `<html data-mode="light">`（默认） | `<html data-mode="dark">` 或跟随系统 |
| 页面背景 | 宣纸米底渐变 | 墨夜渐变 `#0B1626 → #14304F → #0E1F38` |
| 主表面 | 暖白玻璃 `rgba(255,251,240,.55)` | 墨青玻璃 `rgba(20,48,79,.55)` |
| 描边 | 暖白 `rgba(255,250,235,.78)` | 月白 `rgba(168,192,212,.22)` |
| 正文 | `#1F1A14` 暖墨 | `#F2EBD7` 浅米 |
| 辅助文字 | `#6F6452` | `#A8C0D4` |
| 主品牌色 | 用 `--accent-700`（如墨青 `#1B3A5C`） | 用 `--accent-400`（如烟蓝 `#7A9CBE`），暗底上提亮一档保对比 |
| 状态色 | 翠玉 `#4A6F5A` 等 | 翠玉提亮到 `#6E9882` 等（同时保持色相） |
| 投影 | 偏墨青 | 偏墨夜，强度 ×0.6 |
| 焦点环 | `rgba(46,92,138,.18)` | `rgba(168,192,212,.28)` |

详细映射在 `design/02-design-system/07-responsive-dark.md`。

---

## 十、装饰元素白名单

| 元素 | 用途 | 禁用区 |
|------|------|--------|
| 朱砂印鉴 `.seal` | 已审定 / 签名 / 水印 | 业务卡批量重复使用 |
| 鎏金边框 | AI 免责声明 / 颁奖 | 普通卡 |
| 翠玉 tag | 成功 / 通过 | 普通中性标签 |
| 回字纹分隔 `.divider-cn` | 区块分隔 | 同区内多次 |
| Three.js 流体 | 登录 / 欢迎 / Hero / 空 / 错误 | 业务列表 / 表单 |
| 远山剪影 `.ink-mountains` | 门面页底 | 业务页 |
