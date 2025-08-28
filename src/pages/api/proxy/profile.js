// Next.js API Routes プロキシ - Profile API用
// CORS問題を回避するためのサーバーサイドプロキシ

export default async function handler(req, res) {
  // CORS ヘッダーを設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // OPTIONSリクエスト（プリフライト）に対応
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://teamx-quest-api-234584649227.asia-northeast1.run.app';
  
  // クエリパラメータに基づいてターゲットURLを決定
  const { action, period } = req.query;
  let targetURL;
  
  switch (action) {
    case 'stats':
      targetURL = `${API_BASE_URL}/api/v1/profile/stats${period ? `?period=${period}` : ''}`;
      break;
    case 'achievements':
      targetURL = `${API_BASE_URL}/api/v1/profile/achievements`;
      break;
    default:
      targetURL = `${API_BASE_URL}/api/v1/profile`;
  }

  try {
    console.log(`🔄 [Proxy] ${req.method} request to: ${targetURL}`);
    
    const config = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        // Authorization ヘッダーがあれば転送
        ...(req.headers.authorization && { 'Authorization': req.headers.authorization }),
      },
    };

    if (req.body && req.method !== 'GET') {
      config.body = JSON.stringify(req.body);
    }

    const response = await fetch(targetURL, config);
    
    console.log(`🔄 [Proxy] Response status: ${response.status}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`🔄 [Proxy] Error response:`, errorData);
      return res.status(response.status).json({
        error: errorData.message || `HTTP ${response.status}`,
        details: errorData,
        proxied: true
      });
    }

    const data = await response.json();
    console.log(`✅ [Proxy] Success:`, data);
    
    // 成功レスポンスを返す
    res.status(200).json({
      ...data,
      _proxy_info: {
        proxied: true,
        original_url: targetURL,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error(`❌ [Proxy] Error:`, error);
    
    res.status(500).json({
      error: 'プロキシエラー: ' + error.message,
      details: {
        name: error.name,
        message: error.message,
        target_url: targetURL
      },
      proxied: true
    });
  }
}