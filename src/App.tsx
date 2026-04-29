/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import DemoContent from './components/DemoContent';
import AnchorSidebar from './components/AnchorSidebar';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Decorative Browser Bar Simulation */}
      <div className="fixed top-0 left-0 w-full h-12 bg-gray-100 border-b border-gray-200 z-40 flex items-center px-4 gap-2">
        <div className="flex gap-1.5 mr-4">
          <div className="w-3 h-3 rounded-full bg-red-400/80" />
          <div className="w-3 h-3 rounded-full bg-amber-400/80" />
          <div className="w-3 h-3 rounded-full bg-green-400/80" />
        </div>
        <div className="flex-1 max-w-xl h-7 bg-white rounded-md border border-gray-200 flex items-center px-3 text-xs text-gray-400 overflow-hidden">
          https://ais-prototype.app/demo-extension-article
        </div>
      </div>

      <div className="w-full pt-12 relative">
        <DemoContent />
        <AnchorSidebar />
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}
