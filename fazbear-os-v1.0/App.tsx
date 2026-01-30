import React, { useState, useEffect, useRef } from 'react';
import CrtOverlay from './components/CrtOverlay';
import DesktopIcon from './components/DesktopIcon';
import WindowFrame from './components/WindowFrame';
import StartMenu from './components/StartMenu';
import Taskbar from './components/Taskbar';
import ContextMenu from './components/ContextMenu';
import BrowserWindow from './components/BrowserWindow';
import GlitchOverlay from './components/GlitchOverlay';
import Bsod from './components/Bsod';
import { AppId, INITIAL_WINDOWS, INITIAL_ICONS, WindowState, ChatMessage, IconState } from './types';
import { sendMessageToGemini } from './services/geminiService';
import { playSound } from './services/soundService';

const App: React.FC = () => {
  // --- System State ---
  const [bootState, setBootState] = useState<'BIOS' | 'SPLASH' | 'DESKTOP' | 'SHUTDOWN' | 'BSOD'>('BIOS');
  
  // --- UI State ---
  const [windows, setWindows] = useState<Record<string, WindowState>>(INITIAL_WINDOWS);
  const [icons, setIcons] = useState<IconState[]>(INITIAL_ICONS);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  
  // --- Interaction State ---
  const [selectedIconIds, setSelectedIconIds] = useState<Set<string>>(new Set());
  const [contextMenu, setContextMenu] = useState<{x: number, y: number} | null>(null);
  
  // Icon Drag State
  const [dragState, setDragState] = useState<{
      isDragging: boolean;
      startMouseX: number;
      startMouseY: number;
      initialIconPositions: Record<string, {x: number, y: number}>;
  } | null>(null);

  // Window Drag State
  const [windowDrag, setWindowDrag] = useState<{
      id: string;
      startX: number;
      startY: number;
      initialX: number;
      initialY: number;
  } | null>(null);

  const [selectionBox, setSelectionBox] = useState<{startX: number, startY: number, currX: number, currY: number} | null>(null);

  // --- Effects State ---
  const [glitchActive, setGlitchActive] = useState(false);
  const [glitchIntensity, setGlitchIntensity] = useState<'low'|'med'|'high'>('low');

  // --- App Specific State ---
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [notepadContent, setNotepadContent] = useState('Welcome to Fazbear OS 95.\n\nREMEMBER: SMILE!\n\nSecurity Shift: Night 1\nTarget: Survive till 6 AM\n');
  const [camIndex, setCamIndex] = useState(0);
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  // Auto-scroll ref for CMD
  const cmdEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      if (cmdEndRef.current) {
          cmdEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
  }, [chatHistory, isAiProcessing]);

  // --- Boot Sequence ---
  useEffect(() => {
    if (bootState === 'BIOS') {
        // BIOS is silent or just fan noise (simulated silence here)
        const timer = setTimeout(() => setBootState('SPLASH'), 2000);
        return () => clearTimeout(timer);
    }
    if (bootState === 'SPLASH') {
        const timer = setTimeout(() => {
            setBootState('DESKTOP');
            playSound('startup'); // Play startup sound only when entering desktop
        }, 3500);
        return () => clearTimeout(timer);
    }
  }, [bootState]);

  // --- Random Haunted Events ---
  useEffect(() => {
    if (bootState !== 'DESKTOP') return;

    const interval = setInterval(() => {
        // 10% chance every 10 seconds to glitch
        if (Math.random() < 0.1) {
            triggerGlitch('low');
            playSound('error');
        }
    }, 10000);

    return () => clearInterval(interval);
  }, [bootState]);

  const triggerGlitch = (intensity: 'low'|'med'|'high') => {
      setGlitchIntensity(intensity);
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), intensity === 'high' ? 1000 : 300);
  };

  // --- System Control ---
  const executeSystemAction = (action: string, payload?: string) => {
      switch (action) {
          case 'SHUTDOWN':
              setBootState('SHUTDOWN');
              playSound('shutdown');
              break;
          case 'RESTART':
              setBootState('BIOS');
              break;
          case 'BSOD':
              setBootState('BSOD');
              playSound('error');
              break;
          case 'OPEN_APP':
              if (payload) openApp(payload);
              break;
          case 'CLOSE_APP':
              if (payload && windows[payload]) closeWindow(payload);
              break;
      }
  };

  // --- Window Management ---
  const openApp = (id: string) => {
    playSound('open');
    if (id === AppId.SHUTDOWN) {
        executeSystemAction('SHUTDOWN');
        return;
    }
    if (id === AppId.RUN) {
        triggerGlitch('med');
        return;
    }

    if (!windows[id]) return;

    setWindows(prev => {
        const maxZ = Math.max(0, ...Object.values(prev).map((w: WindowState) => w.zIndex));
        return {
            ...prev,
            [id]: { ...prev[id], isOpen: true, isMinimized: false, zIndex: maxZ + 1 }
        };
    });
    setActiveWindowId(id);
    setStartMenuOpen(false);
  };

  const closeWindow = (id: string) => {
      playSound('click');
      setWindows(prev => ({ ...prev, [id]: { ...prev[id], isOpen: false } }));
      if (activeWindowId === id) setActiveWindowId(null);
  };

  const minimizeWindow = (id: string) => {
      playSound('minimize');
      setWindows(prev => ({ ...prev, [id]: { ...prev[id], isMinimized: true } }));
      setActiveWindowId(null);
  };

  const maximizeWindow = (id: string) => {
      playSound('maximize');
      setWindows(prev => ({ ...prev, [id]: { ...prev[id], isMaximized: !prev[id].isMaximized } }));
  };

  const focusWindow = (id: string) => {
      playSound('click');
      setWindows(prev => {
        const maxZ = Math.max(0, ...Object.values(prev).map((w: WindowState) => w.zIndex));
        return { ...prev, [id]: { ...prev[id], zIndex: maxZ + 1, isMinimized: false } };
      });
      setActiveWindowId(id);
  };

  const handleWindowDragStart = (e: React.PointerEvent, id: string) => {
      e.stopPropagation();
      e.preventDefault();
      
      // Bring to front
      focusWindow(id);
      
      const win = windows[id];
      if (win.isMaximized) return; // Cannot move maximized windows

      setWindowDrag({
          id,
          startX: e.clientX,
          startY: e.clientY,
          initialX: win.x,
          initialY: win.y
      });
  };

  // --- Desktop Interactions ---

  const handlePointerDown = (e: React.PointerEvent) => {
      if (e.button === 0) {
          setContextMenu(null);
          setStartMenuOpen(false);
          setSelectedIconIds(new Set());
          setSelectionBox({ startX: e.clientX, startY: e.clientY, currX: e.clientX, currY: e.clientY });
      }
  };

  const handleIconPointerDown = (e: React.PointerEvent, iconId: string) => {
      e.stopPropagation();
      setContextMenu(null);
      playSound('click');
      
      const isSelected = selectedIconIds.has(iconId);
      if (!isSelected) {
          setSelectedIconIds(new Set([iconId]));
      }

      if (e.button === 0) {
          const initialPositions: Record<string, {x: number, y: number}> = {};
          const idsToDrag = isSelected ? Array.from(selectedIconIds) : [iconId];
          const finalDragIds = isSelected ? idsToDrag : [iconId];
          
          finalDragIds.forEach(id => {
              const icon = icons.find(i => i.id === id);
              if (icon) initialPositions[id] = { x: icon.x, y: icon.y };
          });

          setDragState({
              isDragging: false,
              startMouseX: e.clientX,
              startMouseY: e.clientY,
              initialIconPositions: initialPositions
          });
      }
  };

  const handleGlobalPointerMove = (e: React.PointerEvent) => {
      // Icon Dragging
      if (dragState) {
          const dx = e.clientX - dragState.startMouseX;
          const dy = e.clientY - dragState.startMouseY;
          const currentDragState = dragState;

          if (!currentDragState.isDragging && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
              setDragState(prev => prev ? { ...prev, isDragging: true } : null);
          }

          if (currentDragState.isDragging || Math.abs(dx) > 3) {
             const positions = currentDragState.initialIconPositions;
             setIcons((prev) => prev.map((icon) => {
                 const initial = positions[icon.id];
                 if (initial) {
                     return { ...icon, x: initial.x + dx, y: initial.y + dy };
                 }
                 return icon;
             }));
          }
      }

      // Window Dragging
      if (windowDrag) {
          const dx = e.clientX - windowDrag.startX;
          const dy = e.clientY - windowDrag.startY;
          setWindows((prev) => ({
              ...prev,
              [windowDrag.id]: {
                  ...prev[windowDrag.id],
                  x: windowDrag.initialX + dx,
                  y: windowDrag.initialY + dy
              }
          }));
      }

      // Selection Box
      if (selectionBox) {
          setSelectionBox(prev => prev ? { ...prev, currX: e.clientX, currY: e.clientY } : null);
      }
  };

  const handleGlobalPointerUp = () => {
      if (dragState) {
          setDragState(null);
      }
      if (windowDrag) {
          setWindowDrag(null);
      }

      if (selectionBox) {
          const x1 = Math.min(selectionBox.startX, selectionBox.currX);
          const x2 = Math.max(selectionBox.startX, selectionBox.currX);
          const y1 = Math.min(selectionBox.startY, selectionBox.currY);
          const y2 = Math.max(selectionBox.startY, selectionBox.currY);

          const newSelection = new Set<string>();
          icons.forEach(icon => {
              const ix = icon.x + 32; 
              const iy = icon.y + 32;
              if (ix >= x1 && ix <= x2 && iy >= y1 && iy <= y2) {
                  newSelection.add(icon.id);
              }
          });
          if (newSelection.size > 0) setSelectedIconIds(newSelection);
          setSelectionBox(null);
      }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY });
      playSound('click');
  };

  // --- Render ---

  if (bootState === 'BIOS') {
      return (
          <div className="w-screen h-screen bg-black text-white font-mono p-4 cursor-none">
              <div className="mb-4">Award Modular BIOS v4.51PG, An Energy Star Ally</div>
              <div className="mb-4">Copyright (C) 1984-95, Award Software, Inc.</div>
              <div className="mb-8">PENTIUM-S CPU at 133MHz</div>
              <div>Memory Test: 16384K OK</div>
              <div className="mt-8">Detecting HDD Primary Master ... FAZBEAR 2GB</div>
              <div>Detecting HDD Primary Slave  ... None</div>
              <div className="mt-8 animate-pulse">_</div>
          </div>
      );
  }

  if (bootState === 'SPLASH') {
      return (
          <div className="w-screen h-screen bg-[#000080] flex items-center justify-center relative overflow-hidden">
              <CrtOverlay />
              <div className="relative z-10 text-center flex flex-col items-center">
                  <img 
                    src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/b0ce6155-7507-4d30-bd39-8333a1b1766c/dh8grak-30fac59a-ff75-49d1-a88c-9497cdbaf033.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiIvZi9iMGNlNjE1NS03NTA3LTRkMzAtYmQzOS04MzMzYTFiMTc2NmMvZGg4Z3Jhay0zMGZhYzU5YS1mZjc1LTQ5ZDEtYTg4Yy05NDk3Y2RiYWYwMzMucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.eEDieYrq9SsOEJOWo4o4GGufUoIyi3GPAM9yGGxZGrI"
                    alt="Fazbear OS Logo"
                    className="w-64 mb-8 drop-shadow-lg"
                  />
                  <div className="text-white font-sans text-2xl tracking-[0.5em] mb-8">VERSION 95</div>
                  <div className="w-64 h-4 bg-gray-400 border-2 border-white mx-auto relative overflow-hidden">
                      <div className="h-full bg-[#000080] w-1/3 animate-[slide_1s_infinite_linear]"></div>
                  </div>
                  <style>{`
                    @keyframes slide { 0% { margin-left: -30%; } 100% { margin-left: 100%; } }
                  `}</style>
              </div>
          </div>
      );
  }

  if (bootState === 'BSOD') {
      return <Bsod onClick={() => setBootState('BIOS')} />;
  }

  if (bootState === 'SHUTDOWN') {
     return (
        <div className="w-screen h-screen bg-black flex items-center justify-center relative">
            <CrtOverlay />
            <div className="text-[#ffaa00] font-w95 text-xl">It is now safe to turn off your computer.</div>
        </div>
     );
  }

  return (
    <div 
        className="w-screen h-screen overflow-hidden relative select-none"
        style={{ 
            backgroundImage: `url('https://i.redd.it/xhaen9l2jdm31.jpg')`, 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#008080'
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handleGlobalPointerMove}
        onPointerUp={handleGlobalPointerUp}
        onContextMenu={handleContextMenu}
    >
        <CrtOverlay />
        <GlitchOverlay active={glitchActive} intensity={glitchIntensity} />

        {/* Desktop Icons */}
        {icons.map(icon => (
            <DesktopIcon 
                key={icon.id}
                id={icon.id}
                title={icon.title}
                icon={icon.icon}
                x={icon.x}
                y={icon.y}
                selected={selectedIconIds.has(icon.id)}
                onPointerDown={(e) => handleIconPointerDown(e, icon.id)}
                onDoubleClick={() => icon.appId && openApp(icon.appId)}
            />
        ))}

        {/* Selection Box */}
        {selectionBox && (
            <div 
                className="absolute border border-dotted border-white bg-[rgba(0,0,128,0.2)]"
                style={{
                    left: Math.min(selectionBox.startX, selectionBox.currX),
                    top: Math.min(selectionBox.startY, selectionBox.currY),
                    width: Math.abs(selectionBox.currX - selectionBox.startX),
                    height: Math.abs(selectionBox.currY - selectionBox.startY),
                }}
            />
        )}

        {/* Windows */}
        {Object.values(windows).map((win: WindowState) => (
            <WindowFrame
                key={win.id}
                {...win}
                onClose={() => closeWindow(win.id)}
                onMinimize={() => minimizeWindow(win.id)}
                onMaximize={() => maximizeWindow(win.id)}
                onFocus={() => focusWindow(win.id)}
                onDragStart={(e) => handleWindowDragStart(e, win.id)}
            >
                {/* MY COMPUTER */}
                {win.id === AppId.MY_COMPUTER && (
                    <div className="p-4 flex gap-6 content-start flex-wrap bg-white h-full">
                        <div className="flex flex-col items-center w-16 group cursor-pointer" onDoubleClick={() => playSound('error')}>
                            <span className="text-3xl">💾</span>
                            <span className="text-xs font-w95 mt-1 text-center">3½ Floppy (A:)</span>
                        </div>
                        <div className="flex flex-col items-center w-16 group cursor-pointer">
                            <span className="text-3xl">💿</span>
                            <span className="text-xs font-w95 mt-1 text-center">Fazbear (C:)</span>
                        </div>
                        <div className="flex flex-col items-center w-16 group cursor-pointer" onDoubleClick={() => openApp(AppId.CONTROL_PANEL)}>
                            <span className="text-3xl">⚙️</span>
                            <span className="text-xs font-w95 mt-1 text-center">Control Panel</span>
                        </div>
                    </div>
                )}

                {/* BROWSER */}
                {win.id === AppId.BROWSER && <BrowserWindow />}

                {/* CONTROL PANEL */}
                {win.id === AppId.CONTROL_PANEL && (
                    <div className="p-2 bg-white h-full overflow-y-auto">
                        <div className="grid grid-cols-4 gap-4">
                             {[
                                {label: "Animatronics", icon: "🤖"},
                                {label: "Security", icon: "🔒"},
                                {label: "Power", icon: "⚡"},
                                {label: "Audio", icon: "🔉"},
                                {label: "Network", icon: "🌐"},
                                {label: "System", icon: "💻"},
                             ].map((item, i) => (
                                 <div key={i} className="flex flex-col items-center cursor-pointer hover:opacity-80" onClick={() => { playSound('click'); triggerGlitch('low'); }}>
                                     <div className="text-2xl">{item.icon}</div>
                                     <div className="text-xs text-center font-w95 mt-1 leading-tight">{item.label}</div>
                                 </div>
                             ))}
                        </div>
                        <div className="mt-4 p-2 bg-red-100 border border-red-500 font-w95 text-xs text-red-900">
                             WARNING: Night Mode Active. Power usage restricted to 10%.
                        </div>
                    </div>
                )}

                {/* SHOWTIME PLAYER */}
                {win.id === AppId.MEDIA_PLAYER && (
                    <div className="bg-[#c0c0c0] h-full flex flex-col p-1">
                        <div className="bg-black text-green-500 font-mono p-2 mb-2 h-16 border-2 border-gray-600 inset-shadow flex items-center justify-center">
                            TRACK 01: FREDDY'S JINGLE [00:45]
                        </div>
                        <div className="flex justify-center gap-2 mb-2">
                             {['⏮','▶','⏸','⏹','⏭'].map(btn => (
                                 <button key={btn} onClick={() => playSound('click')} className="w-8 h-8 bevel-outset font-bold active:bevel-inset">{btn}</button>
                             ))}
                        </div>
                        <div className="flex-1 bg-white border border-gray-600 overflow-y-auto p-1 text-xs font-w95">
                            <div className="bg-[#000080] text-white">1. Freddy_Theme.mid</div>
                            <div>2. Bonnie_Jam.wav</div>
                            <div className="text-red-500">3. SCREAM_01.wav (Corrupted)</div>
                        </div>
                    </div>
                )}

                {/* NOTES */}
                {win.id === AppId.NOTES && (
                    <div className="h-full flex flex-col">
                        <textarea 
                            className="flex-1 resize-none outline-none font-mono text-sm p-1"
                            value={notepadContent}
                            onChange={(e) => setNotepadContent(e.target.value)}
                        />
                    </div>
                )}

                {/* CAMERA VIEWER */}
                {win.id === AppId.CCTV && (
                    <div className="bg-[#c0c0c0] h-full flex flex-col p-1">
                         <div className="flex-1 bg-black border-2 border-gray-600 inset-shadow relative overflow-hidden flex items-center justify-center group">
                             <div className="absolute top-2 left-2 text-white font-mono bg-black px-1 z-10">CAM 0{camIndex + 1}</div>
                             <div className="absolute bottom-2 right-2 text-red-500 font-mono bg-black px-1 z-10 animate-pulse">REC ●</div>
                             <img 
                                src={`https://picsum.photos/600/400?grayscale&blur=1&seed=${camIndex + 10}`} 
                                className="w-full h-full object-cover opacity-60"
                             />
                             {/* Static overlay */}
                             <div className="absolute inset-0 bg-white opacity-10 animate-[flicker_0.05s_infinite] pointer-events-none mix-blend-overlay"></div>
                             {/* Random "Ghost" */}
                             {Math.random() > 0.8 && (
                                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl opacity-20 pointer-events-none">🐻</div>
                             )}
                         </div>
                         <div className="h-16 mt-1 grid grid-cols-4 gap-1">
                             {[0,1,2,3].map(i => (
                                 <button 
                                    key={i}
                                    onClick={() => { setCamIndex(i); playSound('click'); }}
                                    className={`bevel-outset font-bold text-xs ${camIndex === i ? 'bg-white bevel-inset' : ''}`}
                                 >
                                     CAM {i+1}
                                 </button>
                             ))}
                         </div>
                    </div>
                )}
                
                {/* MANAGEMENT SUITE (AI CMD Chat) */}
                {win.id === AppId.MGMT && (
                     <div className="flex flex-col h-full bg-black text-[#c0c0c0] font-mono text-sm p-1 border-2 border-[#808080] inset-shadow">
                         <div className="flex-1 overflow-y-auto p-2" onClick={() => document.getElementById('cmd-input')?.focus()}>
                             <div className="mb-4 text-white">
                                 Microsoft(R) Windows 95<br/>
                                 (C)Copyright Microsoft Corp 1981-1996.<br/>
                                 <br/>
                                 FAZBEAR OS EXTENSIONS LOADED.<br/>
                                 AI ASSISTANT 'HELPY' v1.0 ONLINE.<br/>
                             </div>
                             {chatHistory.map((m, i) => (
                                 <div key={i} className="mb-2 break-words">
                                     {m.role === 'user' ? (
                                         <div>
                                            <span className="text-[#c0c0c0]">C:\ADMIN&gt;</span> {m.text}
                                         </div>
                                     ) : (
                                         <div className="text-[#00ff00] whitespace-pre-wrap">
                                             [SYSTEM]: {m.text}
                                         </div>
                                     )}
                                 </div>
                             ))}
                             {isAiProcessing && <div className="text-green-500">[SYSTEM]: Processing request<span className="animate-pulse">...</span></div>}
                             <div ref={cmdEndRef} />
                         </div>
                         <form 
                             className="flex bg-black p-1 shrink-0"
                             onSubmit={async (e) => {
                                 e.preventDefault();
                                 if(!chatInput.trim()) return;
                                 const msg: ChatMessage = { role: 'user', text: chatInput, timestamp: new Date().toISOString() };
                                 setChatHistory(prev => [...prev, msg]);
                                 setChatInput('');
                                 playSound('click');
                                 setIsAiProcessing(true);
                                 
                                 const response = await sendMessageToGemini(chatHistory, msg.text);
                                 
                                 setIsAiProcessing(false);
                                 if (response.text) {
                                    setChatHistory(prev => [...prev, { role: 'model', text: response.text, timestamp: new Date().toISOString() }]);
                                    playSound('startup');
                                 }
                                 
                                 // Execute actions
                                 response.actions.forEach(action => {
                                     executeSystemAction(action.type, action.payload);
                                 });
                             }}
                         >
                             <span className="mr-1 text-[#c0c0c0]">C:\ADMIN&gt;</span>
                             <input 
                                 id="cmd-input"
                                 className="flex-1 bg-black text-white outline-none border-none caret-white" 
                                 value={chatInput} 
                                 onChange={e => setChatInput(e.target.value)}
                                 autoFocus
                                 autoComplete="off"
                             />
                         </form>
                     </div>
                )}

                {/* GENERIC FILES */}
                {win.id === AppId.DOCUMENTS && (
                    <div className="bg-white h-full flex flex-col">
                        <div className="border-b border-gray-400 p-1 flex gap-2 text-sm">
                            <span>File</span> <span>Edit</span> <span>View</span> <span>Help</span>
                        </div>
                        <div className="flex-1 p-4 grid grid-cols-4 content-start gap-4">
                             {['Recipes.txt', 'Employee_Handbook.doc', 'Safety_Incidents_1987.txt'].map((f, i) => (
                                 <div key={i} className="flex flex-col items-center group cursor-pointer" onDoubleClick={() => playSound('open')}>
                                     <div className="text-3xl">📄</div>
                                     <div className="text-xs text-center mt-1 group-hover:bg-[#000080] group-hover:text-white px-1">
                                         {f}
                                     </div>
                                 </div>
                             ))}
                        </div>
                    </div>
                )}

            </WindowFrame>
        ))}

        {/* Start Menu & Taskbar */}
        {startMenuOpen && (
            <StartMenu 
                onClose={() => setStartMenuOpen(false)}
                onRestart={() => executeSystemAction('RESTART')}
                onShutdown={() => executeSystemAction('SHUTDOWN')}
                onOpenApp={(id) => openApp(id)}
            />
        )}
        <Taskbar 
            windows={windows} 
            activeWindowId={activeWindowId} 
            onToggleStart={() => {
                setStartMenuOpen(!startMenuOpen);
                playSound('click');
            }}
            startMenuOpen={startMenuOpen}
            onWindowClick={(id) => {
                playSound('click');
                if(activeWindowId === id && !windows[id].isMinimized) {
                    minimizeWindow(id);
                } else {
                    focusWindow(id);
                }
            }}
        />
        
        {/* Context Menu */}
        {contextMenu && (
            <ContextMenu 
                x={contextMenu.x}
                y={contextMenu.y}
                onClose={() => setContextMenu(null)}
                onAction={(action) => {
                    playSound('click');
                    if (action === 'refresh') {
                        triggerGlitch('low');
                    }
                    if (action === 'properties') executeSystemAction('BSOD');
                }}
            />
        )}
    </div>
  );
};

export default App;