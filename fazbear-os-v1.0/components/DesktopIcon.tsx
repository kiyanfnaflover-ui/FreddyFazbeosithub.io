import React from 'react';

interface DesktopIconProps {
  id: string;
  title: string;
  icon: string;
  x: number;
  y: number;
  selected: boolean;
  onPointerDown: (e: React.PointerEvent) => void;
  onDoubleClick: () => void;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ id, title, icon, x, y, selected, onPointerDown, onDoubleClick }) => {
  return (
    <div 
      onPointerDown={onPointerDown}
      onDoubleClick={(e) => { e.stopPropagation(); onDoubleClick(); }}
      style={{ 
        transform: `translate(${x}px, ${y}px)`,
        position: 'absolute',
        top: 0,
        left: 0
      }}
      className="flex flex-col items-center w-[75px] cursor-default group select-none touch-none"
    >
      {/* Icon Area */}
      <div 
        className={`h-8 w-8 text-3xl flex items-center justify-center mb-1 relative`}
      >
        {/* Shadow for depth */}
        <div className={`absolute top-0.5 left-0.5 opacity-50 filter blur-[1px] brightness-0 scale-95 pointer-events-none`}>
             {icon}
        </div>
        {/* Actual Icon with pixel filter */}
        <div 
            className={`relative z-10 filter ${selected ? 'brightness-50 sepia hue-rotate-180 saturate-200' : 'none'}`}
            style={{ textShadow: 'none' }}
        >
            {icon}
        </div>
      </div>
      
      {/* Text Label */}
      <div className="w-full flex justify-center mt-1">
        <span 
          className={`
            text-xs font-w95 px-1 text-center leading-tight border border-transparent
            ${selected ? 'bg-[#000080] text-white border-dotted border-white' : 'text-white drop-shadow-[1px_1px_0_rgba(0,0,0,1)]'}
          `}
        >
          {title}
        </span>
      </div>
    </div>
  );
};

export default DesktopIcon;