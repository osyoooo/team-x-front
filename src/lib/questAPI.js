import { apiClient } from './api';

export const questAPI = {
  // 応募可能なクエスト一覧取得
  async getAvailableQuests() {
    try {
      const response = await apiClient.get('/api/v1/quests/available');
      return {
        success: true,
        data: {
          quests: response.quests || [],
          totalCount: response.total_count || 0
        }
      };
    } catch (error) {
      console.error('Available quests API error:', error);
      throw new Error('応募可能なクエストの取得に失敗しました');
    }
  },

  // 進行中のクエスト一覧取得
  async getInProgressQuests() {
    try {
      const response = await apiClient.get('/api/v1/quests/in-progress');
      return {
        success: true,
        data: {
          quests: response.quests || [],
          totalCount: response.total_count || 0
        }
      };
    } catch (error) {
      console.error('In progress quests API error:', error);
      throw new Error('進行中のクエストの取得に失敗しました');
    }
  },

  // クエスト一覧取得（既存コンポーネント互換性のため）
  async getQuests(filters = {}) {
    try {
      if (filters.status === 'available') {
        return await this.getAvailableQuests();
      } else if (filters.status === 'in_progress') {
        return await this.getInProgressQuests();
      } else {
        // デフォルトは応募可能なクエスト
        return await this.getAvailableQuests();
      }
    } catch (error) {
      console.error('Quest list API error:', error);
      throw new Error('クエスト一覧の取得に失敗しました');
    }
  },

  // クエスト詳細取得
  async getQuestById(questId) {
    try {
      const response = await apiClient.get(`/api/v1/quests/${questId}`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Quest detail API error:', error);
      throw new Error('クエスト詳細の取得に失敗しました');
    }
  },

  // クエスト参加（応募）
  async joinQuest(questId) {
    try {
      const response = await apiClient.post('/api/v1/quests/apply', { quest_id: questId });
      return {
        success: true,
        message: response.message || 'クエストに応募しました',
        data: response
      };
    } catch (error) {
      console.error('Quest apply API error:', error);
      throw new Error('クエストへの応募に失敗しました');
    }
  },

  // クエストのステップ完了
  async completeStep(questId, stepId) {
    try {
      const response = await apiClient.post(`/quests/${questId}/steps/${stepId}/complete`);
      return response;
    } catch (error) {
      console.error('Quest step completion API error:', error);
      throw new Error('ステップの完了処理に失敗しました');
    }
  },

  // ユーザーの参加中クエスト取得
  async getUserQuests(status = 'in_progress') {
    try {
      const response = await apiClient.get('/user/quests', { status });
      return response;
    } catch (error) {
      console.error('User quests API error:', error);
      throw new Error('ユーザーのクエスト取得に失敗しました');
    }
  },

  // クエスト作成（オーナー向け）
  async createQuest(questData) {
    try {
      const response = await apiClient.post('/quests', questData);
      return response;
    } catch (error) {
      console.error('Quest creation API error:', error);
      throw new Error('クエストの作成に失敗しました');
    }
  }
};