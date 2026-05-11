<!-- TARGET-PATH: design/02-design-system/06-interactions.md -->

# 通用交互

---

## 一、焦点系统

```css
:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}
```

- 所有可聚焦元素（button / input / link / role="*"）必须应用
- Tab 顺序按 DOM 顺序，禁用 `tabindex > 0`
- 装饰性元素禁止 `tabindex="0"`

---

## 二、键盘快捷键全局表

| 快捷键 | 行为 | 适用范围 |
|--------|------|---------|
| `Cmd/Ctrl + K` | 打开命令面板 | 全局 |
| `Cmd/Ctrl + S` | 保存当前表单 | 表单页（拦截浏览器默认） |
| `Cmd/Ctrl + Enter` | 提交表单 | 表单页 |
| `Esc` | 关闭最顶层 Modal / Drawer / Popover | 全局 |
| `?` | 打开快捷键帮助 | 全局 |
| `g h` | 回到首页（Linear 风格） | 全局（需登录） |
| `↑ ↓` | 列表 / 表格行 / Dropdown 项移动 | 局部 |
| `Enter` | 触发当前焦点项 | 局部 |
| `Space` | 切换 Checkbox / Switch / Toggle | 局部 |

---

## 三、复制 / 粘贴 / 长按 / 拖拽

| 行为 | 规则 |
|------|------|
| 复制 ID / 链接 | IconButton + Tooltip "已复制"；操作完 Toast 反馈 |
| 表格批量复制 | 选中后 `Cmd+C` 复制为 TSV |
| 拖拽排序 | 必须有 6×8 拖拽手柄；拖拽时行 `var(--glass-tint)` + 阴影 |
| 拖拽上传 | 见 02-forms FileUpload |
| 长按（移动） | 触发 ActionSheet（移动 Bottom Sheet 形式的 Dropdown） |

---

## 四、表格行选中与批量操作

- Checkbox 在第 1 列；
- 选中 ≥ 1 后表头工具栏切换为"已选 N · 取消选中 · 批量..."
- Shift + Click 范围选择
- 切换页 / 重载数据：选中状态保留（但失败选项显示 Toast 提示）

---

## 五、防抖与节流

| 场景 | 策略 |
|------|------|
| 搜索输入 | debounce 300ms |
| 窗口 resize | throttle 100ms（rAF） |
| 滚动监听 | throttle 100ms（rAF） |
| 表单提交按钮 | 提交瞬间置 disabled + loading，防双提交 |

---

## 六、二次确认 / 离开保护

- 所有不可逆操作（删除 / 撤销 / 解绑）必须二次确认（Modal 或 Popover）
- 未保存的表单导航离开必须 `beforeunload` + 内部路由拦截弹 Modal："离开此页？未保存的修改将丢失。[留下] [离开]"
- 关闭未保存的 Modal / Drawer 同样拦截

---

## 七、刷新与并发

- 数据更新乐观（先反馈 + 后端确认）；失败时 Toast danger + 状态回滚
- 多人并发编辑：保存时 412 冲突 → Modal "其他人已修改此记录，请刷新后重试"
- 列表数据后台变更：顶部 Banner "数据有更新，[点击刷新]"，不自动覆盖用户视图

---

## 八、滚动恢复

- 路由后退：恢复滚动位置
- 路由前进 / 新页：滚动到顶
- 长列表分页加载：保持滚动位置不跳

---

## 九、错误边界

- 任何组件 throw 都被 ErrorBoundary 捕获，渲染"该模块暂时无法显示"+ 重试按钮
- 不允许整页白屏；至少保留 TopBar 与"返回首页"路径

---

## 十、超时

- 接口超时 15s 默认 → 切 Loading → Toast "请求超时，请重试"
- 长任务（导出 / 训练）必须有 ProgressBar 或可关闭的"在后台运行"提示
