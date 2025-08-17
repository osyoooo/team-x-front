import { apiClient } from './api';

// モックデータ
const mockLearningContent = [
  {
    id: '1',
    title: 'JavaScript の基礎',
    description: 'プログラミングの基本概念から変数、関数、オブジェクトまでを学習します。',
    type: 'course',
    difficulty: 'beginner',
    duration: 120, // 分
    thumbnailUrl: '/images/js-basics.jpg',
    tags: ['JavaScript', 'プログラミング', '基礎'],
    category: 'プログラミング',
    progress: 75,
    rating: 4.7,
    enrolledUsers: 1234,
    instructor: {
      name: '山田太郎',
      avatar: '/avatars/yamada.jpg',
      bio: 'フロントエンド開発経験10年'
    },
    chapters: [
      { id: '1-1', title: '変数と データ型', duration: 30, completed: true },
      { id: '1-2', title: '関数の基本', duration: 45, completed: true },
      { id: '1-3', title: 'オブジェクトと配列', duration: 30, completed: false },
      { id: '1-4', title: '条件分岐とループ', duration: 15, completed: false }
    ],
    skills: ['JavaScript基礎', 'プログラミング思考'],
    prerequisites: [],
    objectives: [
      'JavaScriptの基本文法を理解する',
      '変数と関数を使いこなす',
      'オブジェクト指向の基礎を学ぶ'
    ]
  },
  {
    id: '2',
    title: 'React入門コース',
    description: 'Reactの基本概念からコンポーネント作成、状態管理まで実践的に学習します。',
    type: 'course',
    difficulty: 'intermediate',
    duration: 180,
    thumbnailUrl: '/images/react-intro.jpg',
    tags: ['React', 'フロントエンド', 'コンポーネント'],
    category: 'フロントエンド',
    progress: 30,
    rating: 4.9,
    enrolledUsers: 856,
    instructor: {
      name: '佐藤花子',
      avatar: '/avatars/sato.jpg',
      bio: 'React専門開発者'
    },
    chapters: [
      { id: '2-1', title: 'Reactの基本概念', duration: 60, completed: true },
      { id: '2-2', title: 'コンポーネントの作成', duration: 45, completed: false },
      { id: '2-3', title: 'State と Props', duration: 45, completed: false },
      { id: '2-4', title: 'イベントハンドリング', duration: 30, completed: false }
    ],
    skills: ['React', 'JSX', 'コンポーネント設計'],
    prerequisites: ['JavaScript基礎'],
    objectives: [
      'Reactコンポーネントを作成できる',
      'StateとPropsを理解する',
      'イベントハンドリングができる'
    ]
  },
  {
    id: '3',
    title: 'UI/UXデザインの基本',
    description: 'ユーザビリティとアクセシビリティを重視したデザインの基本原則を学びます。',
    type: 'tutorial',
    difficulty: 'beginner',
    duration: 90,
    thumbnailUrl: '/images/uiux-basics.jpg',
    tags: ['UI/UX', 'デザイン', 'Figma'],
    category: 'デザイン',
    progress: 100,
    rating: 4.6,
    enrolledUsers: 567,
    instructor: {
      name: '田中美咲',
      avatar: '/avatars/tanaka.jpg',
      bio: 'UXデザイナー'
    },
    chapters: [
      { id: '3-1', title: 'デザイン原則', duration: 30, completed: true },
      { id: '3-2', title: 'カラー理論', duration: 30, completed: true },
      { id: '3-3', title: 'タイポグラフィ', duration: 30, completed: true }
    ],
    skills: ['UI設計', 'UX思考', 'Figma'],
    prerequisites: [],
    objectives: [
      'デザインの基本原則を理解する',
      'カラー理論を実践できる',
      'ユーザビリティを考慮できる'
    ]
  },
  {
    id: '4',
    title: 'Git & GitHub 完全マスター',
    description: 'バージョン管理の基本からチーム開発での活用方法まで実践的に学習します。',
    type: 'workshop',
    difficulty: 'beginner',
    duration: 150,
    thumbnailUrl: '/images/git-github.jpg',
    tags: ['Git', 'GitHub', 'バージョン管理'],
    category: '開発ツール',
    progress: 0,
    rating: 4.8,
    enrolledUsers: 923,
    instructor: {
      name: '鈴木健太',
      avatar: '/avatars/suzuki.jpg',
      bio: 'DevOpsエンジニア'
    },
    chapters: [
      { id: '4-1', title: 'Gitの基本操作', duration: 45, completed: false },
      { id: '4-2', title: 'ブランチ戦略', duration: 45, completed: false },
      { id: '4-3', title: 'GitHub活用', duration: 45, completed: false },
      { id: '4-4', title: 'チーム開発の実践', duration: 15, completed: false }
    ],
    skills: ['Git', 'GitHub', 'チーム開発'],
    prerequisites: [],
    objectives: [
      'Gitの基本操作をマスターする',
      'ブランチ戦略を理解する',
      'チーム開発に参加できる'
    ]
  }
];

