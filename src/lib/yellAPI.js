import { apiClient } from './api';

/**
 * Yellプロジェクト関連のAPI
 */

/**
 * プロジェクト一覧を取得
 * @param {string} status - フィルタするステータス（企画中/募集中/実行中）
 * @returns {Promise<Object>} プロジェクト一覧データ
 */
export const fetchProjects = async (status = '') => {
  try {
    const params = status ? `?status=${encodeURIComponent(status)}` : '';
    const response = await apiClient.get(`/api/v1/yell/projects${params}`);
    
    return {
      success: true,
      data: response
    };
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return {
      success: false,
      error: error.message || 'プロジェクト一覧の取得に失敗しました'
    };
  }
};

/**
 * プロジェクト詳細を取得
 * @param {string|number} projectId - プロジェクトID
 * @returns {Promise<Object>} プロジェクト詳細データ
 */
export const fetchProjectDetail = async (projectId) => {
  try {
    if (!projectId) {
      throw new Error('プロジェクトIDが指定されていません');
    }
    
    const response = await apiClient.get(`/api/v1/yell/projects/${projectId}`);
    
    return {
      success: true,
      data: response
    };
  } catch (error) {
    console.error(`Failed to fetch project ${projectId}:`, error);
    
    // 404エラーの場合
    if (error.response?.status === 404) {
      return {
        success: false,
        error: 'プロジェクトが見つかりませんでした',
        notFound: true
      };
    }
    
    return {
      success: false,
      error: error.message || 'プロジェクト詳細の取得に失敗しました'
    };
  }
};

/**
 * プロジェクトに支援する（将来実装用）
 * @param {string|number} projectId - プロジェクトID
 * @param {Object} supportData - 支援データ
 * @returns {Promise<Object>} 支援結果
 */
export const supportProject = async (projectId, supportData) => {
  try {
    // TODO: 支援APIのエンドポイントが実装されたら対応
    console.log('Support project:', projectId, supportData);
    
    return {
      success: false,
      error: 'この機能は現在準備中です'
    };
  } catch (error) {
    console.error(`Failed to support project ${projectId}:`, error);
    return {
      success: false,
      error: error.message || 'プロジェクトへの支援に失敗しました'
    };
  }
};

/**
 * レスポンスデータを正規化
 * プロジェクトデータのフォーマットを統一
 */
export const normalizeProjectData = (project) => {
  if (!project) return null;
  
  return {
    id: project.id,
    title: project.title || '',
    owner: {
      id: project.owner?.id,
      name: project.owner?.name || '',
      school: project.owner?.school || '',
      grade: project.owner?.grade || '',
      bio: project.owner?.bio || '',
      avatarUrl: project.owner?.avatar_url || '/images/default-avatar.svg'
    },
    targetAmount: project.target_amount || 0,
    currentAmount: project.current_amount || 0,
    progressPercent: project.progress_percent || 0,
    supportersCount: project.supporters_count || 0,
    daysLeft: project.days_left || 0,
    status: project.status || '',
    category: project.category || '',
    whyDescription: project.why_description || '',
    whatDescription: project.what_description || '',
    features: project.features || [],
    updates: project.updates || [],
    rewards: project.rewards || [],
    isSupported: project.is_supported || false,
    canSupport: project.can_support || false
  };
};

/**
 * プロジェクト一覧データを正規化
 */
export const normalizeProjectsData = (data) => {
  if (!data) return null;
  
  return {
    tabs: data.tabs || ['企画中', '募集中', '実行中'],
    activeTab: data.active_tab || '募集中',
    projects: (data.projects || []).map(normalizeProjectData),
    totalCount: data.total_count || 0
  };
};