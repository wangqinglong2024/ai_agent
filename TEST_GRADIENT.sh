#!/bin/bash

# 渐变背景测试脚本
# 用于在浏览器中快速测试渐变背景

echo "================================"
echo "渐变背景测试指南"
echo "================================"
echo ""
echo "1. 打开浏览器访问: http://localhost:5173/login"
echo ""
echo "2. 按 F12 打开开发者工具"
echo ""
echo "3. 在 Console 中粘贴并运行以下代码："
echo ""
cat << 'EOF'
// 检查渐变元素
const meshGradient = document.querySelector('.mesh-gradient');
const blob1 = document.querySelector('.mesh-blob-1');
const blob2 = document.querySelector('.mesh-blob-2');
const blob3 = document.querySelector('.mesh-blob-3');

console.log('=== DOM 元素检查 ===');
console.log('✓ .mesh-gradient 存在:', !!meshGradient);
console.log('✓ .mesh-blob-1 存在:', !!blob1);
console.log('✓ .mesh-blob-2 存在:', !!blob2);
console.log('✓ .mesh-blob-3 存在:', !!blob3);

if (blob1) {
  const styles1 = window.getComputedStyle(blob1);
  console.log('\n=== .mesh-blob-1 样式 ===');
  console.log('background:', styles1.background);
  console.log('backgroundColor:', styles1.backgroundColor);
  console.log('opacity:', styles1.opacity);
  console.log('filter:', styles1.filter);
  console.log('width:', styles1.width);
  console.log('height:', styles1.height);
  console.log('position:', styles1.position);
  console.log('top:', styles1.top);
  console.log('right:', styles1.right);
  console.log('zIndex:', styles1.zIndex);
}

if (blob2) {
  const styles2 = window.getComputedStyle(blob2);
  console.log('\n=== .mesh-blob-2 样式 ===');
  console.log('backgroundColor:', styles2.backgroundColor);
  console.log('opacity:', styles2.opacity);
  console.log('filter:', styles2.filter);
  console.log('bottom:', styles2.bottom);
  console.log('left:', styles2.left);
}

if (blob3) {
  const styles3 = window.getComputedStyle(blob3);
  console.log('\n=== .mesh-blob-3 样式 ===');
  console.log('backgroundColor:', styles3.backgroundColor);
  console.log('opacity:', styles3.opacity);
  console.log('filter:', styles3.filter);
  console.log('bottom:', styles3.bottom);
  console.log('right:', styles3.right);
}

// 检查 CSS 变量
const root = document.documentElement;
const rootStyles = window.getComputedStyle(root);
console.log('\n=== CSS 变量 ===');
console.log('--mesh-color-1:', rootStyles.getPropertyValue('--mesh-color-1'));
console.log('--mesh-color-2:', rootStyles.getPropertyValue('--mesh-color-2'));
console.log('--mesh-color-3:', rootStyles.getPropertyValue('--mesh-color-3'));
console.log('--mesh-opacity-1:', rootStyles.getPropertyValue('--mesh-opacity-1'));
console.log('--mesh-opacity-2:', rootStyles.getPropertyValue('--mesh-opacity-2'));
console.log('--mesh-opacity-3:', rootStyles.getPropertyValue('--mesh-opacity-3'));

// 临时增加不透明度以便更明显（仅用于测试）
console.log('\n=== 临时增加不透明度测试 ===');
if (blob1) blob1.style.opacity = '0.9';
if (blob2) blob2.style.opacity = '0.8';
if (blob3) blob3.style.opacity = '0.7';
console.log('已临时增加所有 blob 的不透明度，如果现在能看到渐变，说明原始不透明度设置过低');

// 5秒后恢复
setTimeout(() => {
  if (blob1) blob1.style.opacity = '';
  if (blob2) blob2.style.opacity = '';
  if (blob3) blob3.style.opacity = '';
  console.log('已恢复原始不透明度');
}, 5000);
EOF

echo ""
echo "================================"
echo "4. 查看控制台输出结果"
echo ""
echo "5. 如果需要截图，运行："
echo "   document.body.style.backgroundColor = 'red'  // 测试背景是否被遮挡"
echo ""
echo "================================"
