// Growth External API endpoints
const GROWTH_API_URL = 'https://teamx-quest-api-234584649227.asia-northeast1.run.app/api/v1/growth';
const REAL_GROWTH_API_URL = 'https://teamx-quest-api-234584649227.asia-northeast1.run.app/api/v1/growth/real';

/**
 * 両方のGrowth APIを並列で呼び出してデータを取得
 * @returns {Promise<{growth: any[], realGrowth: any[]}>} APIレスポンスデータ
 */
export async function getGrowthData() {
  try {
    // 2つのAPIリクエストを同時に開始
    const [growthRes, realGrowthRes] = await Promise.all([
      fetch(GROWTH_API_URL, { 
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        }
      }),
      fetch(REAL_GROWTH_API_URL, { 
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        }
      })
    ]);

    // 両方のレスポンスが正常かチェック
    if (!growthRes.ok) {
      throw new Error(`Growth API error: ${growthRes.status} ${growthRes.statusText}`);
    }
    
    if (!realGrowthRes.ok) {
      throw new Error(`Real Growth API error: ${realGrowthRes.status} ${realGrowthRes.statusText}`);
    }

    // JSONのパースも並列で実行
    const [growth, realGrowth] = await Promise.all([
      growthRes.json(),
      realGrowthRes.json()
    ]);

    return { growth, realGrowth };

  } catch (error) {
    console.error('Failed to fetch growth data:', error);
    throw error;
  }
}

/**
 * 通常のGrowthデータのみを取得
 * @returns {Promise<any[]>} Growth一覧
 */
export async function getGrowth() {
  try {
    const response = await fetch(GROWTH_API_URL, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Growth API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch growth:', error);
    throw error;
  }
}

/**
 * リアルGrowthデータのみを取得
 * @returns {Promise<any[]>} リアルGrowth一覧
 */
export async function getRealGrowth() {
  try {
    const response = await fetch(REAL_GROWTH_API_URL, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Real Growth API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch real growth:', error);
    throw error;
  }
}