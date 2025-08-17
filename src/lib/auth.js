import { apiClient } from './api';

export const authAPI = {
  // ログイン
  async login(email, password) {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });
      return response;
    } catch (error) {
      // デモ用のモックレスポンス
      if (email === 'demo@teamx.com' && password === 'demo123') {
        return {
          success: true,
          data: {
            user: {
              id: '1',
              email: 'demo@teamx.com',
              nickname: 'デモユーザー',
            },
            token: 'demo-jwt-token-' + Date.now(),
          },
        };
      }
      throw new Error('ログインに失敗しました');
    }
  },

  // 新規登録
  async register(userData) {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response;
    } catch (error) {
      // デモ用のモックレスポンス
      return {
        success: true,
        data: {
          user: {
            id: Date.now().toString(),
            email: userData.email,
            nickname: userData.nickname || 'ユーザー',
          },
          token: 'demo-jwt-token-' + Date.now(),
        },
      };
    }
  },

  // ログアウト
  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // ログアウトは失敗してもクライアント側で処理を続行
      console.log('Logout API call failed, but continuing with client-side logout');
    }
  },

  // トークン検証
  async verifyToken() {
    try {
      const response = await apiClient.get('/auth/verify');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // パスワードリセット要求
  async requestPasswordReset(email) {
    try {
      const response = await apiClient.post('/auth/password-reset', { email });
      return response;
    } catch (error) {
      // デモ用のモックレスポンス
      return {
        success: true,
        message: 'パスワードリセットのメールを送信しました',
      };
    }
  },
};