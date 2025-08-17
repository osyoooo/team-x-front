'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useUserStore();

  useEffect(() => {
    // 認証済みの場合はメインダッシュボードにリダイレクト
    if (isAuthenticated) {
      router.push('/quest');
    }
  }, [isAuthenticated, router]);

  // 認証済みの場合は何も表示しない（リダイレクト中）
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Team <span className="text-blue-600">X</span>
          </h1>
          <p className="text-2xl text-gray-600 mb-8">
            みらいちゃんと一緒に学び、成長し、夢を実現するプラットフォーム
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="px-8 py-4 text-lg">
                今すぐ始める
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                ログイン
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg p-8 shadow-md text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">クエスト</h3>
            <p className="text-gray-600">
              段階的なクエストを通じて、目標に向かって着実にスキルアップ
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-8 shadow-md text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">学習</h3>
            <p className="text-gray-600">
              個人に最適化された学習コンテンツで効率的にスキルを習得
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-8 shadow-md text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">成長記録</h3>
            <p className="text-gray-600">
              学習の進捗と成果を可視化して、継続的な成長をサポート
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-lg p-12 shadow-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            あなたの夢を実現しませんか？
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Team X で新しい学びの旅を始めよう
          </p>
          <Link href="/signup">
            <Button size="lg" className="px-12 py-4 text-lg">
              無料で始める
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}