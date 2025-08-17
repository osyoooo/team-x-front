import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useProfileStore = create(
  persist(
    (set, get) => ({
      // プロフィール情報
      profile: null,
      stats: null,
      achievements: [],
      
      // UI状態
      isEditing: false,
      
      // Actions
      setProfile: (profile) => {
        set({ profile });
      },
      
      updateProfile: (updates) => {
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...updates } : null
        }));
      },
      
      setStats: (stats) => {
        set({ stats });
      },
      
      setAchievements: (achievements) => {
        set({ achievements });
      },
      
      addSkill: (skill) => {
        set((state) => ({
          profile: state.profile ? {
            ...state.profile,
            skills: [...(state.profile.skills || []), skill]
          } : null
        }));
      },
      
      updateSkill: (skillId, updates) => {
        set((state) => ({
          profile: state.profile ? {
            ...state.profile,
            skills: state.profile.skills?.map(skill => 
              skill.id === skillId ? { ...skill, ...updates } : skill
            ) || []
          } : null
        }));
      },
      
      removeSkill: (skillId) => {
        set((state) => ({
          profile: state.profile ? {
            ...state.profile,
            skills: state.profile.skills?.filter(skill => skill.id !== skillId) || []
          } : null
        }));
      },
      
      addValue: (value) => {
        set((state) => ({
          profile: state.profile ? {
            ...state.profile,
            values: [...(state.profile.values || []), value]
          } : null
        }));
      },
      
      removeValue: (value) => {
        set((state) => ({
          profile: state.profile ? {
            ...state.profile,
            values: state.profile.values?.filter(v => v !== value) || []
          } : null
        }));
      },
      
      setEditing: (isEditing) => {
        set({ isEditing });
      },
      
      // Getters
      getProfile: () => get().profile,
      getStats: () => get().stats,
      getAchievements: () => get().achievements,
      
      // レベル計算
      getLevel: () => {
        const profile = get().profile;
        if (!profile?.stats?.totalXP) return 1;
        
        // 100 XPごとにレベルアップの簡単な計算
        return Math.floor(profile.stats.totalXP / 100) + 1;
      },
      
      // 次のレベルまでの経験値
      getXPToNextLevel: () => {
        const profile = get().profile;
        if (!profile?.stats?.totalXP) return 100;
        
        const currentLevel = Math.floor(profile.stats.totalXP / 100);
        const nextLevelXP = (currentLevel + 1) * 100;
        return nextLevelXP - profile.stats.totalXP;
      },
      
      // リセット
      reset: () => {
        set({
          profile: null,
          stats: null,
          achievements: [],
          isEditing: false
        });
      }
    }),
    {
      name: 'profile-storage',
      partialize: (state) => ({
        profile: state.profile,
        stats: state.stats,
        achievements: state.achievements
      })
    }
  )
);