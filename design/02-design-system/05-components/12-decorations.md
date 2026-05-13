<!-- TARGET-PATH: design/02-design-system/05-components/12-decorations.md -->

# 装饰组件：Seal / DividerCN / AIDisclaimer / FluidCanvas

> 装饰组件**节制使用**。每条都列了禁用区。

---

## Seal（朱砂印鉴）

```html
<span class="seal" aria-hidden="true">章</span>     <!-- 44×44 -->
<span class="seal seal-sm" aria-hidden="true">审</span> <!-- 28×28 -->
```

- 颜色：`var(--color-danger-500)` 朱砂 + 暖白字 + `inset 0 0 0 2px rgba(255,250,235,.35)`
- 字体：`var(--font-brush)` 行楷
- 旋转：-3° ~ -6°（手钤效果）
- 用途：登录页右下角 / 个人签名区 / 已审定卡角标 / 导出报告水印
- 禁用区：业务卡批量重复出现 / 按钮内 / TopBar / 列表项每行一个

---

## DividerCN（回字纹文字分隔）

```html
<div class="divider-cn">分　节</div>
```

- 两端 1px 渐变细线 → 中间 4 字标题（`--font-display` letter-spacing 6px brand-600）
- 用于：长内容大段分隔
- 禁用区：单个段落内反复出现

---

## AIDisclaimer

任何 AI 生成内容下方必带：

```html
<aside class="ai-disclaimer">
  <span aria-label="AI">AI</span>
  本内容由 AI 辅助生成，请人工复核后采用。
</aside>
```

- 鎏金边框 `1px solid rgba(184,146,58,.32)` + 鎏金字 `#6B5022`
- `var(--radius-md)`，padding 10×14，字号 13

---

## FluidCanvas（Three.js 流体背景）

```html
<div class="fluid-canvas-wrap"><canvas></canvas></div>
<script>qsds.initFluid();</script>
```

### 允许的页面

| 页面 | 强度 |
|------|------|
| 登录 / 欢迎 | 强（满屏） |
| Hero（仪表盘顶 30vh） | 中 |
| 错误页 404 / 500 | 弱 |
| 空状态 | 弱（局部） |

### 铁律

1. **严禁具象几何**：无正方体 / 球 / 圆柱 / 线框
2. **严禁尖锐边角**：Plane 必须 ≥ 96×64 细分
3. **严禁高对比闪光**：亮度 < 0.9，无频闪
4. **必须可关**：`prefers-reduced-motion: reduce` 时直接 return
5. **FPS ≤ 30** + 同屏 ≤ 1 个
6. **业务页默认不挂**

### 配置

```js
qsds.mountFluid(canvasEl, {
  baseColor: 'var(--color-brand-700)',  // 跟随当前 accent
  accent1:   'var(--color-brand-500)',
  accent2:   'var(--color-warning-500)' // 鎏金尾迹（固定）
});
```

> 注：实际实现里 CSS 变量需在 JS 中读取后转为 hex 数字传给 THREE。详见 `design/03-prototype-style/app.js`。

### 顶点位移公式（连绵正余弦）

```
z = sin(x*0.42 + t) * cos(y*0.38 + t*0.9) * 1.7
  + sin(x*0.18 - t*0.6) * 0.85
  + cos(y*0.22 + t*0.5) * 0.55
```

### 材质（青花瓷釉光）

```js
new THREE.MeshPhysicalMaterial({
  metalness: 0.65, roughness: 0.22,
  transmission: 0.85, ior: 1.45,
  transparent: true, opacity: 0.88,
  clearcoat: 0.6, clearcoatRoughness: 0.3,
  side: THREE.DoubleSide,
});
```

---

## InkMountains（远山剪影 · 可选）

底部水墨远山 SVG，仅门面页适用。提供 `<svg class="ink-mountains" />` 内联 SVG。

---

## 整体禁用清单

- ❌ 卷轴杆边框
- ❌ 大幅毛笔水墨字背景
- ❌ 印章图作 logo
- ❌ 楷草隶大字铺底
- ❌ 飘浮灯笼（节庆例外，需主理人单独审批）
- ❌ 3D 旋转 logo / 字体动效装饰
