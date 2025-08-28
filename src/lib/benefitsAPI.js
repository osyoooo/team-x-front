// Benefits API endpoints
const BENEFITS_API_URL = 'https://teamx-quest-api-234584649227.asia-northeast1.run.app/api/v1/benefits';
const REAL_BENEFITS_API_URL = 'https://teamx-quest-api-234584649227.asia-northeast1.run.app/api/v1/benefits/real';

/**
 * 両方のベネフィットAPIを並列で呼び出してデータを取得
 * @returns {Promise<{benefits: any[], realBenefits: any[]}>} APIレスポンスデータ
 */
export async function getBenefitsData() {
  try {
    // 2つのAPIリクエストを同時に開始
    const [benefitsRes, realBenefitsRes] = await Promise.all([
      fetch(BENEFITS_API_URL, { 
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        }
      }),
      fetch(REAL_BENEFITS_API_URL, { 
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        }
      })
    ]);

    // 両方のレスポンスが正常かチェック
    if (!benefitsRes.ok) {
      throw new Error(`Benefits API error: ${benefitsRes.status} ${benefitsRes.statusText}`);
    }
    
    if (!realBenefitsRes.ok) {
      throw new Error(`Real Benefits API error: ${realBenefitsRes.status} ${realBenefitsRes.statusText}`);
    }

    // JSONのパースも並列で実行
    const [benefits, realBenefits] = await Promise.all([
      benefitsRes.json(),
      realBenefitsRes.json()
    ]);

    return { benefits, realBenefits };

  } catch (error) {
    console.error('Failed to fetch benefits data:', error);
    throw error;
  }
}

/**
 * 通常のベネフィット一覧のみを取得
 * @returns {Promise<any[]>} ベネフィット一覧
 */
export async function getBenefits() {
  try {
    const response = await fetch(BENEFITS_API_URL, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Benefits API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch benefits:', error);
    throw error;
  }
}

/**
 * リアルベネフィット一覧のみを取得
 * @returns {Promise<any[]>} リアルベネフィット一覧
 */
export async function getRealBenefits() {
  try {
    const response = await fetch(REAL_BENEFITS_API_URL, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Real Benefits API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch real benefits:', error);
    throw error;
  }
}