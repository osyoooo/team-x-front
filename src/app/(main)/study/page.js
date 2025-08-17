'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { useUIStore } from '@/store/uiStore';
import { learningAPI } from '@/lib/learningAPI';
import LearningCard from '@/components/shared/LearningCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';

export default function StudyPage() {
  const router = useRouter();
  const { isAuthenticated } = useUserStore();
  const { setLoading, addNotification } = useUIStore();
  
  const [learningContent, setLearningContent] = useState([]);
  const [progress, setProgress] = useState(null);
  const [recommendedContent, setRecommendedContent] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    difficulty: 'all',
    type: 'all'
  });
  const [activeTab, setActiveTab] = useState('all');

  // 認証チェック
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // 学習コンテンツとプログレス取得
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) return;
      
      setLoading('learning', true);
      try {
        const [contentResponse, progressResponse, recommendedResponse] = await Promise.all([
          learningAPI.getLearningContent(filters),
          learningAPI.getLearningProgress(),
          learningAPI.getRecommendedContent()
        ]);

        if (contentResponse.success) {
          setLearningContent(contentResponse.data.content);
          if (contentResponse.data.categories) {
            setCategories(contentResponse.data.categories);
          }
        }

        if (progressResponse.success) {
          setProgress(progressResponse.data);
        }

        if (recommendedResponse.success) {
          setRecommendedContent(recommendedResponse.data);
        }
      } catch (error) {
        addNotification({
          type: 'error',
          message: error.message
        });
      } finally {
        setLoading('learning', false);
      }
    };

    fetchData();
  }, [isAuthenticated, filters, setLoading, addNotification]);

  const handleSearch = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const handleCategoryChange = (e) => {
    setFilters(prev => ({ ...prev, category: e.target.value }));
  };

  const handleDifficultyChange = (e) => {
    setFilters(prev => ({ ...prev, difficulty: e.target.value }));
  };

  const handleTypeChange = (e) => {
    setFilters(prev => ({ ...prev, type: e.target.value }));
  };

  const handleEnrollContent = async (content) => {
    try {
      const response = await learningAPI.enrollContent(content.id);
      if (response.success) {
        addNotification({
          type: 'success',
          message: `「${content.title}」の受講を開始しました！`
        });
        // コンテンツ一覧を再取得
        const updatedResponse = await learningAPI.getLearningContent(filters);
        if (updatedResponse.success) {
          setLearningContent(updatedResponse.data.content);
        }
      }
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.message
      });
    }
  };

  const handleViewDetails = (content) => {
    router.push(`/study/${content.id}`);
  };

  const handleContinueLearning = (content) => {
    router.push(`/study/${content.id}`);
  };

  const getFilteredContent = () => {
    switch (activeTab) {
      case 'inProgress':
        return learningContent.filter(content => content.progress > 0 && content.progress < 100);
      case 'completed':
        return learningContent.filter(content => content.progress === 100);
      default:
        return learningContent;
    }
  };

  const weeklyProgressPercentage = progress ? (progress.weeklyProgress / progress.weeklyGoal) * 100 : 0;
  const isLoading = useUIStore((state) => state.loading.learning);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* ヘッダー */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">学習</h1>
        <p className="text-gray-600">
          あなたのペースで新しいスキルを身につけよう
        </p>
      </div>

      {/* 学習ダッシュボード */}
      {progress && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card padding="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{progress.totalContentEnrolled}</div>
              <div className="text-sm text-gray-600">受講中コンテンツ</div>
            </div>
          </Card>
          <Card padding="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{progress.totalContentCompleted}</div>
              <div className="text-sm text-gray-600">完了コンテンツ</div>
            </div>
          </Card>
          <Card padding="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{progress.totalHoursLearned}h</div>
              <div className="text-sm text-gray-600">総学習時間</div>
            </div>
          </Card>
          <Card padding="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{progress.currentStreak}日</div>
              <div className="text-sm text-gray-600">継続日数</div>
            </div>
          </Card>
        </div>
      )}

      {/* 週間目標 */}
      {progress && (
        <Card className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📅 今週の学習目標</h3>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">進捗</span>
            <span className="text-gray-900 font-medium">
              {progress.weeklyProgress}h / {progress.weeklyGoal}h
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(weeklyProgressPercentage, 100)}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">
            {weeklyProgressPercentage >= 100 
              ? '🎉 今週の目標を達成しました！' 
              : `目標達成まで あと${progress.weeklyGoal - progress.weeklyProgress}時間です`
            }
          </p>
        </Card>
      )}

      {/* おすすめコンテンツ */}
      {recommendedContent.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🌟 おすすめコンテンツ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedContent.map((content) => (
              <LearningCard
                key={content.id}
                content={content}
                onEnroll={handleEnrollContent}
                onViewDetails={handleViewDetails}
                onContinue={handleContinueLearning}
                showProgress={content.progress > 0}
              />
            ))}
          </div>
        </div>
      )}

      {/* タブ */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'all'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              すべて
            </button>
            <button
              onClick={() => setActiveTab('inProgress')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'inProgress'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              受講中
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'completed'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              完了済み
            </button>
          </nav>
        </div>
      </div>

      {/* フィルター */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          placeholder="コンテンツを検索..."
          value={filters.search}
          onChange={handleSearch}
        />
        <select
          value={filters.category}
          onChange={handleCategoryChange}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">すべてのカテゴリ</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name} ({category.count})
            </option>
          ))}
        </select>
        <select
          value={filters.difficulty}
          onChange={handleDifficultyChange}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">すべての難易度</option>
          <option value="beginner">初級</option>
          <option value="intermediate">中級</option>
          <option value="advanced">上級</option>
        </select>
        <select
          value={filters.type}
          onChange={handleTypeChange}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">すべてのタイプ</option>
          <option value="course">コース</option>
          <option value="tutorial">チュートリアル</option>
          <option value="workshop">ワークショップ</option>
        </select>
      </div>

      {/* コンテンツ一覧 */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getFilteredContent().length > 0 ? (
            getFilteredContent().map((content) => (
              <LearningCard
                key={content.id}
                content={content}
                onEnroll={handleEnrollContent}
                onViewDetails={handleViewDetails}
                onContinue={handleContinueLearning}
                showProgress={content.progress > 0}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 mb-4">
                {activeTab === 'inProgress' 
                  ? '受講中のコンテンツがありません' 
                  : activeTab === 'completed'
                  ? '完了したコンテンツがありません'
                  : 'コンテンツが見つかりません'
                }
              </div>
              {(activeTab === 'inProgress' || activeTab === 'completed') && (
                <Button onClick={() => setActiveTab('all')}>
                  すべてのコンテンツを見る
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}