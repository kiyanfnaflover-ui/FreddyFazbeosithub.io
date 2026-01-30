import React from 'react';

interface WindowFrameProps {
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onDragStart: (e: React.PointerEvent) => void;
  children: React.ReactNode;
}

const WindowFrame: React.FC<WindowFrameProps> = ({
  title,
  icon,
  isOpen,
  isMinimized,
  isMaximized,
  zIndex,
  x,
  y,
  width,
  height,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onDragStart,
  children,
}) => {
  if (!isOpen || isMinimized) return null;

  const style: React.CSSProperties = isMaximized 
    ? { zIndex, left: 0, top: 0, width: '100%', height: 'calc(100% - 28px)' } // Account for taskbar
    : { zIndex, left: x, top: y, width, height };

  return (
    <div
      onPointerDown={onFocus}
      className="absolute flex flex-col bg-[#c0c0c0] bevel-window p-[2px]"
      style={style}
    >
      {/* Title Bar */}
      <div 
        onPointerDown={!isMaximized ? onDragStart : undefined}
        onDoubleClick={onMaximize}
        className={`
          flex items-center justify-between px-1 h-[18px] select-none mb-[2px]
          ${zIndex >= 10 ? 'bg-[#000080]' : 'bg-[#808080]'}
        `}
      >
        <div className="flex items-center gap-1">
          <span className="text-white text-xs">{icon}</span>
          <span className="text-white font-w95 text-xs font-bold tracking-wide">{title}</span>
        </div>
        
        <div className="flex gap-[2px]">
          <button onClick={(e) => { e.stopPropagation(); onMinimize(); }} className="w-[16px] h-[14px] bg-[#c0c0c0] bevel-outset flex items-center justify-center active:bevel-inset">
            <span className="mb-2 font-bold text-xs">_</span>
          </button>
          <button onClick={(e) => { e.stopPropagation(); onMaximize(); }} className="w-[16px] h-[14px] bg-[#c0c0c0] bevel-outset flex items-center justify-center active:bevel-inset">
            <span className="font-bold text-xs leading-none">□</span>
          </button>
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="w-[16px] h-[14px] bg-[#c0c0c0] bevel-outset flex items-center justify-center active:bevel-inset ml-[2px]">
            <span className="font-bold text-xs leading-none">×</span>
          </button>
        </div>
      </div>

      {/* Menu Bar (Optional placeholder) */}
      <div className="flex gap-3 px-1 pb-1 text-black font-w95 text-sm border-b border-[#808080] shadow-[0_1px_0_#fff] mb-1">
        <span className="underline cursor-pointer">F</span>ile
        <span className="underline cursor-pointer">E</span>dit
        <span className="underline cursor-pointer">V</span>iew
        <span className="underline cursor-pointer">H</span>elp
      </div>

      {/* Content */}
      <div className="flex-1 bg-white relative overflow-hidden bevel-inset m-[1px]">
        <div className="relative z-0 h-full overflow-auto w-full">
            {children}
        </div>
      </div>
    </div>
  );
};

export default WindowFrame;