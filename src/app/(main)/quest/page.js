'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { useUIStore } from '@/store/uiStore';
import { questAPI } from '@/lib/questAPI';
import QuestCard from '@/components/shared/QuestCard';
import Spinner from '@/components/ui/Spinner';
import Tabs from '@/components/ui/Tabs';

export default function QuestPage() {
  const router = useRouter();
  const { isAuthenticated } = useUserStore();
  const { addNotification } = useUIStore();
  
  const [availableQuests, setAvailableQuests] = useState([]);
  const [inProgressQuests, setInProgressQuests] = useState([]);
  const [upcomingQuests, setUpcomingQuests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available');
  const [isAvailableExpanded, setIsAvailableExpanded] = useState(false);

  // タブ設定
  const tabs = [
    { id: 'available', label: '応募可能' },
    { id: 'in_progress', label: '進行中' },
  ];

  // 認証チェック
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // クエスト一覧取得
  useEffect(() => {
    const fetchAllQuests = async () => {
      setIsLoading(true);
      try {
        // 3つのAPI呼び出しを並行実行
        const [availableResponse, inProgressResponse, upcomingResponse] = await Promise.all([
          questAPI.getAvailableQuests(),
          questAPI.getInProgressQuests(),
          questAPI.getUpcomingQuests()
        ]);

        if (availableResponse.success) {
          setAvailableQuests(availableResponse.data.quests);
        }
        if (inProgressResponse.success) {
          setInProgressQuests(inProgressResponse.data.quests);
        }
        if (upcomingResponse.success) {
          setUpcomingQuests(upcomingResponse.data.quests);
        }
      } catch (error) {
        addNotification({
          type: 'error',
          message: error.message
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchAllQuests();
    }
  }, [isAuthenticated, addNotification]);


  const handleJoinQuest = async (quest) => {
    try {
      const response = await questAPI.joinQuest(quest.id);
      if (response.success) {
        addNotification({
          type: 'success',
          message: `「${quest.title}」に参加しました！`
        });
        // クエスト一覧を再取得
        const [availableResponse, inProgressResponse, upcomingResponse] = await Promise.all([
          questAPI.getAvailableQuests(),
          questAPI.getInProgressQuests(),
          questAPI.getUpcomingQuests()
        ]);

        if (availableResponse.success) {
          setAvailableQuests(availableResponse.data.quests);
        }
        if (inProgressResponse.success) {
          setInProgressQuests(inProgressResponse.data.quests);
        }
        if (upcomingResponse.success) {
          setUpcomingQuests(upcomingResponse.data.quests);
        }
      }
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.message
      });
    }
  };



  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-transparent">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            {/* タブ */}
            <div className="mb-6 flex justify-start">
              <Tabs 
                tabs={tabs} 
                activeTab={activeTab} 
                setActiveTab={setActiveTab}
              />
            </div>

            {/* タブ内容 */}
            <div className="mb-12">
              {activeTab === 'available' ? (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availableQuests.length > 0 ? (
                      // 表示する件数を制御
                      (availableQuests.length <= 4 || isAvailableExpanded 
                        ? availableQuests 
                        : availableQuests.slice(0, 4)
                      ).map((quest) => (
                        <QuestCard
                          key={quest.id}
                          quest={quest}
                          onJoin={handleJoinQuest}
                        />
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12">
                        <div className="text-gray-500">応募可能なクエストがありません</div>
                      </div>
                    )}
                  </div>
                  
                  {/* 折りたたみボタン（5件以上の場合のみ表示） */}
                  {availableQuests.length > 4 && (
                    <div className="flex justify-center mt-6">
                      <button
                        onClick={() => setIsAvailableExpanded(!isAvailableExpanded)}
                        className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors duration-200"
                      >
                        {isAvailableExpanded ? (
                          <>
                            <span>折りたたむ</span>
                            <svg className="w-4 h-4 transform transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </>
                        ) : (
                          <>
                            <span>さらに表示 (+{availableQuests.length - 4}件)</span>
                            <svg className="w-4 h-4 transform transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {inProgressQuests.length > 0 ? (
                    inProgressQuests.map((quest) => (
                      <QuestCard
                        key={quest.id}
                        quest={quest}
                        userQuest={true}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <div className="text-gray-500 mb-4">進行中のクエストがありません</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* まもなく解放セクション */}
            <section>
              <h2 className="text-lg font-bold text-black mb-6">まもなく解放</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingQuests.length > 0 ? (
                  upcomingQuests.map((quest) => (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                      isUpcoming={true}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="text-gray-500">まもなく解放されるクエストがありません</div>
                  </div>
                )}
              </div>
            </section>

            {/* 完了済みのクエスト */}
            <div className="mt-8 flex items-center justify-end">
              <span className="text-sm font-bold text-gray-600 mr-2">完了済みのクエスト</span>
              <svg className="w-3 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </>
        )}
      </div>
    </div>
  );
}