'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function BottomNav() {
  const pathname = usePathname();

  const navigation = [
    { name: 'プロフィール', href: '/profile', icon: '/icons/profile.png' },
    { name: '学習', href: '/study', icon: '/icons/study.png' },
    { name: 'クエスト', href: '/quest', icon: '/icons/quest.png' },
    { name: '応援', href: '/yell', icon: '/icons/yell.png' },
    { name: '成長', href: '/growth', icon: '/icons/growth.png' },
    { name: '特典', href: '/benefits', icon: '/icons/benefit.png' }
  ];

  const isActiveLink = (href) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black z-40 shadow-lg">
      <div className="grid grid-cols-6 h-16 safe-area-pb">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center justify-center text-[8px] font-medium transition-all duration-200 ${
              isActiveLink(item.href)
                ? 'text-white'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <div className={`mb-1 transition-all duration-200 ${
              isActiveLink(item.href) ? 'opacity-100' : 'opacity-70'
            }`}>
              <Image
                src={item.icon}
                alt={item.name}
                width={24}
                height={24}
                className={`transition-all duration-200 ${
                  isActiveLink(item.href)
                    ? 'brightness-0 saturate-100 invert'
                    : 'brightness-75 saturate-75'
                }`}
              />
            </div>
            <span className="leading-tight">{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}