'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import Image from 'next/image';

// 学習コンテンツカードコンポーネント
const LearningContentCard = ({ content, isLocked = false, onButtonClick, buttonText }) => {
  const StarRating = ({ rating = 1 }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <div key={star} className={`w-2 h-2 ${star <= rating ? "bg-yellow-500" : "bg-gray-300"}`} 
               style={{clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"}} />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white bg-opacity-90 backdrop-blur rounded shadow-lg overflow-hidden">
      {/* 画像エリア */}
      <div className="h-28 bg-gradient-to-br from-green-200 to-blue-200 relative">
        {content.image ? (
          <Image
            src={content.image}
            alt={content.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-200 to-blue-200 flex items-center justify-center">
            <span className="text-white text-4xl">🎯</span>
          </div>
        )}
        {content.points && (
          <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            +{content.points}
          </div>
        )}
      </div>
      
      {/* コンテンツエリア */}
      <div className="p-4">
        <h3 className="font-bold text-sm mb-2 text-black">{content.title}</h3>
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{content.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <StarRating rating={content.rating} />
          <Image
            src="/icons/arrow-right.svg"
            alt="arrow"
            width={12}
            height={12}
            className="text-gray-600"
          />
        </div>
        
        <button
          onClick={() => onButtonClick(content)}
          className="w-full bg-gray-400 text-black text-xs font-bold py-2 rounded-full hover:bg-gray-300 transition-colors"
          disabled={isLocked}
        >
          {isLocked ? (
            <div className="flex items-center justify-center gap-2">
              <Image src="/icons/lock.svg" alt="locked" width={12} height={12} />
              ロック中
            </div>
          ) : (
            buttonText
          )}
        </button>
      </div>
    </div>
  );
};

export default function StudyPage() {
  const router = useRouter();
  const { isAuthenticated } = useUserStore();

  // 認証チェック
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // デモデータ
  const mockProgress = {
    currentPoints: 100,
    goalPoints: 150,
    progressPercentage: 67
  };

  const mockSoonToUnlock = [
    {
      id: 1,
      title: '地域のお店紹介サイト作成',
      matchRate: '92%',
      isLocked: true
    },
    {
      id: 2,
      title: '学校の部活動詳細ページ作成',
      matchRate: '92%',
      isLocked: true
    }
  ];

  const mockInProgress = [
    {
      id: 3,
      title: 'はじめてのWebページ',
      description: 'Webページの作成の仕方が分かるようになります',
      rating: 1,
      points: 20,
      image: null
    },
    {
      id: 4,
      title: 'Progate はじめてのJavaScript',
      description: 'JavaScriptの基礎、文字や画像が動かせるようになります',
      rating: 1,
      points: null,
      image: null
    }
  ];

  const mockRecommended = [
    {
      id: 5,
      title: 'Git超入門',
      description: 'コードの変更履歴を残せる、チームで協力してコードを...',
      rating: 1,
      points: 15,
      image: null
    }
  ];

  const mockCompleted = [
    {
      id: 6,
      title: 'Progate はじめてのWebページ',
      description: 'Webページの作成の仕方が分かるようになります',
      rating: 1,
      points: null,
      image: null
    }
  ];

  const handleButtonClick = (content) => {
    // ボタンクリック時の処理
    console.log('Button clicked for:', content.title);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 right-0 w-40 h-40 bg-green-300 rounded-full blur-3xl opacity-40" />
      <div className="absolute top-40 -left-20 w-40 h-40 bg-yellow-300 rounded-full blur-3xl opacity-40" />
      <div className="absolute top-0 left-1/3 w-40 h-40 bg-blue-300 rounded-full blur-3xl opacity-40" />
      <div className="absolute bottom-40 left-1/3 w-40 h-40 bg-blue-300 rounded-full blur-3xl opacity-40" />
      <div className="absolute bottom-0 -left-20 w-40 h-40 bg-yellow-300 rounded-full blur-3xl opacity-40" />

      {/* Progress Section */}
      <div className="px-4 py-6">
        <div className="bg-white border border-black rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-black">次のゴールまであと{100 - mockProgress.progressPercentage}%</h2>
            <Image
              src="/icons/arrow-right.svg"
              alt="expand"
              width={24}
              height={24}
              className="text-black"
            />
          </div>
          
          <div className="relative mb-4">
            <div className="w-full h-6 bg-gray-300 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-blue-400 transition-all duration-300"
                style={{ width: `${mockProgress.progressPercentage}%` }}
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">50</span>
            <div className="text-center">
              <div className="text-2xl font-bold text-black">{mockProgress.currentPoints}</div>
              <div className="text-xs text-gray-600">残り <span className="text-black font-bold">点</span></div>
            </div>
            <span className="text-gray-600">150</span>
          </div>
        </div>
      </div>

      {/* まもなく解放セクション */}
      <div className="px-4 mb-6">
        <h2 className="text-sm font-bold text-black mb-4">まもなく解放</h2>
        <div className="flex gap-4 overflow-x-auto">
          {mockSoonToUnlock.map((item) => (
            <div key={item.id} className="min-w-[240px] bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-2 mb-2">
                <Image src="/icons/lock.svg" alt="locked" width={12} height={12} />
                <span className="text-xs text-gray-600">マッチ度</span>
                <span className="text-xs font-bold text-black">{item.matchRate}</span>
              </div>
              <h3 className="text-sm font-bold text-black">{item.title}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* 進行中の学習セクション */}
      <div className="px-4 mb-6">
        <h2 className="text-sm font-bold text-black mb-4">進行中の学習</h2>
        <div className="flex gap-4 overflow-x-auto">
          {mockInProgress.map((content) => (
            <div key={content.id} className="min-w-[311px]">
              <LearningContentCard
                content={content}
                onButtonClick={handleButtonClick}
                buttonText="学習を再開する"
              />
            </div>
          ))}
        </div>
        
        {/* ページインジケーター */}
        <div className="flex justify-center mt-4 gap-2">
          <div className="w-2 h-2 bg-black rounded-full" />
          <div className="w-2 h-2 bg-gray-300 rounded-full" />
          <div className="w-2 h-2 bg-gray-300 rounded-full" />
        </div>
      </div>

      {/* 推奨学習コンテンツセクション */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-black">推奨学習コンテンツ</h2>
          <button className="text-sm font-bold text-gray-600 underline">
            完了済みの学習 →
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto">
          {mockRecommended.map((content) => (
            <div key={content.id} className="min-w-[311px]">
              <LearningContentCard
                content={content}
                onButtonClick={handleButtonClick}
                buttonText="学習をはじめる"
              />
            </div>
          ))}
          {mockCompleted.map((content) => (
            <div key={content.id} className="min-w-[311px]">
              <LearningContentCard
                content={content}
                onButtonClick={handleButtonClick}
                buttonText="学習を再開する"
              />
            </div>
          ))}
        </div>
        
        {/* ページインジケーター */}
        <div className="flex justify-center mt-4 gap-2">
          <div className="w-2 h-2 bg-black rounded-full" />
          <div className="w-2 h-2 bg-gray-300 rounded-full" />
          <div className="w-2 h-2 bg-gray-300 rounded-full" />
        </div>
      </div>
    </div>
  );
}