'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { useUIStore } from '@/store/uiStore';
import { learningAPI } from '@/lib/learningAPI';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';

export default function LearningContentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useUserStore();
  const { setLoading, addNotification } = useUIStore();
  
  const [content, setContent] = useState(null);

  // 認証チェック
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // コンテンツ詳細取得
  useEffect(() => {
    const fetchContentDetail = async () => {
      if (!params.contentId || !isAuthenticated) return;
      
      setLoading('learning', true);
      try {
        const response = await learningAPI.getLearningContentById(params.contentId);
        if (response.success) {
          setContent(response.data);
        }
      } catch (error) {
        addNotification({
          type: 'error',
          message: error.message
        });
        router.push('/study');
      } finally {
        setLoading('learning', false);
      }
    };

    fetchContentDetail();
  }, [params.contentId, isAuthenticated, setLoading, addNotification, router]);

  const handleEnrollContent = async () => {
    try {
      const response = await learningAPI.enrollContent(content.id);
      if (response.success) {
        addNotification({
          type: 'success',
          message: `「${content.title}」の受講を開始しました！`
        });
        // コンテンツ情報を更新
        setContent(prev => ({ ...prev, progress: 0 }));
      }
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.message
      });
    }
  };

  const handleCompleteChapter = async (chapterId) => {
    try {
      const response = await learningAPI.completeChapter(content.id, chapterId);
      if (response.success) {
        addNotification({
          type: 'success',
          message: `チャプターを完了しました！ +${response.data.xpGained} XP`
        });
        // チャプターの状態を更新
        setContent(prev => ({
          ...prev,
          chapters: prev.chapters.map(chapter =>
            chapter.id === chapterId ? { ...chapter, completed: true } : chapter
          )
        }));
        
        // 進捗を更新
        const completedChapters = content.chapters.filter(c => c.completed).length + 1;
        const newProgress = Math.round((completedChapters / content.chapters.length) * 100);
        setContent(prev => ({ ...prev, progress: newProgress }));
      }
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.message
      });
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return '初級';
      case 'intermediate':
        return '中級';
      case 'advanced':
        return '上級';
      default:
        return '不明';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'course':
        return '📚';
      case 'tutorial':
        return '🎯';
      case 'workshop':
        return '🛠️';
      default:
        return '📖';
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'course':
        return 'コース';
      case 'tutorial':
        return 'チュートリアル';
      case 'workshop':
        return 'ワークショップ';
      default:
        return 'コンテンツ';
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}時間${mins > 0 ? mins + '分' : ''}`;
    }
    return `${mins}分`;
  };

  const isLoading = useUIStore((state) => state.loading.learning);

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            コンテンツが見つかりません
          </h1>
          <Button onClick={() => router.push('/study')}>
            学習一覧に戻る
          </Button>
        </div>
      </div>
    );
  }

  const completedChapters = content.chapters?.filter(chapter => chapter.completed).length || 0;
  const totalChapters = content.chapters?.length || 0;
  const progressPercentage = content.progress || 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* 戻るボタン */}
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.push('/study')}
          className="mb-4"
        >
          ← 学習一覧に戻る
        </Button>
      </div>

      {/* コンテンツ詳細 */}
      <Card className="mb-6">
        {/* ヘッダー */}
        <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-6 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-2">{getTypeIcon(content.type)}</div>
            <div className="text-gray-600">{getTypeText(content.type)}</div>
          </div>
        </div>

        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(content.difficulty)}`}>
              {getDifficultyText(content.difficulty)}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {formatDuration(content.duration)}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            {content.enrolledUsers}人受講中
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {content.title}
        </h1>

        <p className="text-gray-600 mb-6 text-lg leading-relaxed">
          {content.description}
        </p>

        {/* プログレスバー（受講開始済みの場合） */}
        {progressPercentage > 0 && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span className="font-medium">学習進捗</span>
              <span>{completedChapters}/{totalChapters} チャプター完了</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-green-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="text-right text-sm text-gray-600 mt-1">
              {progressPercentage}% 完了
            </div>
          </div>
        )}

        {/* タグ */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-2">関連タグ</h3>
          <div className="flex flex-wrap gap-2">
            {content.tags?.map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* インストラクター情報 */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-3">インストラクター</h3>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-4">
              <span className="text-lg font-medium text-gray-600">
                {content.instructor?.name?.charAt(0) || 'I'}
              </span>
            </div>
            <div>
              <div className="font-medium text-gray-900">
                {content.instructor?.name || 'インストラクター'}
              </div>
              <div className="text-sm text-gray-500">
                {content.instructor?.bio || '経験豊富な講師'}
              </div>
              <div className="text-sm text-gray-500">
                ⭐ {content.rating || '4.5'} • 評価数 {Math.floor(Math.random() * 100) + 50}件
              </div>
            </div>
          </div>
        </div>

        {/* 学習目標 */}
        {content.objectives && content.objectives.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-3">🎯 学習目標</h3>
            <ul className="space-y-2">
              {content.objectives.map((objective, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span className="text-gray-700">{objective}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 前提知識 */}
        {content.prerequisites && content.prerequisites.length > 0 && (
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-3">📋 前提知識</h3>
            <ul className="space-y-1">
              {content.prerequisites.map((prerequisite, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-yellow-600 mr-2">•</span>
                  <span className="text-gray-700">{prerequisite}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* アクションボタン */}
        {progressPercentage === 0 && (
          <Button
            onClick={handleEnrollContent}
            size="lg"
            className="w-full"
          >
            このコンテンツの受講を開始する
          </Button>
        )}
      </Card>

      {/* チャプター一覧 */}
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          📖 チャプター一覧
        </h2>
        <div className="space-y-4">
          {content.chapters?.map((chapter, index) => (
            <div
              key={chapter.id}
              className={`p-4 border rounded-lg ${
                chapter.completed
                  ? 'bg-green-50 border-green-200'
                  : progressPercentage > 0
                  ? 'bg-white border-gray-200 hover:border-blue-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-3 ${
                    chapter.completed
                      ? 'bg-green-500 text-white'
                      : progressPercentage > 0
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {chapter.completed ? '✓' : index + 1}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {chapter.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {formatDuration(chapter.duration)}
                    </p>
                  </div>
                </div>
                {progressPercentage > 0 && !chapter.completed && (
                  <Button
                    size="sm"
                    onClick={() => handleCompleteChapter(chapter.id)}
                  >
                    完了する
                  </Button>
                )}
                {chapter.completed && (
                  <span className="text-green-600 text-sm font-medium">
                    完了済み
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {progressPercentage === 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center">
            <p className="text-blue-800">
              受講を開始すると、チャプターごとに学習を進めることができます
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}