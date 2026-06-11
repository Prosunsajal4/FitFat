import { useState } from 'react';

export default function TabBar({ tabs, activeTab, onChange }) {
  return (
    <div className="flex bg-gray-900 rounded-xl p-1 gap-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`
            relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
            text-sm font-medium transition-all duration-200
            ${activeTab === tab.id
              ? 'bg-[#39FF14] text-black shadow-lg shadow-[#39FF14]/20'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            }
          `}
        >
          {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
          {tab.label}
          {activeTab === tab.id && (
            <span className="absolute inset-0 bg-[#39FF14] rounded-lg -z-10 animate-pulse opacity-10" />
          )}
        </button>
      ))}
    </div>
  );
}
