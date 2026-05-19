# C03-01 AI 输出：可交互 HTML 原型

> **阶段**：C03·H 原型（按系统）
> **输入**：`C02(同系统)` + `B02(同系统样式包)`
> **落盘**：`C03-prototype/<system-id>/`

---

## 核心理念

**原型 = 不跑真实数据和接口的完整系统。** 所有弹框、新建编辑、表单联动、页面跳转、状态切换均模拟真实行为。

**页面与功能多对多**：一个页面可承载多个功能，一个功能可横跨多个页面。原型按系统形成闭环，功能目录仅做快捷导航。

---

## 目录结构

```
C03-prototype/
  index.html                                  # → 各系统入口
  <system-id>/
    index.html                                # 系统导航（→模块）
    _shared/
      proto-nav.html                          # 该系统原型导航栏
    <module-id>/
      index.html                              # 模块导航（→功能→页面跳转）
      <feature-id>/
        index.html                            # 功能导航（→关联页面链接）
    <page-id>.html                            # 原型页面（系统闭环互联）
```

**三层目录（系统/模块/功能）仅是快捷导航**，各级 index.html 提供跳转入口。

**原型页面**平铺在系统根目录，同系统所有页面自由互联，形成系统级闭环体验。

---

## 触发提示词

```
扮演"HTML 原型工程师"。
上游：C02(同系统) + B02(同系统样式包)。
按 /prompt/C-product/C03-01-AI输出-可交互HTML原型.md 输出。
本轮：系统「<system-id>」模块「<module-id>」功能「<feature-id>」。
落盘 C03-prototype/<system-id>/。
必须与同系统已有页面融合——所有页面可互相跳转、无死链。
引用 B02 的 prototype-style/（相对路径）。严禁引用后端实现。
```

---

## AI 必须遵守

1. **只读**：C02(同系统) + B02(同系统) + 同系统已有原型 + 本模板
2. **C/D 隔离**：严禁引用接口/表/字段/路由/SQL
3. **系统隔离**：不跨系统链接
4. **连通闭环**：同系统每个页面可通过导航或链接到达其他相关页面
5. **增量融合**：每轮增加页面，同时更新已有页面的导航和链接
6. **本地可运行**：`python -m http.server` 零依赖
7. **弹框不独立建页**：弹框/确认框/抽屉在当前页内实现

---

## 高保真交互标准

### 页面导航与返回
- 详情/表单页必须有 `← 返回`
- 新建/编辑页必须有"取消"返回来源列表

### 操作后跳转
- 表单提交成功 → 跳转结果页（300-600ms）
- 删除确认 → 弹框后 DOM 删除动画
- 保存草稿 → toast "已保存"

### 表单联动
- 选项变化后相关字段**立即响应**：显隐/更新选项/改变必填禁用
- 动态表单条件显隐必须实现
- 监听 `change`/`input`，纯 JS 操作 DOM

### 列表状态管理
- 删除：弹确认 → `row.remove()` + 更新统计
- 新增：返回列表顶部插入新行（`sessionStorage` 传标记）
- 状态切换：开关直接切换 DOM 状态标签
- 批量操作：checkbox 联动批量按钮可用状态

### 弹框与抽屉
- 当前页 `<dialog>` 或 `.modal` 实现
- 提交后关闭并更新当前页（DOM 原地更新）
- 遮罩点击关闭
- **禁止为弹框建独立 HTML**

### 搜索/筛选/分页
- 筛选变化后列表即时更新（JS 过滤 DOM display）
- 分页按钮切换（纯 DOM 显隐）

### 标签页/步骤条
- Tabs 切换激活+显示对应内容
- Stepper 上/下一步控制步骤

### 通知与反馈
- Toast：操作后右上角 2-3s 消失
- 内联错误：字段下方红色文案（不用 alert）
- 骨架屏：首次加载 300ms

### 示例数据
- 静态 DOM，不发网络请求
- 列表 ≥5 条，字段完整
- `sessionStorage` 跨页传递操作标记

---

## 弹框 vs 跳页

| 场景 | 方式 |
|------|------|
| 新建/全字段编辑/信息量大详情 | **跳页** |
| 快捷编辑(1-3 字段)/删除确认/提交确认/上传/选择关联 | **弹框** |

---

## 每轮增量步骤

1. 输出功能→页面映射表
2. 生成新页面（系统根目录）
3. 更新 `_shared/proto-nav.html` 加入新项
4. 更新已有页面出站链接（按 C02 流程图）
5. 更新导航目录页（功能→模块→系统→总览）
6. 输出连通性验证报告

---

## 样式引用

样式包位于 `docs/<system-id>/B02-experience-design/prototype-style/`。

页面（`C03-prototype/<system-id>/<page-id>.html`）引用路径：

```html
<link rel="stylesheet" href="../../docs/<system-id>/B02-experience-design/prototype-style/app.css">
<script src="../../docs/<system-id>/B02-experience-design/prototype-style/app.js"></script>
```

> 绝不拷贝样式文件。`<system-id>` 替换为实际系统 ID。

---

## 页面跳转规范

所有跳转用**相对路径**：

```html
<!-- 同系统页面 -->
<a href="P-app-course-002.html">查看详情</a>
<!-- 返回上一页 -->
<button onclick="history.back()">← 返回</button>
<!-- 原型导航 -->
<a href="auth/account-entry/index.html" class="btn btn--primary btn--sm">原型导航</a>
```

---

## 单页 HTML 模板

