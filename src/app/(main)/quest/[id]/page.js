'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { useUIStore } from '@/store/uiStore';
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
        // モックデータ
        const mockQuests = {
          '1': {
            id: '1',
            title: 'JavaScript基礎マスター',
            description: 'JavaScriptの基本的な構文と概念を学びます。変数、関数、ループ、条件分岐など、プログラミングの基礎をしっかりと身につけましょう。',
            difficulty: '初級',
            estimatedTime: '2-3週間',
            points: 100,
            tags: ['JavaScript', 'プログラミング基礎', 'Web開発'],
            status: 'available',
            participants: 1247,
            completionRate: 87,
            objectives: [
              '変数の宣言と使用方法を理解する',
              '関数の定義と呼び出しを習得する',
              'ループ処理（for, while）をマスターする',
              '条件分岐（if, switch）を使いこなす',
              '配列とオブジェクトの基本操作を学ぶ'
            ],
            curriculum: [
              { title: '変数とデータ型', duration: '2時間', completed: false },
              { title: '関数の基礎', duration: '3時間', completed: false },
              { title: 'ループ処理', duration: '2時間', completed: false },
              { title: '条件分岐', duration: '2時間', completed: false },
              { title: '配列とオブジェクト', duration: '3時間', completed: false },
              { title: '実践プロジェクト', duration: '4時間', completed: false }
            ],
            prerequisites: ['基本的なコンピューター操作', 'テキストエディタの使用経験'],
            benefits: [
              'プログラミングの基礎概念の理解',
              'JavaScript開発環境の構築スキル',
              '基本的なWebアプリケーション作成能力',
              '次のステップへの準備完了'
            ]
          },
          '2': {
            id: '2',
            title: 'React入門',
            description: 'モダンなWebアプリケーション開発のためのReactライブラリを学習します。コンポーネント指向の開発手法を身につけましょう。',
            difficulty: '中級',
            estimatedTime: '3-4週間',
            points: 150,
            tags: ['React', 'JavaScript', 'UI開発'],
            status: 'available',
            participants: 892,
            completionRate: 76,
            objectives: [
              'Reactの基本概念を理解する',
              'コンポーネントの作成と管理',
              'Stateとpropsの使用方法',
              'イベントハンドリングの実装',
              '実際のアプリケーション開発'
            ],
            curriculum: [
              { title: 'Reactの基礎', duration: '3時間', completed: false },
              { title: 'コンポーネント開発', duration: '4時間', completed: false },
              { title: 'State管理', duration: '3時間', completed: false },
              { title: 'イベント処理', duration: '2時間', completed: false },
              { title: 'フォーム操作', duration: '3時間', completed: false },
              { title: 'TODOアプリ作成', duration: '5時間', completed: false }
            ],
            prerequisites: ['JavaScript基礎知識', 'HTML/CSS理解', 'モダンJavaScript(ES6+)'],
            benefits: [
              'モダンUI開発スキル',
              'コンポーネント指向思考',
              'React生態系の理解',
              'フロントエンド開発者への道筋'
            ]
          }
        };

        const questData = mockQuests[questId];
        if (questData) {
          setQuest(questData);
        } else {
          router.push('/quest');
        }
      } catch (error) {
        addNotification({
          type: 'error',
          message: 'クエスト詳細の取得に失敗しました'
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

  const handleJoinQuest = () => {
    setQuest(prev => ({ ...prev, status: 'in_progress' }));
    setIsJoinModalOpen(false);
    addNotification({
      type: 'success',
      message: `「${quest.title}」に参加しました！`
    });
  };

  const handleCompleteQuest = () => {
    setQuest(prev => ({ ...prev, status: 'completed' }));
    setIsCompleteModalOpen(false);
    addNotification({
      type: 'success',
      message: `「${quest.title}」を完了しました！ポイントを獲得しました🎉`
    });
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