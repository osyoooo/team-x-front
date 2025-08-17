import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create(
  persist(
    (set, get) => ({
      // 認証状態
      isAuthenticated: false,
      user: null,
      token: null,
      
      // プロフィール情報
      profile: {
        nickname: '',
        dream: '',
        values: [],
        skills: [],
        affiliation: '',
        profileImage: null,
      },
      
      // オンボーディング状態
      onboardingStep: 0,
      isOnboardingComplete: false,
      
      // Actions
      login: (user, token) => {
        set({
          isAuthenticated: true,
          user,
          token,
        });
      },
      
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          profile: {
            nickname: '',
            dream: '',
            values: [],
            skills: [],
            affiliation: '',
            profileImage: null,
          },
          onboardingStep: 0,
          isOnboardingComplete: false,
        });
      },
      
      updateProfile: (profileData) => {
        set((state) => ({
          profile: { ...state.profile, ...profileData },
        }));
      },
      
      setOnboardingStep: (step) => {
        set({ onboardingStep: step });
      },
      
      completeOnboarding: () => {
        set({ isOnboardingComplete: true });
      },
      
      // Selectors
      getIsLoggedIn: () => get().isAuthenticated,
      getUser: () => get().user,
      getProfile: () => get().profile,
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
        profile: state.profile,
        onboardingStep: state.onboardingStep,
        isOnboardingComplete: state.isOnboardingComplete,
      }),
    }
  )
);