// プロキシAPI経由でのAPIアクセス用ヘルパー関数
const proxyFetch = async (endpoint, options = {}) => {
  const response = await fetch(endpoint, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Hydrationエラー回避のためのID生成
let skillIdCounter = 0;
const generateSkillId = () => `skill_${++skillIdCounter}_${Math.random().toString(36).substr(2, 9)}`;

// モックデータ
const mockUserProfile = {
  id: '1',
  nickname: 'みらいチャレンジャー',
  email: 'demo@teamx.com',
  dream: 'フルスタックエンジニアとして、世界中の人々の生活を豊かにするWebサービスを作りたい',
  bio: 'プログラミングを学び始めて1年目です。毎日コツコツと学習を続けています！',
  values: ['継続力', '好奇心', 'チームワーク', '挑戦'],
  skills: [
    { name: 'JavaScript', level: 3, category: 'プログラミング' },
    { name: 'React', level: 2, category: 'プログラミング' },
    { name: 'HTML/CSS', level: 4, category: 'プログラミング' },
    { name: 'UI/UX デザイン', level: 2, category: 'デザイン' },
    { name: 'プロジェクト管理', level: 3, category: 'その他' }
  ],
  affiliation: {
    type: 'university',
    name: '東京工科大学',
    department: 'コンピュータサイエンス学部',
    year: 3
  },
  stats: {
    totalXP: 1250,
    level: 5,
    completedQuests: 12,
    completedLearning: 28,
    currentStreak: 15,
    badges: [
      { id: 'web-dev-beginner', name: 'Web開発初心者', icon: '🌐', earnedAt: '2024-01-15' },
      { id: 'react-developer', name: 'React Developer', icon: '⚛️', earnedAt: '2024-02-20' },
      { id: 'ui-designer', name: 'UI Designer', icon: '🎨', earnedAt: '2024-03-10' },
      { id: 'streak-master', name: '継続の達人', icon: '🔥', earnedAt: '2024-04-01' }
    ]
  },
  achievements: [
    {
      id: '1',
      title: '初回クエスト完了',
      description: '最初のクエストを完了しました',
      date: '2024-01-15',
      type: 'quest'
    },
    {
      id: '2',
      title: 'React マスター',
      description: 'React関連のクエストを5つ完了',
      date: '2024-02-20',
      type: 'skill'
    },
    {
      id: '3',
      title: '学習継続15日',
      description: '15日連続で学習を継続',
      date: '2024-04-01',
      type: 'streak'
    }
  ],
  preferences: {
    emailNotifications: true,
    pushNotifications: false,
    weeklyReport: true,
    publicProfile: true
  }
};

export const profileAPI = {
  // プロフィール取得
  async getProfile(userId = 'me') {
    try {
      const response = await proxyFetch('/api/proxy/profile');
      return response;
    } catch (error) {
      console.warn('プロキシAPI経由でのプロフィール取得に失敗、モックデータを使用:', error);
      // デモ用のモックレスポンス
      return {
        success: true,
        data: mockUserProfile
      };
    }
  },

  // プロフィール更新
  async updateProfile(profileData) {
    try {
      const response = await proxyFetch('/api/proxy/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
      return response;
    } catch (error) {
      console.warn('プロキシAPI経由でのプロフィール更新に失敗、モックデータを使用:', error);
      // デモ用のモックレスポンス
      return {
        success: true,
        message: 'プロフィールを更新しました',
        data: {
          ...mockUserProfile,
          ...profileData,
          updatedAt: new Date()
        }
      };
    }
  },

  // スキル追加
  async addSkill(skillData) {
    try {
      const response = await apiClient.post('/profile/skills', skillData);
      return response;
    } catch (error) {
      // デモ用のモックレスポンス
      return {
        success: true,
        message: 'スキルを追加しました',
        data: {
          id: generateSkillId(),
          ...skillData,
          addedAt: new Date()
        }
      };
    }
  },

  // スキル更新
  async updateSkill(skillId, skillData) {
    try {
      const response = await apiClient.put(`/profile/skills/${skillId}`, skillData);
      return response;
    } catch (error) {
      // デモ用のモックレスポンス
      return {
        success: true,
        message: 'スキルを更新しました',
        data: {
          id: skillId,
          ...skillData,
          updatedAt: new Date()
        }
      };
    }
  },

  // プロフィール画像アップロード
  async uploadProfileImage(file) {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await apiClient.request('/profile/image', {
        method: 'POST',
        body: formData,
        headers: {} // Content-Typeを自動設定するため空にする
      });
      return response;
    } catch (error) {
      // デモ用のモックレスポンス
      return {
        success: true,
        message: 'プロフィール画像をアップロードしました',
        data: {
          imageUrl: URL.createObjectURL(file),
          uploadedAt: new Date()
        }
      };
    }
  },

  // 統計情報取得
  async getStats(period = 'month') {
    try {
      const response = await proxyFetch(`/api/proxy/profile?action=stats&period=${period}`);
      return response;
    } catch (error) {
      console.warn('プロキシAPI経由での統計情報取得に失敗、モックデータを使用:', error);
      // デモ用のモックレスポンス
      const mockStats = {
        month: {
          questsCompleted: 5,
          learningHours: 32,
          xpGained: 450,
          streakDays: 15
        },
        week: {
          questsCompleted: 2,
          learningHours: 8,
          xpGained: 120,
          streakDays: 7
        },
        all: {
          questsCompleted: mockUserProfile.stats.completedQuests,
          learningHours: 156,
          xpGained: mockUserProfile.stats.totalXP,
          streakDays: mockUserProfile.stats.currentStreak
        }
      };
      
      return {
        success: true,
        data: mockStats[period] || mockStats.month
      };
    }
  },

  // アチーブメント取得
  async getAchievements() {
    try {
      const response = await proxyFetch('/api/proxy/profile?action=achievements');
      return response;
    } catch (error) {
      console.warn('プロキシAPI経由でのアチーブメント取得に失敗、モックデータを使用:', error);
      // デモ用のモックレスポンス
      return {
        success: true,
        data: mockUserProfile.achievements
      };
    }
  }
};