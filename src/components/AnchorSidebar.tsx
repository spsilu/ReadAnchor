import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bookmark, Plus, X, ChevronRight, ChevronLeft, ArrowUpCircle } from 'lucide-react';

interface Anchor {
  id: string;
  position: number;
  text: string;
  timestamp: number;
}

const AnchorSidebar = () => {
  const [anchors, setAnchors] = useState<Anchor[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Use current URL as key to make anchors site-specific
  const storageKey = `page-anchors-${window.location.host}${window.location.pathname}`;

  useEffect(() => {
    // 优先使用 chrome.storage.local (插件环境)
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get([storageKey], (result) => {
        if (result[storageKey]) {
          setAnchors(result[storageKey]);
        }
      });
    } else {
      // 预览环境回退到 localStorage
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setAnchors(JSON.parse(saved));
      }
    }
  }, [storageKey]);

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ [storageKey]: anchors });
    } else {
      localStorage.setItem(storageKey, JSON.stringify(anchors));
    }
  }, [anchors, storageKey]);

  const addAnchor = () => {
    const currentScroll = window.scrollY;
    const newAnchor: Anchor = {
      id: Math.random().toString(36).substring(7),
      position: currentScroll,
      text: inputText.trim() || `Position ${anchors.length + 1}`,
      timestamp: Date.now(),
    };
    setAnchors([...anchors, newAnchor].sort((a, b) => a.position - b.position));
    setInputText('');
    setIsAdding(false);
  };

  const deleteAnchor = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAnchors(anchors.filter((a) => a.id !== id));
  };

  const scrollToAnchor = (position: number) => {
    window.scrollTo({
      top: position,
      behavior: 'smooth',
    });
  };

  return (
    <div className="fixed right-0 top-0 h-full z-50 flex items-center pointer-events-none">
      {/* Drawer Toggle Button - Adjusted position to be less intrusive */}
      <div className="absolute right-0 top-[30%] h-auto flex flex-col items-end">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`pointer-events-auto flex items-center justify-center transition-all duration-300 shadow-lg border border-gray-200 border-r-0 bg-white/90 backdrop-blur-md text-gray-500 hover:text-blue-600 ${
            isOpen ? 'rounded-full mr-[260px] p-2' : 'rounded-l-xl p-2.5 pr-1.5'
          }`}
          style={{ transitionProperty: 'margin, border-radius, padding' }}
        >
          {isOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Main Sidebar */}
      <motion.div
        initial={false}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="absolute right-0 top-0 w-72 h-full bg-white border-l border-gray-200 shadow-2xl flex flex-col pointer-events-auto"
      >
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Bookmark size={18} />
            </div>
            <span className="font-semibold text-gray-900">Page Anchors</span>
          </div>
          <motion.button
             whileTap={{ scale: 0.95 }}
             onClick={() => setIsAdding(true)}
             className="p-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
             title="Add anchor here"
          >
            <Plus size={20} />
          </motion.button>
        </div>

        {/* Add Anchor Form */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 overflow-hidden"
            >
              <div className="py-4 space-y-3 bg-gray-50 rounded-xl p-3 my-2 border border-gray-100">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 px-1">
                    Label (Optional, Max 10)
                  </label>
                  <input
                    autoFocus
                    type="text"
                    maxLength={10}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addAnchor()}
                    placeholder="Enter text..."
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => { setIsAdding(false); setInputText(''); }}
                    className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addAnchor}
                    className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                  >
                   Save Anchor
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {anchors.length === 0 && !isAdding && (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3 px-6 text-center">
              <ArrowUpCircle size={32} className="opacity-20" />
              <p className="text-sm">Scroll to a section and click the plus to save a position.</p>
            </div>
          )}

          <AnimatePresence initial={false}>
            {anchors.map((anchor) => (
              <motion.div
                key={anchor.id}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => scrollToAnchor(anchor.position)}
                className="group relative flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-sm cursor-pointer transition-all active:scale-[0.98]"
              >
                <div className="w-2 h-8 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors flex flex-col items-center justify-center overflow-hidden">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-800 truncate" title={anchor.text}>
                    {anchor.text}
                  </h4>
                  <p className="text-[10px] text-gray-400 font-mono">
                    Y: {Math.round(anchor.position)}px
                  </p>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button
                    onClick={(e) => deleteAnchor(anchor.id, e)}
                    className="p-1 px-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Custom Tooltip on Hover */}
                <div className="absolute top-0 right-full mr-4 invisible group-hover:visible translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all">
                   <div className="bg-gray-900/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs whitespace-nowrap shadow-xl">
                      {anchor.text}
                      <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                   </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="p-4 bg-gray-50/50 border-t border-gray-100">
           <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest font-bold">
             Chrome Extension Prototype
           </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AnchorSidebar;
