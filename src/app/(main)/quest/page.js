'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { useUIStore } from '@/store/uiStore';
import { questAPI } from '@/lib/questAPI';
import QuestCard from '@/components/shared/QuestCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';

export default function QuestPage() {
  const router = useRouter();
  const { isAuthenticated } = useUserStore();
  const { setLoading, addNotification } = useUIStore();
  
  const [quests, setQuests] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    difficulty: 'all',
    status: 'available'
  });
  const [activeTab, setActiveTab] = useState('available');

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
        const filterParams = {
          ...filters,
          status: activeTab,
          difficulty: filters.difficulty === 'all' ? undefined : filters.difficulty
        };
        
        const response = await questAPI.getQuests(filterParams);
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
  }, [isAuthenticated, filters, activeTab, setLoading, addNotification]);

  const handleSearch = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const handleDifficultyChange = (e) => {
    setFilters(prev => ({ ...prev, difficulty: e.target.value }));
  };

  const handleJoinQuest = async (quest) => {
    try {
      const response = await questAPI.joinQuest(quest.id);
      if (response.success) {
        addNotification({
          type: 'success',
          message: `「${quest.title}」に参加しました！`
        });
        // クエスト一覧を再取得
        const updatedResponse = await questAPI.getQuests({
          ...filters,
          status: activeTab,
          difficulty: filters.difficulty === 'all' ? undefined : filters.difficulty
        });
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
      {/* ヘッダー */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">クエスト</h1>
        <p className="text-gray-600">
          新しいスキルを身につけて、夢の実現に近づこう
        </p>
      </div>

      {/* タブ */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('available')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'available'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              参加可能
            </button>
            <button
              onClick={() => setActiveTab('in_progress')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'in_progress'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              進行中
            </button>
          </nav>
        </div>
      </div>

      {/* フィルター */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="クエストを検索..."
            value={filters.search}
            onChange={handleSearch}
          />
        </div>
        <div className="sm:w-48">
          <select
            value={filters.difficulty}
            onChange={handleDifficultyChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">すべての難易度</option>
            <option value="beginner">初級</option>
            <option value="intermediate">中級</option>
            <option value="advanced">上級</option>
          </select>
        </div>
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
                {activeTab === 'available' ? '利用可能なクエストがありません' : '進行中のクエストがありません'}
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
    </div>
  );
}