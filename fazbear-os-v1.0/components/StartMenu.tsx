import React from 'react';
import { playSound } from '../services/soundService';

interface StartMenuProps {
  onClose: () => void;
  onRestart: () => void;
  onShutdown: () => void;
  onOpenApp: (id: string) => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ onClose, onRestart, onShutdown, onOpenApp }) => {
  return (
    <div 
      className="absolute bottom-[28px] left-0 w-64 bg-[#c0c0c0] bevel-outset flex z-[10001]"
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Side Banner */}
      <div className="w-8 bg-[#000080] flex items-end relative overflow-hidden">
        <div className="absolute bottom-1 -left-1 text-white font-w95 text-xl font-bold tracking-widest whitespace-nowrap -rotate-90 origin-bottom-left flex items-center gap-2 px-2">
            FAZBEAR<span className="font-normal">OS</span>95
        </div>
      </div>
      
      {/* Menu Items */}
      <div className="flex-1 flex flex-col py-1">
         <MenuItem label="Programs" icon="📁" arrow onClick={() => {}} />
         <MenuItem label="Documents" icon="📄" arrow onClick={() => onOpenApp('documents')} />
         <MenuItem label="Settings" icon="⚙️" arrow onClick={() => onOpenApp('control_panel')} />
         <MenuItem label="Find" icon="🔎" arrow onClick={() => {}} />
         <MenuItem label="Help" icon="❓" onClick={() => {}} />
         <MenuItem label="Run..." icon="🏃" onClick={() => onOpenApp('run')} />
         
         <div className="h-[2px] border-t border-[#808080] border-b border-[#fff] my-1 mx-1"></div>
         
         <MenuItem label="Shut Down..." icon="🛑" onClick={onShutdown} />
      </div>
    </div>
  );
};

const MenuItem: React.FC<{ label: string, icon: string, arrow?: boolean, onClick?: () => void }> = ({ label, icon, arrow, onClick }) => (
  <button 
    className="flex items-center px-2 py-2 hover:bg-[#000080] hover:text-white w-full text-left group"
    onClick={() => { playSound('click'); if(onClick) onClick(); }}
  >
    <span className="w-6 text-center mr-2 text-lg">{icon}</span>
    <span className="font-w95 text-sm flex-1">{label}</span>
    {arrow && <span className="text-[10px] text-black group-hover:text-white">▶</span>}
  </button>
);

export default StartMenu;