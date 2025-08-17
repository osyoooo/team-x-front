import { apiClient } from './api';

// モックデータ
const mockGrowthData = {
  timeline: [
    {
      id: '1',
      type: 'quest_completed',
      title: 'Web開発の基礎クエスト完了',
      description: 'HTMLとCSSの基本をマスターしました',
      date: '2024-08-15T09:30:00Z',
      xpGained: 100,
      badge: { name: 'Web開発初心者', icon: '🌐' },
      metadata: {
        questId: '1',
        questTitle: 'Web開発の基礎を学ぼう'
      }
    },
    {
      id: '2',
      type: 'learning_completed',
      title: 'JavaScript基礎コース完了',
      description: '変数、関数、オブジェクトの基本概念を習得',
      date: '2024-08-12T14:20:00Z',
      xpGained: 150,
      metadata: {
        contentId: '1',
        contentTitle: 'JavaScript の基礎',
        duration: 120
      }
    },
    {
      id: '3',
      type: 'skill_level_up',
      title: 'JavaScriptスキルレベルアップ',
      description: '初級から中級にレベルアップしました',
      date: '2024-08-10T16:45:00Z',
      xpGained: 75,
      metadata: {
        skill: 'JavaScript',
        oldLevel: 1,
        newLevel: 2
      }
    },
    {
      id: '4',
      type: 'streak_milestone',
      title: '学習継続10日達成',
      description: '10日連続で学習を継続しました',
      date: '2024-08-08T18:00:00Z',
      xpGained: 50,
      badge: { name: '継続の達人', icon: '🔥' },
      metadata: {
        streakDays: 10
      }
    },
    {
      id: '5',
      type: 'profile_updated',
      title: 'プロフィール更新',
      description: '夢・目標を設定しました',
      date: '2024-08-05T10:15:00Z',
      xpGained: 25,
      metadata: {
        field: 'dream'
      }
    },
    {
      id: '6',
      type: 'quest_joined',
      title: 'React入門クエストに参加',
      description: '新しいクエストにチャレンジ開始',
      date: '2024-08-03T11:30:00Z',
      xpGained: 10,
      metadata: {
        questId: '2',
        questTitle: 'React入門チャレンジ'
      }
    },
    {
      id: '7',
      type: 'account_created',
      title: 'Team Xアカウント作成',
      description: 'Team Xの学習の旅が始まりました',
      date: '2024-08-01T09:00:00Z',
      xpGained: 50,
      badge: { name: 'Team X メンバー', icon: '🎉' },
      metadata: {}
    }
  ],
  statistics: {
    totalXP: 1250,
    currentLevel: 5,
    questsCompleted: 12,
    learningCompleted: 8,
    skillsLearned: 5,
    currentStreak: 15,
    longestStreak: 23,
    totalLearningHours: 45,
    badgesEarned: 4,
    monthlyXP: [
      { month: '2024-05', xp: 200 },
      { month: '2024-06', xp: 350 },
      { month: '2024-07', xp: 400 },
      { month: '2024-08', xp: 300 }
    ],
    weeklyActivity: [
      { day: 'Mon', activities: 2, xp: 75 },
      { day: 'Tue', activities: 1, xp: 50 },
      { day: 'Wed', activities: 3, xp: 125 },
      { day: 'Thu', activities: 0, xp: 0 },
      { day: 'Fri', activities: 2, xp: 100 },
      { day: 'Sat', activities: 1, xp: 25 },
      { day: 'Sun', activities: 2, xp: 80 }
    ]
  },
  achievements: [
    {
      id: 'first_quest',
      title: '初回クエスト完了',
      description: '最初のクエストを完了しました',
      icon: '🎯',
      category: 'quest',
      unlockedAt: '2024-08-15T09:30:00Z',
      progress: 100,
      maxProgress: 1
    },
    {
      id: 'streak_10',
      title: '継続の達人',
      description: '10日連続で学習を継続',
      icon: '🔥',
      category: 'streak',
      unlockedAt: '2024-08-08T18:00:00Z',
      progress: 15,
      maxProgress: 10
    },
    {
      id: 'learning_hours_20',
      title: '学習マラソナー',
      description: '累計20時間の学習を達成',
      icon: '⏰',
      category: 'learning',
      unlockedAt: '2024-08-10T14:20:00Z',
      progress: 45,
      maxProgress: 20
    },
    {
      id: 'skill_collector',
      title: 'スキルコレクター',
      description: '5つ以上のスキルを習得',
      icon: '🛠️',
      category: 'skill',
      unlockedAt: null,
      progress: 3,
      maxProgress: 5
    }
  ],
  milestones: [
    {
      id: 'level_5',
      title: 'レベル5到達',
      description: 'レベル5に到達しました',
      achievedAt: '2024-08-14T16:20:00Z',
      xpRequired: 500
    },
    {
      id: 'first_month',
      title: '1ヶ月継続',
      description: '1ヶ月間学習を継続しました',
      achievedAt: '2024-08-31T23:59:59Z',
      xpRequired: 200
    }
  ]
};

