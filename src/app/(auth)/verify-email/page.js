'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import TopNavigation from '@/components/shared/TopNavigation';
import { useUserStore } from '@/store/userStore';
import { useUIStore } from '@/store/uiStore';
import { authAPI } from '@/lib/auth';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addNotification } = useUIStore();
  const { isAuthenticated } = useUserStore();
  
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    // URLパラメータからメールアドレスを取得
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }

    // 既にログインしている場合はホームにリダイレクト
    if (isAuthenticated) {
      router.push('/');
    }
  }, [searchParams, isAuthenticated, router]);

  useEffect(() => {
    // 再送信クールダウンタイマー
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [resendCooldown]);

  const handleResendEmail = async () => {
    if (!email || isResending || resendCooldown > 0) return;

    setIsResending(true);
    
    try {
      const response = await authAPI.resendConfirmationEmail(email);
      
      if (response.success) {
        addNotification({
          type: 'success',
          message: 'メール認証リンクを再送信しました',
        });
        setResendCooldown(60); // 60秒のクールダウン
      }
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.message || 'メール再送信に失敗しました',
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToLogin = () => {
    router.push('/login');
  };

  const handleBackToSignup = () => {
    router.push('/signup');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Container - 393px width on mobile, responsive on larger screens */}
      <div className="max-w-[393px] sm:max-w-md md:max-w-lg mx-auto bg-white min-h-screen relative">
        {/* Top Navigation */}
        <TopNavigation />
        
        {/* Main Content */}
        <div className="px-5 sm:px-6 pt-10">
          {/* Email Verification Icon */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            
            {/* Title */}
            <h1 className="text-xl font-bold text-black mb-4">
              メールアドレスの確認
            </h1>
            
            {/* Subtitle */}
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              アカウント作成を完了するため、確認メールを送信しました
            </p>
          </div>

          {/* Email Display */}
          {email && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-xs text-gray-500 mb-1">送信先メールアドレス</p>
              <p className="text-sm font-medium text-gray-900">{email}</p>
            </div>
          )}

          {/* Instructions */}
          <div className="mb-8">
            <h2 className="text-sm font-medium text-gray-900 mb-3">次の手順に従ってください：</h2>
            <ol className="space-y-2 text-xs text-gray-600">
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">1</span>
                メールボックスを確認してください
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">2</span>
                Team Xからの確認メールを探してください
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">3</span>
                メール内の「確認」ボタンをクリックしてください
              </li>
            </ol>
          </div>

          {/* Resend Email Section */}
          <div className="mb-8">
            <p className="text-xs text-gray-500 mb-4">メールが届かない場合は、迷惑メールフォルダも確認してください。</p>
            
            <button
              onClick={handleResendEmail}
              disabled={isResending || resendCooldown > 0 || !email}
              className={`
                w-full h-12 rounded-full text-xs font-normal transition-opacity duration-200
                ${isResending || resendCooldown > 0 || !email
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:opacity-80'
                }
              `}
            >
              {isResending ? (
                'メール送信中...'
              ) : resendCooldown > 0 ? (
                `再送信まで ${resendCooldown}秒`
              ) : (
                'メールを再送信'
              )}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pb-8">
            <button
              onClick={handleBackToLogin}
              className="w-full h-12 rounded-full bg-black text-white text-xs font-normal hover:opacity-80 transition-opacity duration-200"
            >
              ログインページに戻る
            </button>
            
            <button
              onClick={handleBackToSignup}
              className="w-full h-12 rounded-full bg-white text-black text-xs font-normal border border-gray-300 hover:opacity-80 transition-opacity duration-200"
            >
              新規登録に戻る
            </button>
          </div>

          {/* Help Text */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              問題が解決しない場合は、サポートまでお問い合わせください
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">読み込み中...</p>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}