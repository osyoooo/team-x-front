'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  const navigation = [
    { name: 'クエスト', href: '/quest', icon: '🎯' },
    { name: '学習', href: '/study', icon: '📚' },
    { name: 'エール', href: '/yell', icon: '📣' },
    { name: 'ベネフィット', href: '/benefits', icon: '🎁' },
    { name: '成長記録', href: '/growth', icon: '📈' },
    { name: 'プロフィール', href: '/profile', icon: '👤' }
  ];

  const isActiveLink = (href) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-lg">
      <div className="grid grid-cols-6 h-16 safe-area-pb">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center justify-center text-xs font-medium transition-all duration-200 ${
              isActiveLink(item.href)
                ? 'text-blue-600 bg-blue-50 transform scale-105'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <span className={`mb-1 transition-all duration-200 ${
              isActiveLink(item.href) ? 'text-xl' : 'text-lg'
            }`}>
              {item.icon}
            </span>
            <span className="leading-tight">{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}