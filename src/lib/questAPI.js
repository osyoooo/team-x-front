import { apiClient } from './api';

// モックデータ
const mockQuests = [
  {
    id: '1',
    title: 'Web開発の基礎を学ぼう',
    description: 'HTML、CSS、JavaScriptの基本を身につけて、最初のWebサイトを作成しましょう。',
    difficulty: 'beginner',
    estimatedHours: 20,
    tags: ['Web開発', 'HTML', 'CSS', 'JavaScript'],
    status: 'available',
    participants: 156,
    rewards: {
      xp: 100,
      badges: ['Web開発初心者'],
      benefits: 10
    },
    steps: [
      { id: '1-1', title: 'HTMLの基礎', completed: false },
      { id: '1-2', title: 'CSSでスタイリング', completed: false },
      { id: '1-3', title: 'JavaScriptの基本', completed: false },
      { id: '1-4', title: '最初のWebサイト作成', completed: false }
    ],
    owner: {
      id: 'owner1',
      name: '田中先生',
      avatar: '/avatars/tanaka.jpg',
      rating: 4.8
    }
  },
  {
    id: '2',
    title: 'React入門チャレンジ',
    description: 'モダンなフロントエンド開発の第一歩として、Reactの基本概念とコンポーネント作成を学びます。',
    difficulty: 'intermediate',
    estimatedHours: 35,
    tags: ['React', 'JavaScript', 'フロントエンド'],
    status: 'available',
    participants: 89,
    rewards: {
      xp: 200,
      badges: ['React Developer'],
      benefits: 25
    },
    steps: [
      { id: '2-1', title: 'Reactの概念理解', completed: false },
      { id: '2-2', title: 'コンポーネント作成', completed: false },
      { id: '2-3', title: 'State管理', completed: false },
      { id: '2-4', title: 'TODOアプリ作成', completed: false }
    ],
    owner: {
      id: 'owner2',
      name: '佐藤エンジニア',
      avatar: '/avatars/sato.jpg',
      rating: 4.9
    }
  },
  {
    id: '3',
    title: 'UIデザインの基本原則',
    description: 'ユーザビリティとアクセシビリティを考慮したUIデザインの基本原則を学びます。',
    difficulty: 'beginner',
    estimatedHours: 15,
    tags: ['UI/UX', 'デザイン', 'Figma'],
    status: 'in_progress',
    participants: 234,
    rewards: {
      xp: 80,
      badges: ['UI Designer'],
      benefits: 15
    },
    steps: [
      { id: '3-1', title: 'デザイン原則の理解', completed: true },
      { id: '3-2', title: 'カラーパレット作成', completed: true },
      { id: '3-3', title: 'レイアウト設計', completed: false },
      { id: '3-4', title: 'プロトタイプ作成', completed: false }
    ],
    owner: {
      id: 'owner3',
      name: 'デザイナー山田',
      avatar: '/avatars/yamada.jpg',
      rating: 4.7
    }
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