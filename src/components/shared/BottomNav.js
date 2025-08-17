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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="grid grid-cols-6 h-16">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center justify-center text-xs font-medium transition-colors ${
              isActiveLink(item.href)
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="text-lg mb-1">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}