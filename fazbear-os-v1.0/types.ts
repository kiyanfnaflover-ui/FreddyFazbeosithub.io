export enum AppId {
  MY_COMPUTER = 'my_computer',
  DOCUMENTS = 'documents',
  NETWORK = 'network',
  RECYCLE = 'recycle',
  CONTROL_PANEL = 'control_panel',
  MEDIA_PLAYER = 'media_player',
  CCTV = 'cctv',
  NOTES = 'notes',
  TOOLS = 'tools',
  MGMT = 'mgmt',
  RUN = 'run',
  SHUTDOWN = 'shutdown',
  BROWSER = 'browser'
}

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: string;
}

export interface IconState {
  id: string;
  appId?: AppId;
  title: string;
  icon: string;
  x: number;
  y: number;
  location: 'desktop' | string;
  isSelected: boolean;
}

export interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SystemAction {
  type: 'OPEN_APP' | 'CLOSE_APP' | 'SHUTDOWN' | 'RESTART' | 'BSOD';
  payload?: string; // AppId or other data
}

export interface AIResponse {
  text: string;
  actions: SystemAction[];
}

export const INITIAL_ICONS: IconState[] = [
  { id: 'ic_comp', appId: AppId.MY_COMPUTER, title: "Fazbear Sys", icon: "💻", x: 10, y: 10, location: 'desktop', isSelected: false },
  { id: 'ic_docs', appId: AppId.DOCUMENTS, title: "Pizzeria Recs", icon: "🗄️", x: 10, y: 80, location: 'desktop', isSelected: false },
  { id: 'ic_net', appId: AppId.BROWSER, title: "Fazgle Net", icon: "🌐", x: 10, y: 150, location: 'desktop', isSelected: false },
  { id: 'ic_bin', appId: AppId.RECYCLE, title: "Trash", icon: "🗑️", x: 10, y: 220, location: 'desktop', isSelected: false },
  
  { id: 'ic_cp', appId: AppId.CONTROL_PANEL, title: "Sys Config", icon: "⚙️", x: 100, y: 10, location: 'desktop', isSelected: false },
  { id: 'ic_media', appId: AppId.MEDIA_PLAYER, title: "Showtunes", icon: "🎵", x: 100, y: 80, location: 'desktop', isSelected: false },
  { id: 'ic_cam', appId: AppId.CCTV, title: "Sec. Cams", icon: "📹", x: 100, y: 150, location: 'desktop', isSelected: false },
  { id: 'ic_note', appId: AppId.NOTES, title: "Log Book", icon: "📓", x: 100, y: 220, location: 'desktop', isSelected: false },
  
  { id: 'ic_tools', appId: AppId.TOOLS, title: "Maint. Tools", icon: "🛠️", x: 190, y: 10, location: 'desktop', isSelected: false },
  { id: 'ic_mgmt', appId: AppId.MGMT, title: "Helpy Chat", icon: "🐻", x: 190, y: 80, location: 'desktop', isSelected: false },
];

export const INITIAL_WINDOWS: Record<string, WindowState> = {
  [AppId.MY_COMPUTER]: { id: AppId.MY_COMPUTER, title: "Fazbear System 2.0", isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1, icon: "💻", x: 50, y: 50, width: 400, height: 300 },
  [AppId.DOCUMENTS]: { id: AppId.DOCUMENTS, title: "Pizzeria Records", isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1, icon: "🗄️", x: 80, y: 80, width: 500, height: 400 },
  [AppId.BROWSER]: { id: AppId.BROWSER, title: "Fazgle Internet", isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1, icon: "🌐", x: 60, y: 60, width: 600, height: 450 },
  [AppId.CONTROL_PANEL]: { id: AppId.CONTROL_PANEL, title: "Control Panel", isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1, icon: "⚙️", x: 150, y: 100, width: 450, height: 350 },
  [AppId.MEDIA_PLAYER]: { id: AppId.MEDIA_PLAYER, title: "Showtime Audio", isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1, icon: "🎵", x: 200, y: 200, width: 300, height: 400 },
  [AppId.CCTV]: { id: AppId.CCTV, title: "Security Feed - LIVE", isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1, icon: "📹", x: 300, y: 50, width: 600, height: 450 },
  [AppId.NOTES]: { id: AppId.NOTES, title: "Shift Log - Notepad", isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1, icon: "📓", x: 100, y: 100, width: 400, height: 300 },
  [AppId.MGMT]: { id: AppId.MGMT, title: "Virtual Assistant 'Helpy'", isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1, icon: "🐻", x: 120, y: 120, width: 400, height: 500 },
  [AppId.TOOLS]: { id: AppId.TOOLS, title: "Animatronic Diagnostics", isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1, icon: "🛠️", x: 120, y: 120, width: 400, height: 300 },
};