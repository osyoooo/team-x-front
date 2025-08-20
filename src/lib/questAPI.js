import { apiClient } from './api';

// Figmaデザインに基づくモックデータ
const mockQuests = [
  {
    id: '1',
    title: '地域飲食店レビューサイト開発',
    icon: '/icons/repo.svg',
    starRating: 2,
    matchPercentage: 92,
    requiredSkills: 'HTML / CSS / JavaScript（初級）',
    requiredParticipants: 15,
    participants: 4,
    duration: '2ヶ月',
    reward: '+100',
    status: 'available',
    isLocked: false
  },
  {
    id: '2', 
    title: '簡易勤怠管理システムの開発',
    icon: '/icons/pasocon.svg',
    starRating: 3,
    matchPercentage: 86,
    requiredSkills: 'Python（Flask）/ SQLite / Git',
    requiredParticipants: 10,
    participants: 8,
    duration: '1.5ヶ月',
    reward: '+100',
    provider: 'NPO法人 × IT支援チーム',
    status: 'available',
    isLocked: false
  },
  {
    id: '3',
    title: '防災情報マップ開発プロジェクト', 
    icon: '/icons/bousai.svg',
    starRating: 3,
    matchPercentage: 88,
    skillTrend: 'JavaScript / 地図API / データ構造設計',
    provider: '○○市 防災対策室',
    unlockCondition: 'みつける力40点以上',
    status: 'available',
    isLocked: true
  }
];

export const questAPI = {
  // クエスト一覧取得
  async getQuests(filters = {}) {
    try {
      const response = await apiClient.get('/quests', filters);
      return response;
    } catch (error) {
      // デモ用のモックレスポンス
      return {
        success: true,
        data: {
          quests: mockQuests.filter(quest => {
            if (filters.status && quest.status !== filters.status) return false;
            if (filters.difficulty && quest.difficulty !== filters.difficulty) return false;
            if (filters.search) {
              const searchTerm = filters.search.toLowerCase();
              return quest.title.toLowerCase().includes(searchTerm) ||
                     quest.description.toLowerCase().includes(searchTerm) ||
                     quest.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            }
            return true;
          }),
          totalCount: mockQuests.length,
          page: filters.page || 1,
          limit: filters.limit || 10
        }
      };
    }
  },

  // クエスト詳細取得
  async getQuestById(questId) {
    try {
      const response = await apiClient.get(`/quests/${questId}`);
      return response;
    } catch (error) {
      // デモ用のモックレスポンス
      const quest = mockQuests.find(q => q.id === questId);
      if (quest) {
        return {
          success: true,
          data: quest
        };
      } else {
        throw new Error('クエストが見つかりません');
      }
    }
  },

  // クエスト参加
  async joinQuest(questId) {
    try {
      const response = await apiClient.post(`/quests/${questId}/join`);
      return response;
    } catch (error) {
      // デモ用のモックレスポンス
      return {
        success: true,
        message: 'クエストに参加しました',
        data: {
          questId,
          joinedAt: new Date(),
          status: 'in_progress'
        }
      };
    }
  },

  // クエストのステップ完了
  async completeStep(questId, stepId) {
    try {
      const response = await apiClient.post(`/quests/${questId}/steps/${stepId}/complete`);
      return response;
    } catch (error) {
      // デモ用のモックレスポンス
      return {
        success: true,
        message: 'ステップを完了しました',
        data: {
          questId,
          stepId,
          completedAt: new Date(),
          xpGained: 25
        }
      };
    }
  },

  // ユーザーの参加中クエスト取得
  async getUserQuests(status = 'in_progress') {
    try {
      const response = await apiClient.get('/user/quests', { status });
      return response;
    } catch (error) {
      // デモ用のモックレスポンス
      const userQuests = status === 'in_progress' 
        ? mockQuests.filter(q => q.status === 'in_progress')
        : mockQuests;
        
      return {
        success: true,
        data: userQuests
      };
    }
  },

  // クエスト作成（オーナー向け）
  async createQuest(questData) {
    try {
      const response = await apiClient.post('/quests', questData);
      return response;
    } catch (error) {
      // デモ用のモックレスポンス
      return {
        success: true,
        message: 'クエストを作成しました',
        data: {
          id: Date.now().toString(),
          ...questData,
          createdAt: new Date()
        }
      };
    }
  }
};