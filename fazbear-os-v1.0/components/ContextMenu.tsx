import React from 'react';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onAction: (action: string) => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, onAction }) => {
  const options = [
    { label: 'View', arrow: true },
    { label: 'Refresh', action: 'refresh' },
    { separator: true },
    { label: 'Paste', disabled: true },
    { label: 'Paste Shortcut', disabled: true },
    { separator: true },
    { label: 'New', arrow: true, submenu: true },
    { separator: true },
    { label: 'Properties', action: 'properties' },
  ];

  return (
    <div 
      className="absolute bg-[#d4d0c8] win-outset py-1 z-[10001] min-w-[150px] font-sans text-xs"
      style={{ left: x, top: y }}
      onMouseDown={(e) => e.stopPropagation()} 
      onContextMenu={(e) => e.preventDefault()}
    >
      {options.map((opt, i) => (
        <React.Fragment key={i}>
          {opt.separator ? (
            <div className="h-px bg-gray-400 mx-1 my-1 border-b border-white" />
          ) : (
            <div 
              className={`px-4 py-1 flex justify-between items-center hover:bg-[#000080] hover:text-white cursor-pointer group relative ${opt.disabled ? 'text-gray-500 hover:text-gray-500 hover:bg-transparent cursor-default' : ''}`}
              onClick={() => {
                if (!opt.disabled && opt.action && !opt.submenu) {
                  onAction(opt.action);
                  onClose();
                }
              }}
            >
              <span>{opt.label}</span>
              {opt.arrow && <span className="ml-2">▶</span>}
              
              {/* Simple nested menu for "New" */}
              {opt.submenu && (
                <div className="absolute left-full top-0 hidden group-hover:block bg-[#d4d0c8] win-outset py-1 min-w-[120px]">
                   <div 
                     className="px-4 py-1 hover:bg-[#000080] hover:text-white text-black"
                     onClick={(e) => {
                       e.stopPropagation();
                       onAction('new_folder');
                       onClose();
                     }}
                   >
                     📁 Folder
                   </div>
                   <div className="px-4 py-1 hover:bg-[#000080] hover:text-white text-black">
                     📄 Text Document
                   </div>
                </div>
              )}
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ContextMenu;