import { supabase } from './supabase';

export const authAPI = {
  // エラーメッセージを日本語・ユーザーフレンドリーに変換
  _translateAuthError(error) {
    const errorMessage = error.message?.toLowerCase() || '';
    
    // Supabase固有のエラーメッセージを日本語化
    if (errorMessage.includes('invalid login credentials') || 
        errorMessage.includes('invalid email or password')) {
      return 'メールアドレスまたはパスワードが正しくありません';
    }
    
    if (errorMessage.includes('email not confirmed') || 
        errorMessage.includes('signup requires email confirmation')) {
      return 'メール認証が完了していません。確認メールをご確認ください';
    }
    
    if (errorMessage.includes('too many requests') || 
        errorMessage.includes('rate limit exceeded')) {
      return 'ログイン試行回数が上限に達しました。しばらく時間をおいてから再度お試しください';
    }
    
    if (errorMessage.includes('user not found') || 
        errorMessage.includes('user does not exist')) {
      return 'このメールアドレスで登録されたアカウントが見つかりません';
    }
    
    if (errorMessage.includes('weak password') || 
        errorMessage.includes('password should be')) {
      return 'パスワードは6文字以上で設定してください';
    }
    
    if (errorMessage.includes('email already registered') || 
        errorMessage.includes('user already registered')) {
      return 'このメールアドレスは既に登録されています';
    }
    
    if (errorMessage.includes('network') || 
        errorMessage.includes('connection')) {
      return 'ネットワークエラーが発生しました。インターネット接続を確認してください';
    }
    
    if (errorMessage.includes('invalid email')) {
      return '有効なメールアドレスを入力してください';
    }
    
    // その他のエラーは一般的なメッセージに
    return 'ログインに失敗しました。入力内容をご確認ください';
  },

  // ログイン
  async login(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(this._translateAuthError(error));
      }

      return {
        success: true,
        data: {
          user: {
            id: data.user.id,
            email: data.user.email,
            nickname: data.user.user_metadata?.nickname || data.user.email?.split('@')[0] || 'ユーザー',
          },
          token: data.session?.access_token,
          session: data.session,
        },
      };
    } catch (error) {
      throw error; // 既に翻訳済みのエラーをそのまま投げる
    }
  },

  // 新規登録
  async register(userData) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            nickname: userData.nickname || userData.email?.split('@')[0] || 'ユーザー',
          }
        }
      });

      if (error) {
        throw new Error(this._translateAuthError(error));
      }

      return {
        success: true,
        data: {
          user: {
            id: data.user?.id,
            email: data.user?.email,
            nickname: data.user?.user_metadata?.nickname || userData.nickname || 'ユーザー',
          },
          token: data.session?.access_token,
          session: data.session,
        },
        message: data.user && !data.session ? 'アカウント確認のメールを送信しました' : null,
      };
    } catch (error) {
      throw error; // 既に翻訳済みのエラーをそのまま投げる
    }
  },

  // ソーシャルログイン (Google)
  async signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`,
        }
      });

      if (error) {
        throw new Error(error.message || 'Google認証に失敗しました');
      }

      return { success: true, data };
    } catch (error) {
      throw new Error(error.message || 'Google認証に失敗しました');
    }
  },

  // ソーシャルログイン (Apple)
  async signInWithApple() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}`,
        }
      });

      if (error) {
        throw new Error(error.message || 'Apple認証に失敗しました');
      }

      return { success: true, data };
    } catch (error) {
      throw new Error(error.message || 'Apple認証に失敗しました');
    }
  },

  // ログアウト
  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }
      return { success: true };
    } catch (error) {
      // ログアウトは失敗してもクライアント側で処理を続行
      console.log('Logout failed, but continuing with client-side logout:', error);
      return { success: true };
    }
  },

  // セッション検証
  async verifyToken() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        throw new Error(error.message);
      }

      if (!session) {
        throw new Error('セッションが存在しません');
      }

      return {
        success: true,
        data: {
          user: {
            id: session.user.id,
            email: session.user.email,
            nickname: session.user.user_metadata?.nickname || session.user.email?.split('@')[0] || 'ユーザー',
          },
          token: session.access_token,
          session,
        },
      };
    } catch (error) {
      throw new Error(error.message || 'トークン検証に失敗しました');
    }
  },

  // パスワードリセット要求
  async requestPasswordReset(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        message: 'パスワードリセットのメールを送信しました',
      };
    } catch (error) {
      throw new Error(error.message || 'パスワードリセット要求に失敗しました');
    }
  },

  // 現在のユーザー情報を取得
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        throw new Error(error.message);
      }

      if (!user) {
        return { success: false, user: null };
      }

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            nickname: user.user_metadata?.nickname || user.email?.split('@')[0] || 'ユーザー',
          },
        },
      };
    } catch (error) {
      throw new Error(error.message || 'ユーザー情報の取得に失敗しました');
    }
  },

  // メール確認の再送信
  async resendConfirmationEmail(email) {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        throw new Error(error.message || 'メール再送信に失敗しました');
      }

      return {
        success: true,
        message: 'メール確認リンクを再送信しました',
      };
    } catch (error) {
      throw new Error(error.message || 'メール再送信に失敗しました');
    }
  },
};