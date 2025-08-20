'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { useUIStore } from '@/store/uiStore';
import { questAPI } from '@/lib/questAPI';
import QuestCard from '@/components/shared/QuestCard';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Tabs from '@/components/ui/Tabs';

export default function QuestPage() {
  const router = useRouter();
  const { isAuthenticated } = useUserStore();
  const { setLoading, addNotification } = useUIStore();
  
  const [quests, setQuests] = useState([]);
  const [activeTab, setActiveTab] = useState('available');

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
    const fetchQuests = async () => {
      setLoading('quests', true);
      try {
        const response = await questAPI.getQuests({ status: activeTab });
        if (response.success) {
          setQuests(response.data.quests);
        }
      } catch (error) {
        addNotification({
          type: 'error',
          message: error.message
        });
      } finally {
        setLoading('quests', false);
      }
    };

    if (isAuthenticated) {
      fetchQuests();
    }
  }, [isAuthenticated, activeTab, setLoading, addNotification]);


  const handleJoinQuest = async (quest) => {
    try {
      const response = await questAPI.joinQuest(quest.id);
      if (response.success) {
        addNotification({
          type: 'success',
          message: `「${quest.title}」に参加しました！`
        });
        // クエスト一覧を再取得
        const updatedResponse = await questAPI.getQuests({ status: activeTab });
        if (updatedResponse.success) {
          setQuests(updatedResponse.data.quests);
        }
      }
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.message
      });
    }
  };

  const handleViewDetails = (quest) => {
    router.push(`/quest/${quest.id}`);
  };

  const isLoading = useUIStore((state) => state.loading.quests);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* タブ */}
      <div className="mb-6 flex justify-center">
        <Tabs 
          tabs={tabs} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
        />
      </div>


      {/* クエスト一覧 */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quests.length > 0 ? (
            quests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onJoin={handleJoinQuest}
                onViewDetails={handleViewDetails}
                userQuest={activeTab === 'in_progress'}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 mb-4">
                {activeTab === 'available' ? '応募可能なクエストがありません' : '進行中のクエストがありません'}
              </div>
              {activeTab === 'in_progress' && (
                <Button onClick={() => setActiveTab('available')}>
                  新しいクエストを探す
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* 完了済みのクエスト */}
      <div className="mt-8 flex items-center justify-end">
        <span className="text-sm font-bold text-gray-600 mr-2">完了済みのクエスト</span>
        <svg className="w-3 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
}