/**
 * Growth APIデータをグラフ表示用に変換するユーティリティ関数
 */

/**
 * デモデータ（APIデータが利用できない場合のフォールバック）
 */
const DEMO_DATA = {
  totalGrowthRate: 8.2,
  weeklyScore: 40,
  currentScore: 580,
  activities: {
    completedLearning: 86,
    completedQuest: 15,
    projects: 3,
    totalLearningTime: 156
  },
  activityHistory: {
    learning: [
      {
        id: 1,
        score: 40,
        title: 'React実装開発',
        skills: 'スキル：Webアプリ開発、画面部品管理、高速レスポンス',
        date: '完了日：2030年8月9日'
      },
      {
        id: 2,
        score: 30,
        title: 'AWS中級',
        skills: 'スキル：クラウド公開、自動拡張、コスト管理',
        date: '完了日：2030年7月29日'
      },
      {
        id: 3,
        score: 35,
        title: 'python×データ分析',
        skills: 'スキル：データ解析、グラフ作成、ビジネス分析',
        date: '完了日：2030年7月15日'
      }
    ],
    quest: [
      {
        id: 1,
        score: 45,
        title: 'Vue.js実践開発',
        skills: 'スキル：フロントエンド、コンポーネント設計',
        date: '完了日：2030年8月5日'
      }
    ],
    project: [
      {
        id: 1,
        score: 50,
        title: 'ECサイト構築プロジェクト',
        skills: 'スキル：フルスタック開発、DB設計',
        date: '完了日：2030年7月20日'
      }
    ]
  },
  chartData: [
    { x: 0, y: 50, color: '#9747FF' },   // 紫
    { x: 0.2, y: 80, color: '#9747FF' },
    { x: 0.4, y: 120, color: '#9747FF' },
    { x: 0.6, y: 180, color: '#9747FF' },
    { x: 0.8, y: 280, color: '#9747FF' },
    { x: 1, y: 580, color: '#9747FF' },
    
    { x: 0, y: 30, color: '#F1FE56' },   // 黄緑
    { x: 0.2, y: 60, color: '#F1FE56' },
    { x: 0.4, y: 100, color: '#F1FE56' },
    { x: 0.6, y: 160, color: '#F1FE56' },
    { x: 0.8, y: 240, color: '#F1FE56' },
    { x: 1, y: 450, color: '#F1FE56' },
    
    { x: 0, y: 20, color: '#AEEE31' },   // 緑
    { x: 0.2, y: 40, color: '#AEEE31' },
    { x: 0.4, y: 70, color: '#AEEE31' },
    { x: 0.6, y: 120, color: '#AEEE31' },
    { x: 0.8, y: 200, color: '#AEEE31' },
    { x: 1, y: 300, color: '#AEEE31' },
    
    { x: 0, y: 10, color: '#74FBFC' },   // 水色
    { x: 0.2, y: 30, color: '#74FBFC' },
    { x: 0.4, y: 50, color: '#74FBFC' },
    { x: 0.6, y: 80, color: '#74FBFC' },
    { x: 0.8, y: 120, color: '#74FBFC' },
    { x: 1, y: 200, color: '#74FBFC' }
  ]
};

/**
 * 時系列データをグラフ用のチャートデータに変換
 * @param {Array} timeSeriesData - 時系列データ配列
 * @param {string} color - ライン色
 * @returns {Array} グラフ用チャートデータ
 */
function transformTimeSeriesData(timeSeriesData, color) {
  if (!timeSeriesData || !Array.isArray(timeSeriesData) || timeSeriesData.length === 0) {
    return [];
  }

  const maxLength = 6; // グラフの最大ポイント数
  const dataPoints = timeSeriesData.slice(0, maxLength);
  
  return dataPoints.map((dataPoint, index) => {
    const x = index / (maxLength - 1); // 0から1の範囲で正規化
    const y = extractValueFromDataPoint(dataPoint);
    
    return { x, y, color };
  });
}

/**
 * データポイントから値を抽出（柔軟な構造に対応）
 * @param {Object} dataPoint - データポイント
 * @returns {number} 抽出された数値
 */
function extractValueFromDataPoint(dataPoint) {
  // 様々なプロパティ名に対応
  const possibleKeys = ['value', 'score', 'points', 'amount', 'count', 'total', 'growth'];
  
  for (const key of possibleKeys) {
    if (typeof dataPoint[key] === 'number') {
      return dataPoint[key];
    }
  }
  
  // オブジェクト内の最初の数値を使用
  const values = Object.values(dataPoint);
  for (const value of values) {
    if (typeof value === 'number') {
      return value;
    }
  }
  
  // デフォルト値
  return 0;
}

/**
 * 成長データから統計情報を計算
 * @param {Object} growthData - Growth APIデータ
 * @param {Object} realGrowthData - Real Growth APIデータ
 * @returns {Object} 統計情報
 */
