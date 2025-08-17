'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { useUIStore } from '@/store/uiStore';
import { growthAPI } from '@/lib/growthAPI';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';

export default function GrowthPage() {
  const router = useRouter();
  const { isAuthenticated } = useUserStore();
  const { setLoading, addNotification } = useUIStore();
  
  const [timeline, setTimeline] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [activeTab, setActiveTab] = useState('timeline');
  const [filters, setFilters] = useState({
    type: 'all',
    period: 'all'
  });

  // 認証チェック
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // データ取得
  useEffect(() => {
    const fetchGrowthData = async () => {
      if (!isAuthenticated) return;
      
      setLoading('growth', true);
      try {
        const [timelineResponse, statsResponse, achievementsResponse, milestonesResponse] = await Promise.all([
          growthAPI.getGrowthTimeline(filters),
          growthAPI.getGrowthStatistics(),
          growthAPI.getAchievements(),
          growthAPI.getMilestones()
        ]);

        if (timelineResponse.success) {
          setTimeline(timelineResponse.data.timeline);
        }

        if (statsResponse.success) {
          setStatistics(statsResponse.data);
        }

        if (achievementsResponse.success) {
          setAchievements(achievementsResponse.data);
        }

        if (milestonesResponse.success) {
          setMilestones(milestonesResponse.data);
        }
      } catch (error) {
        addNotification({
          type: 'error',
          message: error.message
        });
      } finally {
        setLoading('growth', false);
      }
    };

    fetchGrowthData();
  }, [isAuthenticated, filters, setLoading, addNotification]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'quest_completed':
        return '🎯';
      case 'learning_completed':
        return '📚';
      case 'skill_level_up':
        return '⬆️';
      case 'streak_milestone':
        return '🔥';
      case 'profile_updated':
        return '👤';
      case 'quest_joined':
        return '🚀';
      case 'account_created':
        return '🎉';
      default:
        return '✨';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'quest_completed':
        return 'bg-green-100 text-green-800';
      case 'learning_completed':
        return 'bg-blue-100 text-blue-800';
      case 'skill_level_up':
        return 'bg-purple-100 text-purple-800';
      case 'streak_milestone':
        return 'bg-orange-100 text-orange-800';
      case 'profile_updated':
        return 'bg-gray-100 text-gray-800';
      case 'quest_joined':
        return 'bg-indigo-100 text-indigo-800';
      case 'account_created':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '昨日';
    if (diffDays < 7) return `${diffDays}日前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}週間前`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}ヶ月前`;
    return `${Math.floor(diffDays / 365)}年前`;
  };

  const currentLevel = statistics ? Math.floor(statistics.totalXP / 100) + 1 : 1;
  const xpToNext = statistics ? (currentLevel * 100) - statistics.totalXP : 100;
  const levelProgress = statistics ? ((statistics.totalXP % 100) / 100) * 100 : 0;

  const isLoading = useUIStore((state) => state.loading.growth);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* ヘッダー */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">成長記録</h1>
        <p className="text-gray-600">
          あなたの学習の軌跡と達成した成果を振り返りましょう
        </p>
      </div>

      {/* 統計ダッシュボード */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card padding="p-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{statistics.totalXP}</div>
              <div className="text-sm text-gray-600">総経験値</div>
              <div className="text-xs text-gray-500 mt-1">レベル {currentLevel}</div>
            </div>
          </Card>
          <Card padding="p-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{statistics.questsCompleted}</div>
              <div className="text-sm text-gray-600">完了クエスト</div>
            </div>
          </Card>
          <Card padding="p-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{statistics.totalLearningHours}h</div>
              <div className="text-sm text-gray-600">総学習時間</div>
            </div>
          </Card>
          <Card padding="p-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{statistics.currentStreak}日</div>
              <div className="text-sm text-gray-600">現在の継続日数</div>
            </div>
          </Card>
        </div>
      )}

      {/* レベルプログレス */}
      {statistics && (
        <Card className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 現在のレベル</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">レベル {currentLevel}</span>
            <span className="text-gray-900 font-medium">
              {statistics.totalXP} / {currentLevel * 100} XP
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${levelProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">
            次のレベルまで あと{xpToNext} XP
          </p>
        </Card>
      )}

      {/* タブ */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'timeline'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              タイムライン
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'achievements'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              アチーブメント
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'statistics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              統計
            </button>
          </nav>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {/* タイムライン */}
          {activeTab === 'timeline' && (
            <div>
              {/* フィルター */}
              <div className="mb-6 flex gap-4">
                <select
                  value={filters.type}
                  onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">すべてのアクティビティ</option>
                  <option value="quest_completed">クエスト完了</option>
                  <option value="learning_completed">学習完了</option>
                  <option value="skill_level_up">スキルレベルアップ</option>
                  <option value="streak_milestone">継続記録</option>
                </select>
              </div>

              {/* タイムライン表示 */}
              <div className="space-y-4">
                {timeline.length > 0 ? (
                  timeline.map((item) => (
                    <Card key={item.id} className="flex items-start p-6">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mr-4 ${getActivityColor(item.type)}`}>
                        {getActivityIcon(item.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900">{item.title}</h3>
                          <div className="text-right">
                            <div className="text-sm text-gray-500">{formatDate(item.date)}</div>
                            {item.xpGained > 0 && (
                              <div className="text-sm font-medium text-blue-600">+{item.xpGained} XP</div>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-600 mb-2">{item.description}</p>
                        {item.badge && (
                          <div className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                            <span className="mr-1">{item.badge.icon}</span>
                            {item.badge.name}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    アクティビティがありません
                  </div>
                )}
              </div>
            </div>
          )}

          {/* アチーブメント */}
          {activeTab === 'achievements' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements.map((achievement) => (
                  <Card key={achievement.id} className={`p-6 ${achievement.unlockedAt ? 'border-yellow-200 bg-yellow-50' : ''}`}>
                    <div className="flex items-start">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mr-4 ${achievement.unlockedAt ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{achievement.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{achievement.description}</p>
                        
                        {/* プログレス */}
                        <div className="mb-3">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>進捗</span>
                            <span>{achievement.progress}/{achievement.maxProgress}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                achievement.unlockedAt ? 'bg-yellow-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        {achievement.unlockedAt ? (
                          <div className="text-sm text-yellow-700 font-medium">
                            🎉 達成済み • {formatDate(achievement.unlockedAt)}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">
                            未達成
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* 統計 */}
          {activeTab === 'statistics' && statistics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 月間経験値チャート */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 月間経験値</h3>
                <div className="space-y-3">
                  {statistics.monthlyXP.map((month) => (
                    <div key={month.month} className="flex items-center">
                      <div className="w-16 text-sm text-gray-600">{month.month.slice(-2)}月</div>
                      <div className="flex-1 mx-3">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-blue-500 h-3 rounded-full"
                            style={{ width: `${(month.xp / 500) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-16 text-sm font-medium text-gray-900 text-right">{month.xp} XP</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* 週間アクティビティ */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📅 週間アクティビティ</h3>
                <div className="grid grid-cols-7 gap-2">
                  {statistics.weeklyActivity.map((day) => (
                    <div key={day.day} className="text-center">
                      <div className="text-xs text-gray-600 mb-1">{day.day}</div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                        day.activities > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {day.activities}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{day.xp}XP</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* マイルストーン */}
              <Card className="lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 マイルストーン</h3>
                <div className="space-y-4">
                  {milestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-xl mr-4">
                        🏆
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{milestone.title}</h4>
                        <p className="text-gray-600 text-sm">{milestone.description}</p>
                        <div className="text-sm text-green-700 mt-1">
                          達成日: {formatDate(milestone.achievedAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}