```html
<!DOCTYPE html>
<html lang="zh-CN" data-mode="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="page-id" content="P-app-course-001">
  <meta name="system-id" content="app">
  <meta name="module-id" content="course">
  <meta name="feature-id" content="learning">
  <meta name="related-r-ids" content="R-course-001,R-course-002">
  <title>课程列表 · app 原型</title>

  <link rel="stylesheet" href="../../docs/app/B02-experience-design/prototype-style/app.css">
  <style>
    .modal-overlay { display:none; position:fixed; inset:0; background:rgba(0,0,0,.45); z-index:100; align-items:center; justify-content:center; }
    .modal-overlay.is-open { display:flex; }
  </style>
</head>
<body>
  <div id="proto-nav-bar"></div>
  <main style="flex:1;padding:var(--space-5)">
    <!-- 按 C02 04-pages.md 区块清单组织 -->
  </main>
  <div class="modal-overlay" id="modal-delete" role="dialog" aria-modal="true"></div>

  <script src="../../docs/app/B02-experience-design/prototype-style/app.js"></script>
  <script>
    fetch('_shared/proto-nav.html')
      .then(r => r.text())
      .then(html => {
        document.getElementById('proto-nav-bar').innerHTML = html;
        const pid = document.querySelector('meta[name="page-id"]').content;
        const cur = document.querySelector('#proto-nav-bar [data-page="' + pid + '"]');
        if (cur) cur.classList.add('nav-active');
      });

    const ProtoModal = {
      open(id) { document.getElementById(id).classList.add('is-open'); },
      close(id) { document.getElementById(id).classList.remove('is-open'); }
    };
    document.querySelectorAll('.modal-overlay').forEach(o => {
      o.addEventListener('click', e => { if (e.target === o) o.classList.remove('is-open'); });
    });

    const ProtoToast = {
      show(msg, type='success') {
        const el = document.createElement('div');
        el.textContent = msg;
        Object.assign(el.style, {
          position:'fixed',top:'16px',right:'16px',zIndex:'9999',
          padding:'8px 16px',borderRadius:'6px',color:'#fff',fontSize:'14px',
          background: type==='success' ? 'var(--color-success,#18a058)' : 'var(--color-danger,#d03050)',
          boxShadow:'0 2px 8px rgba(0,0,0,.18)',transition:'opacity .3s'
        });
        document.body.appendChild(el);
        setTimeout(() => { el.style.opacity='0'; setTimeout(() => el.remove(),300); },2200);
      }
    };

    if (typeof proto !== 'undefined') proto.bootstrap();
  </script>
</body>
</html>
```

---

## `_shared/proto-nav.html`

```html
<nav class="topnav" role="navigation" aria-label="原型导航"
  style="display:flex;align-items:center;gap:var(--space-3);padding:0 var(--space-4);height:56px;position:sticky;top:0;z-index:50">
  <ul style="display:flex;gap:var(--space-2);list-style:none;margin:0;padding:0;flex:1">
    <li><a href="P-app-auth-001.html" data-page="P-app-auth-001" class="nav-link">登录</a></li>
  </ul>
  <div style="display:flex;align-items:center;gap:var(--space-2)">
    <button data-action="toggle-theme" class="btn btn--ghost btn--sm">明/暗</button>
    <a href="index.html" class="btn btn--primary btn--sm">原型导航</a>
  </div>
</nav>
```

> 页面平铺在系统根目录，所有链接均为同级相对路径（如 `P-app-auth-001.html`）。

---

## 目录页规范

- **项目总览 `index.html`**：卡片列出所有系统
- **系统导航 `<system>/index.html`**：卡片列出所有模块，头部有 `← 项目总览`
- **模块导航 `<system>/<module>/index.html`**：列出该模块所有功能入口页面链接
- **功能导航 `<system>/<module>/<feature>/index.html`**：列出该功能关联的所有页面链接

---

## 连通性验证报告（每轮必输出）

```markdown
## 连通性验证 · 第 N 轮 · 系统「<system-id>」· 功能「<feature-id>」

### 功能→页面映射
| 功能 | 页面文件 | 类型 | 弹框列表 |

### 页面清单
| page-id | 路径 | 状态(已有/新增) |

### 链接矩阵
| 从 | 到 | 链接方式 | 状态 |

### 检查
- [ ] 所有 href 目标存在？
- [ ] 从系统 index 能到所有页面？
- [ ] 每个演示页有导航栏？每个表单/详情页有返回？
- [ ] 无跨系统链接？

### 死链：0 / 孤岛：0
```

---

## 硬约束

1. 系统闭环：同系统所有页面形成完整可交互体验
2. 系统隔离：不同系统互不链接
3. 本地运行：`python -m http.server`，零依赖
4. 样式单源：相对路径引用 B02 prototype-style/，不拷贝
5. CSS 变量：不硬编码 hex/px
6. 无网络请求：静态 DOM + sessionStorage
7. 响应式：375/768/1280 三档无破
8. a11y：焦点环、label for、语义标签
9. 高保真：删除消失、表单联动、动态显隐、弹框当前页——必须实现
10. 弹框不独立建页，新建/编辑必须跳页
11. 增量不破坏
12. 单文件<=1200 行

---

## 质量自检

- [ ] 页面在 `C03-prototype/<system-id>/<page-id>.html`？
- [ ] 导航目录（系统/模块/功能 index.html）均已更新？
- [ ] 列表搜索/筛选即时？删除后 DOM 消失？
- [ ] 表单返回/取消？提交后跳转？动态字段联动？
- [ ] 弹框当前页实现？遮罩关闭？Toast 反馈？
- [ ] 连通性报告已输出？死链=0？孤岛=0？
- [ ] 相对路径引用 B02？无 hex/px 硬编码？
- [ ] 375 无横滚？焦点环？label for？
- [ ] 无接口名/SQL/表名/字段名？
- [ ] 页面 ID 带 system 前缀？单文件<=1200 行？