function calculateGrowthStats(growthData, realGrowthData) {
  let stats = {
    totalGrowthRate: DEMO_DATA.totalGrowthRate,
    weeklyScore: DEMO_DATA.weeklyScore,
    currentScore: DEMO_DATA.currentScore
  };

  try {
    // Growth APIデータから統計を計算
    if (growthData) {
      if (typeof growthData.totalGrowthRate === 'number') {
        stats.totalGrowthRate = growthData.totalGrowthRate;
      }
      if (typeof growthData.weeklyScore === 'number') {
        stats.weeklyScore = growthData.weeklyScore;
      }
      if (typeof growthData.currentScore === 'number') {
        stats.currentScore = growthData.currentScore;
      }

      // データ配列から現在スコアを算出
      if (Array.isArray(growthData) && growthData.length > 0) {
        const latestData = growthData[growthData.length - 1];
        const score = extractValueFromDataPoint(latestData);
        if (score > 0) {
          stats.currentScore = score;
        }
      }
    }

    // Real Growth APIデータからの補完
    if (realGrowthData && Array.isArray(realGrowthData) && realGrowthData.length > 0) {
      const latestRealData = realGrowthData[realGrowthData.length - 1];
      const realScore = extractValueFromDataPoint(latestRealData);
      if (realScore > 0) {
        stats.weeklyScore = Math.round((realScore - stats.currentScore) * 0.1); // 推定週間増加
      }
    }
  } catch (error) {
    console.error('Error calculating growth stats:', error);
  }

  return stats;
}

/**
 * 活動データを変換
 * @param {Object} growthData - Growth APIデータ
 * @param {Object} realGrowthData - Real Growth APIデータ
 * @returns {Object} 活動データ
 */
function transformActivityData(growthData, realGrowthData) {
  let activities = { ...DEMO_DATA.activities };
  let activityHistory = { ...DEMO_DATA.activityHistory };

  try {
    // APIデータから活動情報を抽出
    if (growthData) {
      // 活動サマリーの更新
      if (typeof growthData.completedLearning === 'number') {
        activities.completedLearning = growthData.completedLearning;
      }
      if (typeof growthData.completedQuest === 'number') {
        activities.completedQuest = growthData.completedQuest;
      }
      if (typeof growthData.projects === 'number') {
        activities.projects = growthData.projects;
      }
      if (typeof growthData.totalLearningTime === 'number') {
        activities.totalLearningTime = growthData.totalLearningTime;
      }

      // 活動履歴の更新
      if (Array.isArray(growthData.learning)) {
        activityHistory.learning = transformActivityHistory(growthData.learning);
      }
      if (Array.isArray(growthData.quest)) {
        activityHistory.quest = transformActivityHistory(growthData.quest);
      }
      if (Array.isArray(growthData.project)) {
        activityHistory.project = transformActivityHistory(growthData.project);
      }

      // データ配列から統計を推定
      if (Array.isArray(growthData) && growthData.length > 0) {
        activities.completedLearning = growthData.length;
      }
    }
  } catch (error) {
    console.error('Error transforming activity data:', error);
  }

  return { activities, activityHistory };
}

/**
 * 活動履歴データを変換
 * @param {Array} historyData - 活動履歴の生データ
 * @returns {Array} 変換された活動履歴
 */
function transformActivityHistory(historyData) {
  if (!Array.isArray(historyData)) return [];

  return historyData.map((item, index) => ({
    id: item.id || index + 1,
    score: extractValueFromDataPoint(item) || 0,
    title: item.title || item.name || `アクティビティ ${index + 1}`,
    skills: item.skills || item.description || 'スキル情報なし',
    date: item.date || item.completedAt || formatDate(new Date())
  }));
}

/**
 * 日付をフォーマット
 * @param {Date} date - 日付オブジェクト
 * @returns {string} フォーマットされた日付文字列
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `完了日：${year}年${month}月${day}日`;
}

/**
 * APIデータを使用してグラフ用データを生成
 * @param {Object} growthData - Growth APIデータ
 * @param {Object} realGrowthData - Real Growth APIデータ
 * @returns {Object} 変換されたグラフデータ
 */
export function transformGrowthDataForChart(growthData, realGrowthData) {
  try {
    // デバッグ用ログ
    console.log('🔄 Transforming growth data:', { growthData, realGrowthData });

    // 統計情報の計算
    const stats = calculateGrowthStats(growthData, realGrowthData);
    
    // 活動データの変換
    const { activities, activityHistory } = transformActivityData(growthData, realGrowthData);

    // チャートデータの生成
    let chartData = [];
    
    // Growth APIからチャートデータを生成
    if (Array.isArray(growthData) && growthData.length > 0) {
      chartData = [
        ...transformTimeSeriesData(growthData, '#9747FF'),    // 紫
        ...transformTimeSeriesData(growthData, '#F1FE56'),    // 黄緑（別の成長指標として）
        ...transformTimeSeriesData(growthData, '#AEEE31'),    // 緑（別の成長指標として）
        ...transformTimeSeriesData(growthData, '#74FBFC')     // 水色（別の成長指標として）
      ];
    }
    
    // Real Growth APIからも追加のチャートデータを生成
    if (Array.isArray(realGrowthData) && realGrowthData.length > 0) {
      const realChartData = transformTimeSeriesData(realGrowthData, '#9747FF');
      if (realChartData.length > 0 && chartData.length === 0) {
        chartData = [
          ...realChartData,
          ...transformTimeSeriesData(realGrowthData, '#F1FE56'),
          ...transformTimeSeriesData(realGrowthData, '#AEEE31'),
          ...transformTimeSeriesData(realGrowthData, '#74FBFC')
        ];
      }
    }

    // フォールバック：APIデータが使用できない場合
    if (chartData.length === 0) {
      console.log('⚠️ No usable API data, falling back to demo data');
      chartData = DEMO_DATA.chartData;
    }

    const result = {
      ...stats,
      activities,
      activityHistory,
      chartData
    };

    console.log('✅ Transformed growth data:', result);
    return result;

  } catch (error) {
    console.error('❌ Error transforming growth data:', error);
    // エラー発生時はデモデータを返す
    return DEMO_DATA;
  }
}

/**
 * デモデータを取得（フォールバック用）
 * @returns {Object} デモデータ
 */
export function getDemoGrowthData() {
  return { ...DEMO_DATA };
}