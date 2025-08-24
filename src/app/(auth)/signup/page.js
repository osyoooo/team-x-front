'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TopNavigation from '@/components/shared/TopNavigation';
import SocialButton from '@/components/ui/SocialButton';
import UnderlineInput from '@/components/ui/UnderlineInput';
import { useUserStore } from '@/store/userStore';
import { useUIStore } from '@/store/uiStore';
import { authAPI } from '@/lib/auth';

export default function SignUpPage() {
  const router = useRouter();
  const { login } = useUserStore();
  const { setLoading, addNotification } = useUIStore();
  const isLoading = useUIStore((state) => state.loading.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
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
      const response = await authAPI.register({
        email: formData.email,
        password: formData.password,
      });
      
      if (response.success) {
        login(response.data.user, response.data.token);
        addNotification({
          type: 'success',
          message: 'アカウントを作成しました',
        });
        router.push('/');
      } else {
        throw new Error(response.message || 'アカウント作成に失敗しました');
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

  const handleSocialLogin = (provider) => {
    addNotification({
      type: 'info',
      message: `${provider}認証は準備中です`,
    });
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Container - 393px width on mobile, responsive on larger screens */}
      <div className="max-w-[393px] sm:max-w-md md:max-w-lg mx-auto bg-white min-h-screen relative">
        {/* Top Navigation */}
        <TopNavigation />
        
        {/* Main Content */}
        <div className="px-5 sm:px-6 pt-10">
          {/* Title */}
          <h1 className="text-xl font-bold text-black mb-4">
            新規アカウント登録
          </h1>
          
          {/* Subtitle */}
          <p className="text-xs text-black mb-10">
            利用規約とプライバシーポリシーに同意の上、ご利用ください
          </p>
          
          {/* Social Login Buttons */}
          <div className="space-y-4 mb-8">
            <SocialButton type="apple" onClick={() => handleSocialLogin('Apple')}>
              Appleで登録
            </SocialButton>
            <SocialButton type="google" onClick={() => handleSocialLogin('Google')}>
              Googleで登録
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
              error={errors.email}
            />
            
            <UnderlineInput
              label="パスワード"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />
            
            {/* Submit Button */}
            <div className="pt-8">
              <button
                type="submit"
                disabled={!formData.email || !formData.password || isLoading}
                className={`
                  w-full h-14 rounded-full text-xs font-normal transition-opacity duration-200
                  ${!formData.email || !formData.password || isLoading
                    ? 'bg-[#E5E5E5] text-white cursor-not-allowed' 
                    : 'bg-black text-white hover:opacity-80'
                  }
                `}
              >
                {isLoading ? 'アカウント作成中...' : 'はじめる'}
              </button>
            </div>
          </form>
          
          {/* Login Link */}
          <div className="pt-8 pb-8">
            <p className="text-xs text-black mb-3">アカウントをお持ちの方</p>
            <button
              onClick={handleLogin}
              className="w-full h-14 rounded-full bg-white text-black text-xs font-normal border border-black hover:opacity-80 transition-opacity duration-200"
            >
              ログイン
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}