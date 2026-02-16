import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

async function testLoginPageDecorations() {
  console.log('开始测试登录页装饰块随机化...\n');
  
  const browser = await chromium.launch({ headless: true });
  const results = [];
  
  for (let i = 1; i <= 3; i++) {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 }
    });
    const page = await context.newPage();
    
    console.log(`第 ${i} 次访问登录页...`);
    await page.goto('http://localhost:5175/login');
    await page.waitForTimeout(2000); // 等待动画加载
    
    // 截图
    const screenshotPath = `/opt/projects/ai_agent/screenshot-login-${i}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`截图已保存: screenshot-login-${i}.png`);
    
    // 获取装饰块的信息
    const decors = await page.evaluate(() => {
      const decorElements = document.querySelectorAll('.glass-decor');
      return Array.from(decorElements).map(el => ({
        width: el.style.width,
        height: el.style.height,
        top: el.style.top,
        left: el.style.left,
        delay: el.style.animationDelay,
      }));
    });
    
    results.push({
      attempt: i,
      decorCount: decors.length,
      decors: decors,
    });
    
    console.log(`  装饰块数量: ${decors.length}`);
    console.log(`  装饰块信息:`, decors);
    console.log('');
    
    await context.close();
  }
  
  await browser.close();
  
  // 检查随机性
  console.log('分析随机化结果:');
  const allSame = results.every((r, i) => 
    i === 0 || JSON.stringify(r.decors) === JSON.stringify(results[0].decors)
  );
  
  if (allSame) {
    console.log('❌ 装饰块位置和大小在所有刷新中都相同 - 随机化可能失败');
  } else {
    console.log('✅ 装饰块在每次刷新时都不同 - 随机化工作正常');
  }
  
  // 检查是否避开中心区域
  const allAvoidsCenter = results.every(r => 
    r.decors.every(d => {
      const top = parseFloat(d.top);
      const left = parseFloat(d.left);
      // 中心区域约为 20-80% (top) 和 25-75% (left)
      const inCenterZone = (top > 20 && top < 80 && left > 25 && left < 75);
      return !inCenterZone;
    })
  );
  
  if (allAvoidsCenter) {
    console.log('✅ 所有装饰块都避开了中心登录卡片区域');
  } else {
    console.log('⚠️ 部分装饰块可能遮挡了中心区域');
  }
  
  return results;
}

async function testChatSidebarToggle() {
  console.log('\n\n开始测试对话页折叠按钮...\n');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();
  
  console.log('访问登录页并登录...');
  await page.goto('http://localhost:5175/login');
  await page.waitForTimeout(1000);
  
  // 填写登录表单
  await page.fill('input[type="text"]', 'admin@ideas.top');
  await page.fill('input[type="password"]', 'test123');
  
  // 截图登录前
  await page.screenshot({ path: '/opt/projects/ai_agent/screenshot-before-login.png' });
  console.log('截图已保存: screenshot-before-login.png');
  
  // 点击登录按钮
  await page.click('button:has-text("登 录")');
  await page.waitForTimeout(3000); // 等待登录和跳转
  
  console.log('进入对话页面...');
  // 截图对话页初始状态
  await page.screenshot({ path: '/opt/projects/ai_agent/screenshot-chat-initial.png' });
  console.log('截图已保存: screenshot-chat-initial.png');
  
  // 检查左上角折叠按钮
  const toggleButton = await page.locator('button[aria-label*="侧边栏"]').first();
  const isVisible = await toggleButton.isVisible();
  
  if (isVisible) {
    console.log('✅ 找到了折叠按钮');
    
    // 检查侧边栏初始状态
    const sidebar = await page.locator('aside[aria-label="对话侧边栏"]');
    const sidebarVisible = await sidebar.isVisible();
    console.log(`侧边栏初始状态: ${sidebarVisible ? '显示' : '隐藏'}`);
    
    // 点击折叠按钮
    console.log('点击折叠按钮...');
    await toggleButton.click();
    await page.waitForTimeout(500);
    
    // 截图折叠后
    await page.screenshot({ path: '/opt/projects/ai_agent/screenshot-chat-collapsed.png' });
    console.log('截图已保存: screenshot-chat-collapsed.png');
    
    // 检查侧边栏是否隐藏
    const sidebarAfterToggle = await sidebar.isVisible();
    if (!sidebarAfterToggle) {
      console.log('✅ 侧边栏已隐藏');
    } else {
      console.log('❌ 侧边栏仍然显示');
    }
    
    // 再次点击展开
    console.log('再次点击折叠按钮...');
    await toggleButton.click();
    await page.waitForTimeout(500);
    
    // 截图展开后
    await page.screenshot({ path: '/opt/projects/ai_agent/screenshot-chat-expanded.png' });
    console.log('截图已保存: screenshot-chat-expanded.png');
    
    // 检查侧边栏是否显示
    const sidebarAfterSecondToggle = await sidebar.isVisible();
    if (sidebarAfterSecondToggle) {
      console.log('✅ 侧边栏已重新显示');
    } else {
      console.log('❌ 侧边栏仍然隐藏');
    }
    
  } else {
    console.log('❌ 未找到折叠按钮');
  }
  
  await browser.close();
}

async function main() {
  try {
    await testLoginPageDecorations();
    await testChatSidebarToggle();
    console.log('\n测试完成!');
  } catch (error) {
    console.error('测试出错:', error);
    process.exit(1);
  }
}

main();
