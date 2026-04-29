(async () => {
  try {
    const src = chrome.runtime.getURL('assets/content.js');
    await import(src);
    console.log('⚓ Page Anchor Pro: Content script module loaded');
  } catch (e) {
    console.error('❌ Page Anchor Pro: Failed to load content script module', e);
  }
})();
