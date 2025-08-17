'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { authAPI } from '@/lib/auth';

export function useAuth(requireAuth = true) {
  const router = useRouter();
  const { isAuthenticated, logout, user } = useUserStore();

  useEffect(() => {
    const checkAuth = async () => {
      if (requireAuth && !isAuthenticated) {
        // 認証が必要だがログインしていない場合
        router.push('/login');
        return;
      }

      if (isAuthenticated) {
        try {
          // トークンの有効性を確認（実際のAPIがある場合）
          // await authAPI.verifyToken();
        } catch (error) {
          // トークンが無効な場合はログアウト
          logout();
          router.push('/login');
        }
      }
    };

    checkAuth();
  }, [isAuthenticated, requireAuth, router, logout]);

  return {
    isAuthenticated,
    user,
    logout: () => {
      logout();
      router.push('/login');
    },
  };
}

// 認証が不要なページ用のフック
export function useGuestOnly() {
  const router = useRouter();
  const { isAuthenticated } = useUserStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  return { isAuthenticated };
}