export const growthAPI = {
  // 成長記録のタイムライン取得
  async getGrowthTimeline(filters = {}) {
    try {
      const response = await apiClient.get('/growth/timeline', filters);
      return response;
    } catch (error) {
      // デモ用のモックレスポンス
      let filteredTimeline = [...mockGrowthData.timeline];
      
      if (filters.type && filters.type !== 'all') {
        filteredTimeline = filteredTimeline.filter(item => item.type === filters.type);
      }
      
      if (filters.startDate) {
        filteredTimeline = filteredTimeline.filter(item => 
          new Date(item.date) >= new Date(filters.startDate)
        );
      }
      
      if (filters.endDate) {
        filteredTimeline = filteredTimeline.filter(item => 
          new Date(item.date) <= new Date(filters.endDate)
        );
      }
      
      // 日付順でソート（新しい順）
      filteredTimeline.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      return {
        success: true,
        data: {
          timeline: filteredTimeline,
          totalCount: filteredTimeline.length
        }
      };
    }
  },

  // 成長統計取得
  async getGrowthStatistics(period = 'all') {
    try {
      const response = await apiClient.get('/growth/statistics', { period });
      return response;
    } catch (error) {
      // デモ用のモックレスポンス
      return {
        success: true,
        data: mockGrowthData.statistics
      };
    }
  },

  // アチーブメント取得
  async getAchievements(category = 'all') {
    try {
      const response = await apiClient.get('/growth/achievements', { category });
      return response;
    } catch (error) {
      // デモ用のモックレスポンス
      let filteredAchievements = [...mockGrowthData.achievements];
      
      if (category !== 'all') {
        filteredAchievements = filteredAchievements.filter(
          achievement => achievement.category === category
        );
      }
      
      return {
        success: true,
        data: filteredAchievements
      };
    }
  },

  // マイルストーン取得
  async getMilestones() {
    try {
      const response = await apiClient.get('/growth/milestones');
      return response;
    } catch (error) {
      // デモ用のモックレスポンス
      return {
        success: true,
        data: mockGrowthData.milestones
      };
    }
  },

  // 学習レポート取得
  async getLearningReport(period = 'month') {
    try {
      const response = await apiClient.get('/growth/report', { period });
      return response;
    } catch (error) {
      // デモ用のモックレスポンス
      const reportData = {
        period,
        summary: {
          totalXPGained: period === 'week' ? 455 : period === 'month' ? 1250 : 1250,
          questsCompleted: period === 'week' ? 2 : period === 'month' ? 5 : 12,
          learningHours: period === 'week' ? 8 : period === 'month' ? 32 : 45,
          streakDays: period === 'week' ? 7 : period === 'month' ? 15 : 15,
          skillsImproved: period === 'week' ? 1 : period === 'month' ? 3 : 5
        },
        highlights: [
          'JavaScript スキルが中級にレベルアップ',
          'Web開発の基礎クエストを完了',
          '15日連続学習を達成'
        ],
        recommendations: [
          'React入門クエストの続きに取り組みましょう',
          'UI/UXデザインの学習を始めることをお勧めします',
          '週末に復習の時間を設けることで定着率が向上します'
        ]
      };
      
      return {
        success: true,
        data: reportData
      };
    }
  },

  // 成長目標設定
  async setGrowthGoals(goals) {
    try {
      const response = await apiClient.post('/growth/goals', goals);
      return response;
    } catch (error) {
      // デモ用のモックレスポンス
      return {
        success: true,
        message: '成長目標を設定しました',
        data: {
          goals,
          setAt: new Date()
        }
      };
    }
  },

  // 成長目標取得
  async getGrowthGoals() {
    try {
      const response = await apiClient.get('/growth/goals');
      return response;
    } catch (error) {
      // デモ用のモックレスポンス
      return {
        success: true,
        data: {
          weeklyLearningHours: 10,
          monthlyQuestCompletion: 3,
          skillLevelUpTarget: 2,
          streakTarget: 30
        }
      };
    }
  }
};