const mockCategories = [
  { id: 'programming', name: 'プログラミング', count: 15 },
  { id: 'frontend', name: 'フロントエンド', count: 8 },
  { id: 'backend', name: 'バックエンド', count: 6 },
  { id: 'design', name: 'デザイン', count: 4 },
  { id: 'tools', name: '開発ツール', count: 3 }
];

export const learningAPI = {
  // 学習コンテンツ一覧取得
  async getLearningContent(filters = {}) {
    try {
      const response = await apiClient.get('/learning', filters);
      return response;
    } catch (error) {
      // デモ用のモックレスポンス
      let filteredContent = [...mockLearningContent];
      
      if (filters.category && filters.category !== 'all') {
        filteredContent = filteredContent.filter(content => 
          content.category.toLowerCase() === filters.category.toLowerCase()
        );
      }
      
      if (filters.difficulty && filters.difficulty !== 'all') {
        filteredContent = filteredContent.filter(content => 
          content.difficulty === filters.difficulty
        );
      }
      
      if (filters.type && filters.type !== 'all') {
        filteredContent = filteredContent.filter(content => 
          content.type === filters.type
        );
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredContent = filteredContent.filter(content =>
          content.title.toLowerCase().includes(searchTerm) ||
          content.description.toLowerCase().includes(searchTerm) ||
          content.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }
      
      return {
        success: true,
        data: {
          content: filteredContent,
          totalCount: filteredContent.length,
          categories: mockCategories
        }
      };
    }
  },

  // 学習コンテンツ詳細取得
  async getLearningContentById(contentId) {
    try {
      const response = await apiClient.get(`/learning/${contentId}`);
      return response;
    } catch (error) {
      // デモ用のモックレスポンス
      const content = mockLearningContent.find(c => c.id === contentId);
      if (content) {
        return {
          success: true,
          data: content
        };
      } else {
        throw new Error('学習コンテンツが見つかりません');
      }
    }
  },

  // 学習コンテンツに登録
  async enrollContent(contentId) {
    try {
      const response = await apiClient.post(`/learning/${contentId}/enroll`);
      return response;
    } catch (error) {
      // デモ用のモックレスポンス
      return {
        success: true,
        message: '学習コンテンツに登録しました',
        data: {
          contentId,
          enrolledAt: new Date(),
          progress: 0
        }
      };
    }
  },

  // チャプター完了
  async completeChapter(contentId, chapterId) {
    try {
      const response = await apiClient.post(`/learning/${contentId}/chapters/${chapterId}/complete`);
      return response;
    } catch (error) {
      // デモ用のモックレスポンス
      return {
        success: true,
        message: 'チャプターを完了しました',
        data: {
          contentId,
          chapterId,
          completedAt: new Date(),
          xpGained: 25
        }
      };
    }
  },

  // 学習進捗取得
  async getLearningProgress() {
    try {
      const response = await apiClient.get('/learning/progress');
      return response;
    } catch (error) {
      // デモ用のモックレスポンス
      return {
        success: true,
        data: {
          totalContentEnrolled: 3,
          totalContentCompleted: 1,
          totalHoursLearned: 45,
          currentStreak: 7,
          weeklyGoal: 10, // 時間
          weeklyProgress: 6, // 時間
          recentContent: mockLearningContent.filter(c => c.progress > 0)
        }
      };
    }
  },

  // 学習カテゴリー取得
  async getCategories() {
    try {
      const response = await apiClient.get('/learning/categories');
      return response;
    } catch (error) {
      // デモ用のモックレスポンス
      return {
        success: true,
        data: mockCategories
      };
    }
  },

  // おすすめコンテンツ取得
  async getRecommendedContent() {
    try {
      const response = await apiClient.get('/learning/recommended');
      return response;
    } catch (error) {
      // デモ用のモックレスポンス
      // ユーザーの進捗に基づいておすすめを生成
      const recommended = mockLearningContent.filter(content => 
        content.difficulty === 'beginner' || content.rating >= 4.7
      ).slice(0, 3);
      
      return {
        success: true,
        data: recommended
      };
    }
  }
};