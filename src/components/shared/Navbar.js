'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { useUIStore } from '@/store/uiStore';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useUserStore();
  const { addNotification } = useUIStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    addNotification({
      type: 'success',
      message: 'ログアウトしました'
    });
    router.push('/');
  };

  const navigation = [
    { name: 'クエスト', href: '/quest', icon: '/icons/quest.png', title: 'Quest' },
    { name: '学習', href: '/study', icon: '/icons/study.png', title: 'Study' },
    { name: 'エール', href: '/yell', icon: '/icons/yell.png', title: 'Yell' },
    { name: 'ベネフィット', href: '/benefits', icon: '/icons/benefit.png', title: 'Benefits' },
    { name: '成長記録', href: '/growth', icon: '/icons/growth.png', title: 'Growth' },
    { name: 'プロフィール', href: '/profile', icon: '/icons/profile.png', title: 'Profile' }
  ];

  const isActiveLink = (href) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const getCurrentPageTitle = () => {
    const currentNav = navigation.find(nav => isActiveLink(nav.href));
    return currentNav?.title || 'Team X';
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* ページタイトル */}
          <div className="flex items-center ml-8">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">
              {getCurrentPageTitle()}
            </h1>
          </div>

          {/* ハンバーガーメニューボタン */}
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              aria-label={isMobileMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

          </div>
        </div>
      </div>

      {/* モバイルメニュー */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-3 py-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                  isActiveLink(item.href)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Image
                  src={item.icon}
                  alt={item.name}
                  width={20}
                  height={20}
                  className="mr-3"
                />
                {item.name}
              </Link>
            ))}
            
            {/* モバイル用プロフィールセクション */}
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center px-3 py-3 rounded-lg bg-gray-50">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium mr-3">
                  {user?.nickname?.charAt(0) || 'U'}
                </div>
                <div className="flex-1">
                  <div className="text-base font-medium text-gray-900">
                    {user?.nickname || 'ユーザー'}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {user?.email || ''}
                  </div>
                </div>
              </div>
              
              <Link
                href="/profile"
                className="flex items-center px-3 py-3 mt-2 rounded-lg text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Image
                  src="/icons/profile.svg"
                  alt="設定"
                  width={16}
                  height={16}
                  className="mr-3"
                />
                プロフィール設定
              </Link>
              
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center w-full px-3 py-3 mt-1 rounded-lg text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <Image
                  src="/icons/arrow-right.svg"
                  alt="ログアウト"
                  width={16}
                  height={16}
                  className="mr-3"
                />
                ログアウト
              </button>
            </div>
          </div>
        </div>
      )}

      {/* オーバーレイ */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
}