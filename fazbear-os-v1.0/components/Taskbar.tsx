import React, { useState, useEffect } from 'react';
import { WindowState } from '../types';

interface TaskbarProps {
  windows: Record<string, WindowState>;
  activeWindowId: string | null;
  onToggleStart: () => void;
  startMenuOpen: boolean;
  onWindowClick: (id: string) => void;
}

const Taskbar: React.FC<TaskbarProps> = ({ windows, activeWindowId, onToggleStart, startMenuOpen, onWindowClick }) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute bottom-0 left-0 w-full h-[28px] bg-[#c0c0c0] border-t border-[#fff] flex items-center p-[2px] z-[10000] shadow-[inset_0_1px_0_#fff]">
      {/* Start Button */}
      <button 
        onClick={(e) => { e.stopPropagation(); onToggleStart(); }}
        className={`
          flex items-center gap-1 px-1 h-[22px] mr-2
          ${startMenuOpen ? 'bevel-inset bg-[#e0e0e0]' : 'bevel-outset'}
          active:bevel-inset active:bg-[#e0e0e0]
        `}
      >
        <span className="text-lg">🐻</span>
        <span className="font-w95 font-bold text-sm">Start</span>
      </button>
      
      {/* Divider */}
      <div className="w-[2px] h-[20px] border-l border-[#808080] border-r border-[#fff] mx-1"></div>

      {/* Window Tabs */}
      <div className="flex-1 flex gap-1 overflow-hidden px-1">
         {(Object.values(windows) as WindowState[]).filter(w => w.isOpen).map(win => (
           <button
             key={win.id}
             onClick={() => onWindowClick(win.id)}
             className={`
               flex items-center gap-1 px-2 h-[22px] max-w-[150px] min-w-[100px] text-left truncate
               ${activeWindowId === win.id && !win.isMinimized ? 'bevel-inset bg-[#e0e0e0] font-bold dotted-bg' : 'bevel-outset'}
             `}
           >
             <span className="text-xs">{win.icon}</span>
             <span className="font-w95 text-xs truncate">{win.title}</span>
           </button>
         ))}
      </div>

      {/* System Tray */}
      <div className="bevel-inset bg-[#c0c0c0] h-[22px] px-2 flex items-center gap-2 min-w-[80px] justify-end">
         <span className="text-xs" title="Volume">🔊</span>
         <span className="font-w95 text-xs">{time}</span>
      </div>
    </div>
  );
};

export default Taskbar;