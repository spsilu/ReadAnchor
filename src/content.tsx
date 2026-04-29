import React from 'react';
import { createRoot } from 'react-dom/client';
import AnchorSidebar from './components/AnchorSidebar';
import './index.css';

// 注入日志便于调试
console.log('⚓ Page Anchor Pro: Content script loading...');

const init = () => {
  // 防止重复创建
  if (document.getElementById('chrome-page-anchor-root')) {
    return;
  }

  try {
    const rootContainer = document.createElement('div');
    rootContainer.id = 'chrome-page-anchor-root';
    // 容器设为全屏透明，防止子元素由于父元素 0x0 而被遮挡或计算错误
    rootContainer.style.cssText = 'position:fixed; top:0; right:0; width:100vw; height:100vh; z-index:2147483647; pointer-events:none;';
    document.body.appendChild(rootContainer);

    const shadow = rootContainer.attachShadow({ mode: 'open' });
    const shadowRoot = document.createElement('div');
    shadowRoot.id = 'shadow-root';
    shadowRoot.style.cssText = 'width: 100%; height: 100%; pointer-events: none;';
    shadow.appendChild(shadowRoot);

    // 动态加载样式
    const injectStyles = () => {
      // 在生产环境中，Vite 会生成这些可能的样式文件名
      const stylePaths = ['assets/content.css', 'assets/index.css', 'assets/style.css'];
      stylePaths.forEach(path => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = chrome.runtime.getURL(path);
        shadow.appendChild(link);
      });
    };
    
    injectStyles();

    createRoot(shadowRoot).render(
      <React.StrictMode>
        <AnchorSidebar />
      </React.StrictMode>
    );
    
    console.log('✅ Page Anchor Pro: Initialized successfully');
  } catch (e) {
    console.error('❌ Page Anchor Pro: Initialization failed', e);
  }
};

// 确保在页面加载后执行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// 针对部分动态加载的页面，额外延迟重试一次
setTimeout(init, 1500);
