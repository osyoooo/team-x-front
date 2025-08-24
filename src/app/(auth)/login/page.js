'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SocialButton from '@/components/ui/SocialButton';
import UnderlineInput from '@/components/ui/UnderlineInput';
import { useUserStore } from '@/store/userStore';
import { useUIStore } from '@/store/uiStore';
import { authAPI } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useUserStore();
  const { setLoading, addNotification } = useUIStore();
  const isLoading = useUIStore((state) => state.loading.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [fieldTouched, setFieldTouched] = useState({});
  const [showLoginHelp, setShowLoginHelp] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // フィールドがタッチされたことを記録
    setFieldTouched(prev => ({
      ...prev,
      [name]: true,
    }));
    
    // リアルタイムバリデーション
    validateField(name, value);
    
    // エラーをクリア
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setFieldTouched(prev => ({
      ...prev,
      [name]: true,
    }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    if (name === 'email' && fieldTouched.email) {
      if (!value) {
        newErrors.email = 'メールアドレスを入力してください';
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        newErrors.email = '有効なメールアドレスを入力してください';
      } else {
        delete newErrors.email;
      }
    }
    
    if (name === 'password' && fieldTouched.password) {
      if (!value) {
        newErrors.password = 'パスワードを入力してください';
      } else if (value.length < 6) {
        newErrors.password = 'パスワードは6文字以上で入力してください';
      } else {
        delete newErrors.password;
      }
    }
    
    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'メールアドレスを入力してください';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }
    
    if (!formData.password) {
      newErrors.password = 'パスワードを入力してください';
    } else if (formData.password.length < 6) {
      newErrors.password = 'パスワードは6文字以上で入力してください';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading('auth', true);
    
    try {
      const response = await authAPI.login(formData.email, formData.password);
      
      if (response.success) {
        login(response.data.user, response.data.token, response.data.session);
        addNotification({
          type: 'success',
          message: 'ログインしました',
        });
        router.push('/');
      } else {
        throw new Error(response.message || 'ログインに失敗しました');
      }
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.message,
      });
      
      // ログイン失敗時にヘルプを表示
      setShowLoginHelp(true);
    } finally {
      setLoading('auth', false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setLoading('auth', true);
    
    try {
      let response;
      if (provider === 'Google') {
        response = await authAPI.signInWithGoogle();
      } else if (provider === 'Apple') {
        response = await authAPI.signInWithApple();
      }
      
      if (response?.success) {
        addNotification({
          type: 'info',
          message: `${provider}認証を開始しています...`,
        });
        // OAuth認証は別ウィンドウまたはリダイレクトで処理されるため、
        // 実際のログイン処理はauth state changeリスナーで自動的に行われます
      }
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.message,
      });
    } finally {
      setLoading('auth', false);
    }
  };

  const handleSignup = () => {
    router.push('/signup');
  };

  const handlePasswordReset = async () => {
    if (!formData.email) {
      addNotification({
        type: 'warning',
        message: 'パスワードリセットにはメールアドレスを入力してください',
      });
      return;
    }

    setLoading('auth', true);

    try {
      const response = await authAPI.requestPasswordReset(formData.email);
      
      if (response.success) {
        addNotification({
          type: 'success',
          message: 'パスワードリセットメールを送信しました。メールをご確認ください。',
        });
        setShowLoginHelp(false);
      }
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.message || 'パスワードリセットメールの送信に失敗しました',
      });
    } finally {
      setLoading('auth', false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Container - 393px width on mobile, responsive on larger screens */}
      <div className="max-w-[393px] sm:max-w-md md:max-w-lg mx-auto bg-white min-h-screen relative">
        
        {/* Main Content */}
        <div className="px-5 sm:px-6 pt-10">
          {/* Title */}
          <h1 className="text-xl font-bold text-black mb-4">
            ログイン
          </h1>
          
          {/* Subtitle */}
          <p className="text-xs text-black mb-10">
            利用規約とプライバシーポリシーに同意の上、ご利用ください
          </p>

          
          {/* Social Login Buttons */}
          <div className="space-y-4 mb-8">
            <SocialButton type="apple" onClick={() => handleSocialLogin('Apple')}>
              Appleでログイン
            </SocialButton>
            <SocialButton type="google" onClick={() => handleSocialLogin('Google')}>
              Googleでログイン
            </SocialButton>
          </div>

          
          {/* Divider with "or" */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#CCCCCC]"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm text-black">or</span>
            </div>
          </div>

          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-12">
            <UnderlineInput
              label="メールアドレス"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
            />
            
            <UnderlineInput
              label="パスワード"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password}
            />
            
            {/* Submit Button */}
            <div className="pt-8">
              <button
                type="submit"
                disabled={!formData.email || !formData.password || isLoading}
                className={`
                  w-full h-14 rounded-full text-xs font-normal transition-opacity duration-200
                  ${
                    !formData.email || !formData.password || isLoading
                    ? 'bg-[#E5E5E5] text-white cursor-not-allowed' 
                    : 'bg-black text-white hover:opacity-80'
                  }
                `}
              >
                {isLoading ? 'ログイン中...' : 'ログイン'}
              </button>
            </div>
          </form>

          {/* Login Help Section */}
          {showLoginHelp && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-sm font-medium text-blue-800 mb-3">
                ログインできない場合は
              </h3>
              <div className="space-y-2 text-xs text-blue-700">
                <p>• メールアドレスとパスワードに間違いがないかご確認ください</p>
                <p>• パスワードを忘れた場合は、下記のリセット機能をご利用ください</p>
                <p>• メール認証が完了していない可能性があります</p>
              </div>
              
              <div className="mt-4">
                <button
                  onClick={() => {
                    if (formData.email) {
                      handlePasswordReset();
                    } else {
                      addNotification({
                        type: 'warning',
                        message: 'パスワードリセットにはメールアドレスを入力してください',
                      });
                    }
                  }}
                  className="text-xs text-blue-600 underline hover:text-blue-800"
                >
                  パスワードリセットメールを送信
                </button>
              </div>
              
              <button
                onClick={() => setShowLoginHelp(false)}
                className="mt-3 text-xs text-gray-500 underline hover:text-gray-700"
              >
                ヘルプを閉じる
              </button>
            </div>
          )}
          
          {/* Signup Link */}
          <div className="pt-8 pb-8">
            <p className="text-xs text-black mb-3">アカウントをお持ちでない方</p>
            <button
              onClick={handleSignup}
              className="w-full h-14 rounded-full bg-white text-black text-xs font-normal border border-black hover:opacity-80 transition-opacity duration-200"
            >
              はじめる
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}