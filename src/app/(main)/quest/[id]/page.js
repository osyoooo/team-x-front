'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { useUIStore } from '@/store/uiStore';
import { questAPI } from '@/lib/questAPI';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Modal, { ConfirmModal } from '@/components/ui/Modal';

export default function QuestDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useUserStore();
  const { addNotification } = useUIStore();
  
  const [quest, setQuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  // 認証チェック
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // クエストデータの取得
  useEffect(() => {
    const fetchQuestDetail = async (questId) => {
      try {
        setLoading(true);
        const response = await questAPI.getQuestById(questId);
        
        if (response.success && response.data) {
          // APIレスポンスを詳細ページ用のフォーマットに変換
          const questData = {
            id: response.data.id,
            title: response.data.title,
            description: response.data.description || response.data.objective || '',
            difficulty: getDifficultyText(response.data.difficulty_level),
            estimatedTime: response.data.duration_display || '未定',
            points: parseInt(response.data.points_display?.replace(/[^\d]/g, '') || '0'),
            tags: response.data.skills || [],
            status: 'available', // デフォルトは応募可能
            participants: parseInt(response.data.participants_display?.replace(/[^\d]/g, '') || '0'),
            completionRate: 85, // デフォルト値（APIに含まれていない場合）
            objectives: response.data.benefits || [],
            curriculum: [], // カリキュラム情報がない場合は空配列
            prerequisites: [], // 前提条件がない場合は空配列
            benefits: response.data.benefits || [],
            provider: response.data.provider_name || response.data.provider
          };
          setQuest(questData);
        } else {
          throw new Error('クエストデータの取得に失敗しました');
        }
      } catch (error) {
        console.error('Quest detail fetch error:', error);
        addNotification({
          type: 'error',
          message: error.message || 'クエスト詳細の取得に失敗しました'
        });
        router.push('/quest');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && params.id) {
      fetchQuestDetail(params.id);
    }
  }, [isAuthenticated, params.id, router, addNotification]);

  const handleJoinQuest = async () => {
    try {
      const response = await questAPI.joinQuest(quest.id);
      if (response.success) {
        setQuest(prev => ({ ...prev, status: 'in_progress' }));
        setIsJoinModalOpen(false);
        addNotification({
          type: 'success',
          message: response.message || `「${quest.title}」に参加しました！`
        });
      }
    } catch (error) {
      console.error('Join quest error:', error);
      addNotification({
        type: 'error',
        message: error.message || 'クエストへの参加に失敗しました'
      });
      setIsJoinModalOpen(false);
    }
  };

  const handleCompleteQuest = () => {
    setQuest(prev => ({ ...prev, status: 'completed' }));
    setIsCompleteModalOpen(false);
    addNotification({
      type: 'success',
      message: `「${quest.title}」を完了しました！ポイントを獲得しました🎉`
    });
  };

  const getDifficultyText = (level) => {
    switch (level) {
      case 1:
      case 2: return '初級';
      case 3: return '中級';
      case 4:
      case 5: return '上級';
      default: return '未定';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case '初級': return 'bg-green-100 text-green-800';
      case '中級': return 'bg-yellow-100 text-yellow-800';
      case '上級': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'available': return { text: '参加可能', color: 'text-blue-600' };
      case 'in_progress': return { text: '進行中', color: 'text-orange-600' };
      case 'completed': return { text: '完了済み', color: 'text-green-600' };
      default: return { text: '不明', color: 'text-gray-600' };
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">クエストが見つかりません</h2>
          <Button onClick={() => router.push('/quest')}>
            クエスト一覧に戻る
          </Button>
        </div>
      </div>
    );
  }

  const statusDisplay = getStatusDisplay(quest.status);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* ヘッダー */}
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="mb-4"
        >
          ← 戻る
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{quest.title}</h1>
            <p className="text-gray-600 mb-4">{quest.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(quest.difficulty)}`}>
                {quest.difficulty}
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {quest.estimatedTime}
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                {quest.points}pt
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusDisplay.color}`}>
                {statusDisplay.text}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {quest.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {quest.status === 'available' && (
              <Button onClick={() => setIsJoinModalOpen(true)}>
                クエストに参加
              </Button>
            )}
            {quest.status === 'in_progress' && (
              <Button onClick={() => setIsCompleteModalOpen(true)}>
                完了報告
              </Button>
            )}
            {quest.status === 'completed' && (
              <Button disabled>
                完了済み ✓
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* メインコンテンツ */}
        <div className="lg:col-span-2 space-y-6">
          {/* 学習目標 */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 学習目標</h3>
            <ul className="space-y-2">
              {quest.objectives.map((objective, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span className="text-gray-700">{objective}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* カリキュラム */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 カリキュラム</h3>
            <div className="space-y-3">
              {quest.curriculum.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${
                      item.completed ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      {item.completed ? (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="text-white text-xs">{index + 1}</span>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{item.title}</div>
                      <div className="text-sm text-gray-500">{item.duration}</div>
                    </div>
                  </div>
                  {quest.status === 'in_progress' && !item.completed && (
                    <Button size="sm" variant="outline">
                      開始
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* 前提条件 */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 前提条件</h3>
            <ul className="space-y-2">
              {quest.prerequisites.map((prerequisite, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-orange-600 mr-2">•</span>
                  <span className="text-gray-700">{prerequisite}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* サイドバー */}
        <div className="space-y-6">
          {/* 統計情報 */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 統計情報</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>参加者数</span>
                  <span>{quest.participants.toLocaleString()}人</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>完了率</span>
                  <span>{quest.completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${quest.completionRate}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* 獲得できるスキル */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 獲得できるスキル</h3>
            <ul className="space-y-2">
              {quest.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-gray-700 text-sm">{benefit}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      {/* 参加確認モーダル */}
      <ConfirmModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onConfirm={handleJoinQuest}
        title="クエストに参加"
        message={`「${quest?.title}」に参加しますか？参加後は学習を進めて完了を目指しましょう。`}
        confirmText="参加する"
        cancelText="キャンセル"
      />

      {/* 完了確認モーダル */}
      <ConfirmModal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        onConfirm={handleCompleteQuest}
        title="クエスト完了"
        message={`「${quest?.title}」を完了しましたか？完了すると${quest?.points}ポイントを獲得できます。`}
        confirmText="完了する"
        cancelText="まだ完了していない"
        variant="primary"
      />
    </div>
  );
}