'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useUserStore } from '@/store/userStore';
import { useUIStore } from '@/store/uiStore';
import { authAPI } from '@/lib/auth';

export default function SignUpPage() {
  const router = useRouter();
  const { login } = useUserStore();
  const { setLoading, addNotification } = useUIStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // エラーをクリア
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
    
    if (!formData.nickname) {
      newErrors.nickname = 'ニックネームを入力してください';
    } else if (formData.nickname.length < 2) {
      newErrors.nickname = 'ニックネームは2文字以上で入力してください';
    }
    
    if (!formData.password) {
      newErrors.password = 'パスワードを入力してください';
    } else if (formData.password.length < 6) {
      newErrors.password = 'パスワードは6文字以上で入力してください';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'パスワード（確認）を入力してください';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'パスワードが一致しません';
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
        nickname: formData.nickname,
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Team X アカウント作成
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            すでにアカウントをお持ちの方は{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              ログイン
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="ニックネーム"
              name="nickname"
              type="text"
              value={formData.nickname}
              onChange={handleChange}
              error={errors.nickname}
              placeholder="あなたのニックネーム"
            />
            
            <Input
              label="メールアドレス"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="your@email.com"
            />
            
            <Input
              label="パスワード"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="6文字以上"
            />
            
            <Input
              label="パスワード（確認）"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="パスワードを再入力"
            />
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={useUIStore((state) => state.loading.auth)}
            >
              {useUIStore((state) => state.loading.auth) ? 'アカウント作成中...' : 'アカウント作成'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}