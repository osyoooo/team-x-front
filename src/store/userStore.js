import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

export const useUserStore = create(
  persist(
    (set, get) => ({
      // 認証状態
      isAuthenticated: false,
      user: null,
      token: null,
      session: null,
      
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
      
      // メール確認待ち状態
      pendingEmailVerification: null, // 確認待ちのメールアドレス
      
      // 初期化フラグ
      isInitialized: false,
      
      // Actions
      login: (user, token, session) => {
        set({
          isAuthenticated: true,
          user,
          token,
          session,
        });
      },
      
      logout: async () => {
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          session: null,
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
          pendingEmailVerification: null,
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
      
      // Supabaseセッションから認証状態を同期
      syncAuthState: (session) => {
        if (session?.user) {
          const user = {
            id: session.user.id,
            email: session.user.email,
            nickname: session.user.user_metadata?.nickname || session.user.email?.split('@')[0] || 'ユーザー',
          };
          
          set({
            isAuthenticated: true,
            user,
            token: session.access_token,
            session,
            isInitialized: true,
          });
        } else {
          set({
            isAuthenticated: false,
            user: null,
            token: null,
            session: null,
            isInitialized: true,
          });
        }
      },
      
      // 初期化フラグを設定
      setInitialized: (initialized) => {
        set({ isInitialized: initialized });
      },
      
      // メール確認待ちを設定
      setPendingEmailVerification: (email) => {
        set({ pendingEmailVerification: email });
      },
      
      // メール確認完了
      clearPendingEmailVerification: () => {
        set({ pendingEmailVerification: null });
      },
      
      // Selectors
      getIsLoggedIn: () => get().isAuthenticated,
      getUser: () => get().user,
      getProfile: () => get().profile,
      getIsInitialized: () => get().isInitialized,
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
        session: state.session,
        profile: state.profile,
        onboardingStep: state.onboardingStep,
        isOnboardingComplete: state.isOnboardingComplete,
        pendingEmailVerification: state.pendingEmailVerification,
      }),
    }
  )
);

// Supabase認証状態変更のリスナー設定
let authListener = null;

export const initializeAuth = () => {
  // 既存のリスナーがあれば削除
  if (authListener) {
    authListener.subscription.unsubscribe();
  }

  // 現在のセッションを取得して同期
  supabase.auth.getSession().then(({ data: { session } }) => {
    useUserStore.getState().syncAuthState(session);
  });

  // 認証状態変更のリスナー設定
  authListener = supabase.auth.onAuthStateChange(
    (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      useUserStore.getState().syncAuthState(session);
      
      // メール確認完了時の処理
      if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
        const { pendingEmailVerification, clearPendingEmailVerification } = useUserStore.getState();
        
        // 確認待ちメールと一致する場合
        if (pendingEmailVerification && session.user.email === pendingEmailVerification) {
          clearPendingEmailVerification();
          
          // メール確認完了の通知
          if (typeof window !== 'undefined') {
            // 確認完了後、少し待ってからリダイレクト（通知を表示するため）
            setTimeout(() => {
              window.location.href = '/';
            }, 1500);
          }
        }
      }
      
      // ログアウト時の追加処理
      if (event === 'SIGNED_OUT') {
        useUserStore.getState().logout();
      }
    }
  );
  
  return authListener;
};

// アプリの初期化時に呼び出す
if (typeof window !== 'undefined') {
  initializeAuth();
}