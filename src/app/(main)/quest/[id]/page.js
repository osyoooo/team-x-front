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
          // 期間表示を生成
          const formatDuration = (months) => {
            if (!months) return '未定';
            if (months < 1) return `${Math.round(months * 4)}週間`;
            return `${months}ヶ月`;
          };

          // APIレスポンスを詳細ページ用のフォーマットに変換
          const questData = {
            id: response.data.id,
            title: response.data.title,
            description: response.data.description || '',
            objective: response.data.objective || '',
            difficulty: getDifficultyText(response.data.difficulty_level),
            difficulty_level: response.data.difficulty_level,
            estimatedTime: formatDuration(response.data.duration_months),
            points: response.data.total_points || 0,
            points_detail: null, // 詳細ポイント情報は存在しない
            tags: response.data.skills || [],
            recommended_skills: response.data.recommended_skills || '',
            status: 'available', // デフォルトは応募可能
            participants: 0, // APIに参加者情報なし
            max_participants: 0, // APIに最大参加者情報なし
            match_rate: response.data.match_rate || 0,
            completionRate: 85, // デフォルト値
            objectives: response.data.benefits || [],
            curriculum: [], // カリキュラム情報がない場合は空配列
            prerequisites: [], // 前提条件がない場合は空配列
            prerequisite_text: response.data.prerequisite_text || '',
            prerequisite_score: response.data.prerequisite_score || 0,
            benefits: response.data.benefits || [],
            provider: response.data.provider_name || '',
            deadline: response.data.deadline || '',
            is_urgent: false, // デフォルト値
            quest_type: response.data.quest_type || ''
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
    <div>
      {/* モバイル・タブレット対応のポップアップ風レイアウト */}
      <div className="w-full bg-white border border-black overflow-hidden shadow-lg">
        {/* ヘッダーバー */}
        <div className="bg-[#CCCCCC] h-6 flex items-center justify-end px-4">
          <button 
            onClick={() => router.back()}
            className="w-4 h-4 flex items-center justify-center hover:bg-gray-300 rounded-full transition-colors"
          >
            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4">
          {/* クエスト画像とメイン情報 */}
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            {/* クエスト画像 */}
            <div className="flex-shrink-0 w-full md:w-44 h-48 bg-gray-200 rounded overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <div className="text-4xl">📚</div>
              </div>
            </div>

            {/* メイン情報 */}
            <div className="flex-1 min-w-0">
              <h1 className="text-lg md:text-xl font-bold text-black mb-3 leading-tight">{quest.title}</h1>
              
              {/* 星評価 */}
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg 
                    key={star} 
                    className={`w-3 h-3 ${star <= quest.difficulty_level ? 'text-gray-600' : 'text-gray-300'}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* マッチ度 */}
              <div className="text-sm font-bold text-black mb-3">
                マッチ度： {quest.match_rate}%
              </div>

              {/* 推奨スキル */}
              {quest.recommended_skills && (
                <div className="text-sm text-black mb-3">
                  推奨スキル： {quest.recommended_skills}
                </div>
              )}

              {/* 期間・報酬バッジ */}
              <div className="flex flex-wrap gap-2 mb-3">
                <div className="bg-[#E5E5E5] rounded-full px-3 py-1">
                  <span className="text-black text-center text-xs">
                    期間：{quest.estimatedTime}
                  </span>
                </div>
                <div className="bg-[#E5E5E5] rounded-full px-3 py-1">
                  <span className="text-black text-center text-xs">
                    報酬：+{quest.points}
                  </span>
                </div>
              </div>

              {/* 獲得スコア */}
              {quest.points > 0 && (
                <div className="text-sm text-black mb-3">
                  獲得スコア： +{quest.points}
                </div>
              )}
            </div>
          </div>

          {/* 提供団体 */}
          <div className="text-sm text-black mb-6">
            提供団体：{quest.provider}
          </div>

          {/* 参加条件 */}
          <div className="mb-6">
            <div className="text-sm text-black mb-2">参加条件：</div>
            <div className="text-sm text-black ml-2 space-y-1">
              {quest.prerequisite_score > 0 && (
                <div>スコア{quest.prerequisite_score}点以上</div>
              )}
              {quest.prerequisite_text && (
                <div>{quest.prerequisite_text}</div>
              )}
              {quest.tags.map((skill, index) => (
                <div key={index}>{skill.skill_name || skill.name || skill}</div>
              ))}
            </div>
          </div>

          {/* 目的 */}
          {quest.objective && (
            <div className="mb-6">
              <div className="text-sm font-bold text-black mb-2">目的：</div>
              <div className="text-sm text-black">
                {quest.objective}
              </div>
            </div>
          )}

          {/* 概要 */}
          {quest.description && (
            <div className="mb-6">
              <div className="text-sm font-bold text-black mb-2">概要：</div>
              <div className="text-sm text-black">
                {quest.description}
              </div>
            </div>
          )}

          {/* クエストクリア特典 */}
          {quest.benefits.length > 0 && (
            <div className="border border-black p-4 rounded mb-6">
              <div className="text-sm font-bold text-black mb-2">クエストクリア特典</div>
              <div className="space-y-1">
                {quest.benefits.map((benefit, index) => (
                  <div key={index} className="text-sm text-black">
                    {benefit.benefit_name || benefit.name || (typeof benefit === 'string' ? benefit : '')}
                    {benefit.benefit_type === 'recommendation' && ' （昨年実績：参加者の80%が推薦獲得）'}
                  </div>
                ))}
              </div>
              <div className="text-sm text-black mt-2">
                地域連携推薦入試の実績として活用可能
              </div>
            </div>
          )}

          {/* アクションボタン */}
          <div className="flex gap-3 justify-center">
            <button className="bg-[#E5E5E5] text-black font-bold text-xs px-16 py-2 rounded-full hover:bg-gray-300 transition-colors">
              あとで挑戦する
            </button>
            {quest.status === 'available' && (
              <button 
                onClick={() => setIsJoinModalOpen(true)}
                className="bg-black text-white font-bold text-xs px-16 py-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                クエストに挑戦する
              </button>
            )}
            {quest.status === 'in_progress' && (
              <button 
                onClick={() => setIsCompleteModalOpen(true)}
                className="bg-black text-white font-bold text-xs px-16 py-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                完了報告
              </button>
            )}
            {quest.status === 'completed' && (
              <button 
                disabled
                className="bg-gray-400 text-white font-bold text-xs px-16 py-2 rounded-full cursor-not-allowed"
              >
                完了済み ✓
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 従来のカリキュラムセクション（必要に応じて表示） */}
      {quest.curriculum.length > 0 && (
        <div className="max-w-md mx-auto md:max-w-2xl lg:max-w-4xl mt-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
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
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{display: 'none'}}>
        {/* メインコンテンツ */}
        <div className="lg:col-span-2 space-y-6">
          {/* 学習目標 */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 学習目標</h3>
            <ul className="space-y-2">
              {quest.objectives.map((objective, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span className="text-gray-700">{objective.benefit_name || objective.name || (typeof objective === 'string' ? objective : '')}</span>
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
                  <span className="text-gray-700 text-sm">{benefit.benefit_name || benefit.name || (typeof benefit === 'string' ? benefit : '')}</span>
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