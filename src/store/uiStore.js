import { create } from 'zustand';

// Hydrationエラー回避のための安定したID生成
let notificationIdCounter = 0;
const generateStableId = () => {
  return `notification_${++notificationIdCounter}_${typeof window !== 'undefined' ? performance.now() : Math.random()}`;
};

export const useUIStore = create((set, get) => ({
  // モーダル状態
  modals: {
    questDetail: { isOpen: false, questId: null },
    profile: { isOpen: false },
    notifications: { isOpen: false },
  },
  
  // 通知
  notifications: [],
  
  // ローディング状態
  loading: {
    global: false,
    quests: false,
    profile: false,
    auth: false,
  },
  
  // サイドバー状態（モバイル）
  sidebarOpen: false,
  
  // Actions
  openModal: (modalName, data = {}) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [modalName]: { isOpen: true, ...data },
      },
    }));
  },
  
  closeModal: (modalName) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [modalName]: { ...state.modals[modalName], isOpen: false },
      },
    }));
  },
  
  closeAllModals: () => {
    set((state) => ({
      modals: Object.keys(state.modals).reduce((acc, key) => {
        acc[key] = { ...state.modals[key], isOpen: false };
        return acc;
      }, {}),
    }));
  },
  
  addNotification: (notification) => {
    const id = generateStableId();
    set((state) => ({
      notifications: [
        ...state.notifications,
        { id, ...notification, timestamp: new Date() },
      ],
    }));
    
    // 5秒後に自動削除
    setTimeout(() => {
      get().removeNotification(id);
    }, 5000);
  },
  
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },
  
  setLoading: (key, isLoading) => {
    set((state) => ({
      loading: {
        ...state.loading,
        [key]: isLoading,
      },
    }));
  },
  
  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },
  
  setSidebarOpen: (isOpen) => {
    set({ sidebarOpen: isOpen });
  },
}));