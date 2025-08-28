'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { apiClient } from '@/lib/api';
import Image from 'next/image';

// 学習コンテンツカードコンポーネント
const LearningContentCard = ({ content, isLocked = false, onButtonClick, buttonText }) => {
  const StarRating = ({ rating = 1 }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <div key={star} className={`w-2 h-2 ${star <= rating ? "bg-[#575757]" : "bg-[#D9D9D9]"}`} 
               style={{clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"}} />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white bg-opacity-90 backdrop-blur rounded shadow-lg overflow-hidden">
      {/* 画像エリア */}
      <div className="h-28 bg-gradient-to-br from-green-200 to-blue-200 relative">
        {content.cover_image_url || content.image ? (
          <img
            src={content.cover_image_url || content.image}
            alt={content.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-200 to-blue-200 flex items-center justify-center">
            <span className="text-white text-4xl">🎯</span>
          </div>
        )}
        {content.points && (
          <div className="absolute top-2 right-2 bg-[#62A728] text-white text-xs font-bold px-2 py-1 rounded-full">
            +{content.points}
          </div>
        )}
      </div>
      
      {/* コンテンツエリア */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-xs text-black">{content.title}</h3>
          <StarRating rating={content.rating} />
        </div>
        <p className="text-[10px] text-gray-600 mb-2 line-clamp-2">{content.description}</p>
        
        <div className="flex items-center justify-end mb-3">
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
          className="w-full bg-[#CCCCCC] text-black text-[10px] font-bold py-1 rounded-full hover:bg-gray-300 transition-colors"
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
  
  // State management for API data
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Carousel state
  const [currentOngoingIndex, setCurrentOngoingIndex] = useState(0);
  const [currentRecommendedIndex, setCurrentRecommendedIndex] = useState(0);
  
  // Refs for scroll containers
  const ongoingScrollRef = useRef(null);
  const recommendedScrollRef = useRef(null);

  // API client function for study dashboard using existing API client
  const fetchStudyDashboard = async () => {
    try {
      setLoading(true);
      const data = await apiClient.get('/api/v1/study/dashboard');
      setDashboardData(transformApiData(data));
      setError(null);
    } catch (err) {
      console.error('Error fetching study dashboard:', err);
      setError(err.message);
      // Fallback to mock data on error
      setDashboardData(getMockData());
    } finally {
      setLoading(false);
    }
  };

  // Transform API data to match component structure
  const transformApiData = (apiData) => {
    if (!apiData) return getMockData();
    
    return {
      goal: apiData.goal,
      ongoing: apiData.ongoing || [],
      recommended: apiData.recommended || [],
      // Create mock locked content since API doesn't provide this yet
      lockedContent: [
        {
          id: 1,
          title: '地域のお店紹介サイト作成',
          unlockCondition: { message: 'マッチ度 92%' },
          isLocked: true
        },
        {
          id: 2,
          title: '学校の部活動詳細ページ作成',
          unlockCondition: { message: 'マッチ度 92%' },
          isLocked: true
        }
      ]
    };
  };

  // Mock data fallback
  const getMockData = () => ({
    goal: {
      current_score: 100,
      next_goal_score: 150,
      progress_percent: 33,
      remaining_percent: 67,
      remaining_text: "次のゴールまであと67%"
    },
    ongoing: [
      {
        id: 3,
        title: 'はじめてのWebページ',
        cover_image_url: null,
        provider_name: 'Progate',
        total_score: 20,
        progress_percent: 0
      },
      {
        id: 4,
        title: 'はじめてのJavaScript',
        cover_image_url: null,
        provider_name: 'Progate',
        total_score: 30,
        progress_percent: 0
      }
    ],
    recommended: [
      {
        id: 5,
        title: 'Git超入門',
        cover_image_url: null,
        provider_name: 'Progate',
        total_score: 15
      }
    ],
    lockedContent: [
      {
        id: 1,
        title: '地域のお店紹介サイト作成',
        unlockCondition: { message: 'マッチ度 92%' },
        isLocked: true
      },
      {
        id: 2,
        title: '学校の部活動詳細ページ作成',
        unlockCondition: { message: 'マッチ度 92%' },
        isLocked: true
      }
    ]
  });

  // 認証チェックとデータ取得
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    fetchStudyDashboard();
  }, [isAuthenticated, router]);

  const handleButtonClick = (content) => {
    // ボタンクリック時の処理
    console.log('Button clicked for:', content.title);
  };

  // Scroll handlers for carousel navigation
  const handleOngoingScroll = () => {
    if (ongoingScrollRef.current) {
      const scrollLeft = ongoingScrollRef.current.scrollLeft;
      const cardWidth = 311 + 16; // card width + gap
      const newIndex = Math.round(scrollLeft / cardWidth);
      setCurrentOngoingIndex(newIndex);
    }
  };

  const handleRecommendedScroll = () => {
    if (recommendedScrollRef.current) {
      const scrollLeft = recommendedScrollRef.current.scrollLeft;
      const cardWidth = 311 + 16; // card width + gap
      const newIndex = Math.round(scrollLeft / cardWidth);
      setCurrentRecommendedIndex(newIndex);
    }
  };

  // Dot navigation handlers
  const scrollToOngoingCard = (index) => {
    if (ongoingScrollRef.current) {
      const cardWidth = 311 + 16; // card width + gap
      ongoingScrollRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
    }
  };

  const scrollToRecommendedCard = (index) => {
    if (recommendedScrollRef.current) {
      const cardWidth = 311 + 16; // card width + gap
      recommendedScrollRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">学習データを読み込んでいます...</p>
        </div>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">データの読み込みに失敗しました</p>
          <button 
            onClick={fetchStudyDashboard}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            再試行
          </button>
        </div>
      </div>
    );
  }

  const data = dashboardData || getMockData();

  return (
    <div className="relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 right-0 w-40 h-40 bg-green-300 rounded-full blur-3xl opacity-40 z-[-1]" />
      <div className="absolute top-40 -left-20 w-40 h-40 bg-yellow-300 rounded-full blur-3xl opacity-40 z-[-1]" />
      <div className="absolute top-0 left-1/3 w-40 h-40 bg-blue-300 rounded-full blur-3xl opacity-40 z-[-1]" />
      <div className="absolute bottom-40 left-1/3 w-40 h-40 bg-blue-300 rounded-full blur-3xl opacity-40 z-[-1]" />
      <div className="absolute bottom-0 -left-20 w-40 h-40 bg-yellow-300 rounded-full blur-3xl opacity-40 z-[-1]" />

      {/* Progress Section */}
      <div className="relative z-10 px-4 py-6">
        <div className="bg-white border border-black rounded-lg px-6 pt-4 pb-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xs font-bold text-black">{data.goal.remaining_text}</h2>
            <Image
              src="/icons/arrow-right.svg"
              alt="expand"
              width={24}
              height={12}
              className="rotate-90"
            />
          </div>
          
          <div className="relative mb-2">
            <div className="w-full h-[22px] bg-[#D9D9D9] rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-[#74FBFC] to-[#AEEE31] rounded-full relative top-1 left-1"
                style={{ width: `calc(${data.goal.progress_percent}% - 8px)`, height: '14px' }}
              />
            </div>
          </div>
          
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold text-[#9D9C9C]">50</span>
            <div className="text-center -mt-1">
              <div className="text-2xl font-bold text-black">{data.goal.current_score}</div>
              <div className="flex items-center gap-1 text-[8px] text-[#575757]">
                <span>残り</span>
                <span className="ml-12">点</span>
              </div>
            </div>
            <span className="text-sm font-bold text-[#9D9C9C]">{data.goal.next_goal_score}</span>
          </div>
        </div>
      </div>

      {/* まもなく解放セクション */}
      <div className="relative z-10 px-4 mb-6">
        <h2 className="text-sm font-bold text-black mb-4">まもなく解放</h2>
        <div className="flex gap-4 overflow-x-auto">
          {data.lockedContent.map((item) => (
            <div key={item.id} className="min-w-[280px] bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image src="/icons/lock.svg" alt="locked" width={16} height={16} />
                  <h3 className="text-xs font-bold text-black">{item.title}</h3>
                </div>
                <div className="flex flex-col items-end text-xs">
                  <span className="text-gray-600 text-[10px]">マッチ度</span>
                  <span className="font-bold text-black">92%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 進行中の学習セクション */}
      <div className="relative z-10 px-4 mb-6">
        <h2 className="text-sm font-bold text-black mb-4">進行中の学習</h2>
        <div 
          ref={ongoingScrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
          onScroll={handleOngoingScroll}
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {data.ongoing.map((content) => (
            <div 
              key={content.id} 
              className="min-w-[311px] flex-shrink-0"
              style={{ scrollSnapAlign: 'start' }}
            >
              <LearningContentCard
                content={{
                  ...content,
                  description: `${content.provider_name}の学習コンテンツ`,
                  rating: 1,
                  points: content.total_score
                }}
                onButtonClick={handleButtonClick}
                buttonText="学習を再開する"
              />
            </div>
          ))}
        </div>
        
        {/* ページインジケーター */}
        <div className="flex justify-center mt-4 gap-2">
          {data.ongoing.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToOngoingCard(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentOngoingIndex ? 'bg-black' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 推奨学習コンテンツセクション */}
      <div className="relative z-10 px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-black">推奨学習コンテンツ</h2>
          <button className="text-sm font-bold text-gray-600 underline">
            完了済みの学習 →
          </button>
        </div>
        <div 
          ref={recommendedScrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
          onScroll={handleRecommendedScroll}
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {data.recommended.map((content) => (
            <div 
              key={content.id} 
              className="min-w-[311px] flex-shrink-0"
              style={{ scrollSnapAlign: 'start' }}
            >
              <LearningContentCard
                content={{
                  ...content,
                  description: `${content.provider_name}の学習コンテンツ`,
                  rating: 1,
                  points: content.total_score
                }}
                onButtonClick={handleButtonClick}
                buttonText="学習をはじめる"
              />
            </div>
          ))}
        </div>
        
        {/* ページインジケーター */}
        <div className="flex justify-center mt-4 gap-2">
          {data.recommended.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToRecommendedCard(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentRecommendedIndex ? 'bg-black' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}