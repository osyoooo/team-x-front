'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api';
import { useUserStore } from '@/store/userStore';

export default function ApiTestPage() {
  const { token, user, isAuthenticated } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState({});
  const [questId, setQuestId] = useState('');
  const [error, setError] = useState('');
  const [jwtLoading, setJwtLoading] = useState(false);
  
  // 新しいAPIテスト用の状態
  const [loginEmail, setLoginEmail] = useState('shidaxshidax@gmail.com');
  const [userId, setUserId] = useState('1');
  const [projectId, setProjectId] = useState('1');
  const [yellStatus, setYellStatus] = useState('募集中');

  const testAPI = async (endpoint, method = 'GET', data = null, key) => {
    setLoading(true);
    setError('');
    
    try {
      let result;
      const fullURL = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api'}${endpoint}`;
      
      console.log(`🔍 [API Test] Starting ${method} request to: ${fullURL}`);
      
      if (method === 'GET') {
        result = await apiClient.get(endpoint);
      } else if (method === 'POST') {
        result = await apiClient.post(endpoint, data);
      }
      
      console.log(`✅ [API Test] Success:`, result);
      
      setResponses(prev => ({
        ...prev,
        [key]: {
          success: true,
          data: result,
          timestamp: new Date().toLocaleTimeString(),
          url: fullURL,
          method: method
        }
      }));
    } catch (err) {
      const fullURL = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api'}${endpoint}`;
      
      console.error(`❌ [API Test] Error:`, {
        message: err.message,
        url: fullURL,
        method: method,
        error: err
      });
      
      // より詳細なエラー情報を収集
      const errorDetails = {
        message: err.message,
        name: err.name,
        url: fullURL,
        method: method,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        // CORS特有の問題を検出
        isCORSError: err.message.includes('Failed to fetch') || err.message.includes('CORS'),
        // ネットワークエラーかどうかを判定
        isNetworkError: err.message.includes('Failed to fetch') || err.message.includes('NetworkError')
      };
      
      setError(`${err.message} (詳細はConsoleを確認してください)`);
      setResponses(prev => ({
        ...prev,
        [key]: {
          success: false,
          error: err.message,
          errorDetails: errorDetails,
          timestamp: new Date().toLocaleTimeString()
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  // JWT検証機能
  const verifyJWT = async () => {
    if (!token) {
      setError('ログインしてJWTトークンを取得してください');
      return;
    }

    setJwtLoading(true);
    setError('');

    try {
      const response = await fetch('/api/test/verify-jwt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();

      setResponses(prev => ({
        ...prev,
        jwtVerify: {
          success: response.ok,
          data: result,
          timestamp: new Date().toLocaleTimeString()
        }
      }));

    } catch (err) {
      setError(err.message);
      setResponses(prev => ({
        ...prev,
        jwtVerify: {
          success: false,
          error: err.message,
          timestamp: new Date().toLocaleTimeString()
        }
      }));
    } finally {
      setJwtLoading(false);
    }
  };

  // 直接fetchテスト（CORS問題診断用）
  const testDirectFetch = async (endpoint, method = 'GET', data = null, key) => {
    setLoading(true);
    setError('');
    
    const fullURL = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api'}${endpoint}`;
    
    try {
      console.log(`🔍 [Direct Fetch] Starting ${method} request to: ${fullURL}`);
      console.log(`🔍 [Direct Fetch] CORS診断モード - APIクライアントをバイパス`);
      
      const config = {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        }
      };
      
      if (data && method !== 'GET') {
        config.body = JSON.stringify(data);
      }
      
      // 認証ヘッダーは意図的に追加しない（CORS問題を分離するため）
      console.log(`🔍 [Direct Fetch] Request config:`, config);
      
      const response = await fetch(fullURL, config);
      
      console.log(`🔍 [Direct Fetch] Response status: ${response.status}`);
      console.log(`🔍 [Direct Fetch] Response headers:`, [...response.headers.entries()]);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log(`✅ [Direct Fetch] Success:`, result);
      
      setResponses(prev => ({
        ...prev,
        [`${key}_direct`]: {
          success: true,
          data: result,
          timestamp: new Date().toLocaleTimeString(),
          url: fullURL,
          method: method,
          note: "🔥 直接fetch成功！CORS問題は解決済み"
        }
      }));
      
    } catch (err) {
      console.error(`❌ [Direct Fetch] Error:`, {
        message: err.message,
        url: fullURL,
        method: method,
        error: err
      });
      
      const errorDetails = {
        message: err.message,
        name: err.name,
        url: fullURL,
        method: method,
        timestamp: new Date().toISOString(),
        isCORSError: err.message.includes('Failed to fetch') || err.message.includes('CORS'),
        isHTTPError: err.message.includes('HTTP'),
        diagnosis: err.message.includes('Failed to fetch') 
          ? "🚨 CORS問題: ブラウザがリクエストをブロックしています" 
          : err.message.includes('HTTP')
          ? "🔴 サーバーエラー: APIサーバーがエラーレスポンスを返しています"
          : "⚠️ その他のネットワークエラー"
      };
      
      setError(`Direct Fetch: ${err.message}`);
      setResponses(prev => ({
        ...prev,
        [`${key}_direct`]: {
          success: false,
          error: err.message,
          errorDetails: errorDetails,
          timestamp: new Date().toLocaleTimeString()
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  // プロキシ経由テスト（CORS回避）
  const testProxyAPI = async (proxyPath, method = 'GET', data = null, key) => {
    setLoading(true);
    setError('');
    
    const proxyURL = `/api/proxy/${proxyPath}`;
    
    try {
      console.log(`🔄 [Proxy Test] Starting ${method} request to: ${proxyURL}`);
      console.log(`🔄 [Proxy Test] CORS回避モード - Next.js API Routes経由`);
      
      const config = {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        }
      };
      
      // JWTトークンがある場合は追加
      if (typeof window !== 'undefined') {
        const userStore = JSON.parse(localStorage.getItem('user-storage') || '{}');
        if (userStore.state?.token) {
          config.headers.Authorization = `Bearer ${userStore.state.token}`;
        }
      }
      
      if (data && method !== 'GET') {
        config.body = JSON.stringify(data);
      }
      
      console.log(`🔄 [Proxy Test] Request config:`, config);
      
      const response = await fetch(proxyURL, config);
      
      console.log(`🔄 [Proxy Test] Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log(`✅ [Proxy Test] Success:`, result);
      
      setResponses(prev => ({
        ...prev,
        [`${key}_proxy`]: {
          success: true,
          data: result,
          timestamp: new Date().toLocaleTimeString(),
          url: proxyURL,
          method: method,
          note: "🔄 Next.js プロキシ経由で成功！CORS問題を回避"
        }
      }));
      
    } catch (err) {
      console.error(`❌ [Proxy Test] Error:`, {
        message: err.message,
        url: proxyURL,
        method: method,
        error: err
      });
      
      const errorDetails = {
        message: err.message,
        name: err.name,
        url: proxyURL,
        method: method,
        timestamp: new Date().toISOString(),
        isProxyError: true,
        diagnosis: "🔄 プロキシ経由でもエラー - APIサーバーまたはネットワークの問題"
      };
      
      setError(`Proxy Test: ${err.message}`);
      setResponses(prev => ({
        ...prev,
        [`${key}_proxy`]: {
          success: false,
          error: err.message,
          errorDetails: errorDetails,
          timestamp: new Date().toLocaleTimeString()
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  // クライアントサイドJWTデコード
  const decodeJWT = () => {
    if (!token) {
      setError('ログインしてJWTトークンを取得してください');
      return;
    }

    try {
      const [header, payload, signature] = token.split('.');
      
      const decodedHeader = JSON.parse(atob(header));
      const decodedPayload = JSON.parse(atob(payload));

      // 有効期限までの残り時間を計算
      const now = Math.floor(Date.now() / 1000);
      const expiresIn = decodedPayload.exp ? decodedPayload.exp - now : null;
      const isExpired = expiresIn !== null && expiresIn <= 0;
      
      // 残り時間を人間が読みやすい形式に変換
      const formatTimeRemaining = (seconds) => {
        if (seconds <= 0) return '期限切れ';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        if (hours > 0) {
          return `${hours}時間${minutes}分${secs}秒`;
        } else if (minutes > 0) {
          return `${minutes}分${secs}秒`;
        } else {
          return `${secs}秒`;
        }
      };

      // 日本時間でのフォーマット
      const formatJapanTime = (timestamp) => {
        if (!timestamp) return null;
        const date = new Date(timestamp * 1000);
        return date.toLocaleString('ja-JP', { 
          timeZone: 'Asia/Tokyo',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
      };

      setResponses(prev => ({
        ...prev,
        jwtDecode: {
          success: true,
          data: {
            // ヘッダー情報
            header: {
              algorithm: decodedHeader.alg,
              type: decodedHeader.typ,
              raw: decodedHeader
            },
            
            // ペイロード詳細情報
            payload: {
              // 基本認証情報
              user_id: decodedPayload.sub,
              email: decodedPayload.email,
              email_verified: decodedPayload.email_verified,
              phone: decodedPayload.phone,
              phone_verified: decodedPayload.phone_verified,
              
              // セッション情報
              session_id: decodedPayload.session_id,
              role: decodedPayload.role,
              aal: decodedPayload.aal, // Authentication Assurance Level
              amr: decodedPayload.amr, // Authentication Method Reference
              
              // メタデータ
              user_metadata: decodedPayload.user_metadata,
              app_metadata: decodedPayload.app_metadata,
              
              // 時刻情報（日本時間）
              issued_at: formatJapanTime(decodedPayload.iat),
              expires_at: formatJapanTime(decodedPayload.exp),
              not_before: formatJapanTime(decodedPayload.nbf),
              
              // 時刻情報（UNIXタイムスタンプ）
              issued_at_unix: decodedPayload.iat,
              expires_at_unix: decodedPayload.exp,
              not_before_unix: decodedPayload.nbf,
              
              // 有効期限情報
              is_expired: isExpired,
              expires_in_seconds: expiresIn,
              time_remaining: formatTimeRemaining(expiresIn || 0),
              
              // その他の情報
              issuer: decodedPayload.iss,
              audience: decodedPayload.aud,
              
              // 生のペイロード（全フィールド）
              raw: decodedPayload
            },
            
            // 署名情報
            signature: {
              value: signature.substring(0, 20) + '...',
              length: signature.length
            },
            
            // トークン構造情報
            token_structure: {
              total_length: token.length,
              header_length: header.length,
              payload_length: payload.length,
              signature_length: signature.length,
              parts_count: token.split('.').length
            }
          },
          timestamp: new Date().toLocaleTimeString('ja-JP')
        }
      }));

    } catch (err) {
      setError('JWTトークンのデコードに失敗しました: ' + err.message);
      setResponses(prev => ({
        ...prev,
        jwtDecode: {
          success: false,
          error: 'JWTトークンのデコードに失敗しました: ' + err.message,
          timestamp: new Date().toLocaleTimeString('ja-JP')
        }
      }));
    }
  };

  const formatResponse = (response) => {
    if (!response) return null;
    
    // Growth APIレスポンス用の特別なフォーマット
    if (response.success && response.data?.statistics && response.data?.activity_history) {
      const data = response.data;
      return (
        <div className="mt-4 space-y-4">
          <div className="flex justify-between items-center p-3 bg-green-100 rounded-lg">
            <span className="font-semibold text-green-800">✅ 成長データ取得成功</span>
            <span className="text-sm text-gray-600">{response.timestamp}</span>
          </div>

          {/* 統計情報 */}
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="font-semibold mb-3 text-gray-800">📊 統計情報</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-lg">
                <div className="text-sm text-gray-600">成長率</div>
                <div className="text-2xl font-bold text-purple-600">
                  {data.statistics.total_growth_rate}%
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <div className="text-sm text-gray-600">週間スコア増加</div>
                <div className="text-2xl font-bold text-blue-600">
                  +{data.statistics.weekly_score_increase}
                </div>
              </div>
            </div>
          </div>

          {/* 活動サマリー */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold mb-3 text-gray-800">📈 活動サマリー</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-white p-2 rounded text-center">
                <div className="text-gray-600">学習完了</div>
                <div className="text-lg font-bold">{data.activity_summary.completed_learning}</div>
              </div>
              <div className="bg-white p-2 rounded text-center">
                <div className="text-gray-600">クエスト完了</div>
                <div className="text-lg font-bold">{data.activity_summary.completed_quests}</div>
              </div>
              <div className="bg-white p-2 rounded text-center">
                <div className="text-gray-600">プロジェクト</div>
                <div className="text-lg font-bold">{data.activity_summary.projects}</div>
              </div>
              <div className="bg-white p-2 rounded text-center">
                <div className="text-gray-600">総時間</div>
                <div className="text-lg font-bold">{data.activity_summary.total_hours}h</div>
              </div>
            </div>
          </div>

          {/* 活動履歴 */}
          {data.activity_history && data.activity_history.length > 0 && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold mb-3 text-gray-800">🏆 最近の活動履歴</h4>
              <div className="space-y-2">
                {data.activity_history.slice(0, 3).map((activity) => (
                  <div key={activity.id} className="bg-white p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{activity.title}</div>
                        <div className="text-xs text-gray-500 mt-1">{activity.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-green-600">+{activity.points}pt</div>
                        <div className="text-xs text-gray-500">{activity.completed_date}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 生データ */}
          <details className="p-4 bg-gray-100 rounded-lg">
            <summary className="cursor-pointer font-semibold text-gray-700 hover:text-gray-900">
              🔍 生データを表示
            </summary>
            <pre className="mt-3 p-3 bg-white rounded text-xs overflow-x-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </details>
        </div>
      );
    }
    
    // Benefits APIレスポンス用の特別なフォーマット
    if (response.success && response.data?.benefits_map) {
      const data = response.data;
      return (
        <div className="mt-4 space-y-4">
          <div className="flex justify-between items-center p-3 bg-green-100 rounded-lg">
            <span className="font-semibold text-green-800">✅ 特典データ取得成功</span>
            <span className="text-sm text-gray-600">{response.timestamp}</span>
          </div>

          {/* 進捗情報 */}
          {data.next_benefit && (
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <h4 className="font-semibold mb-3 text-gray-800">🎯 次の特典まで</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>現在のスコア: {data.next_benefit.current_score}</span>
                  <span>次の特典: {data.next_benefit.next_score}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-indigo-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${data.next_benefit.progress_percent}%` }}
                  ></div>
                </div>
                <div className="text-center text-xs text-gray-600">
                  進捗: {data.next_benefit.progress_percent}%
                </div>
              </div>
            </div>
          )}

          {/* 特典カウント */}
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex justify-around text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{data.unlocked_count}</div>
                <div className="text-sm text-gray-600">解放済み</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">{data.total_count}</div>
                <div className="text-sm text-gray-600">全特典</div>
              </div>
            </div>
          </div>

          {/* 特典一覧 */}
          {data.benefits_map && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold mb-3 text-gray-800">🎁 特典一覧</h4>
              <div className="space-y-2">
                {data.benefits_map.slice(0, 5).map((benefit) => (
                  <div key={benefit.id} className={`p-3 rounded-lg border ${
                    benefit.status === 'unlocked' ? 'bg-green-50 border-green-200' :
                    benefit.status === 'used' ? 'bg-gray-100 border-gray-300' :
                    'bg-white border-gray-200'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium">{benefit.title}</div>
                        <div className="text-xs text-gray-600 mt-1">{benefit.description}</div>
                      </div>
                      <div className="ml-4 text-right">
                        <div className="text-sm font-bold text-indigo-600">{benefit.score}pt</div>
                        <div className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
                          benefit.status === 'unlocked' ? 'bg-green-100 text-green-800' :
                          benefit.status === 'used' ? 'bg-gray-200 text-gray-600' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {benefit.status === 'unlocked' ? '解放済み' :
                           benefit.status === 'used' ? '使用済み' : 'ロック中'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 生データ */}
          <details className="p-4 bg-gray-100 rounded-lg">
            <summary className="cursor-pointer font-semibold text-gray-700 hover:text-gray-900">
              🔍 生データを表示
            </summary>
            <pre className="mt-3 p-3 bg-white rounded text-xs overflow-x-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </details>
        </div>
      );
    }
    
    // Yell Projects APIレスポンス用の特別なフォーマット
    if (response.success && response.data?.projects && response.data?.tabs) {
      const data = response.data;
      return (
        <div className="mt-4 space-y-4">
          <div className="flex justify-between items-center p-3 bg-green-100 rounded-lg">
            <span className="font-semibold text-green-800">✅ プロジェクト一覧取得成功</span>
            <span className="text-sm text-gray-600">{response.timestamp}</span>
          </div>

          {/* タブとカウント */}
          <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-gray-800">📁 プロジェクトステータス</h4>
              <span className="text-sm text-gray-600">合計: {data.total_count}件</span>
            </div>
            <div className="flex gap-2">
              {data.tabs.map((tab) => (
                <span key={tab} className={`px-3 py-1 rounded text-sm ${
                  tab === data.active_tab 
                    ? 'bg-pink-500 text-white' 
                    : 'bg-white text-gray-600'
                }`}>
                  {tab}
                </span>
              ))}
            </div>
          </div>

          {/* プロジェクト一覧 */}
          {data.projects && data.projects.length > 0 && (
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <h4 className="font-semibold mb-3 text-gray-800">🚀 プロジェクト</h4>
              <div className="space-y-3">
                {data.projects.map((project) => (
                  <div key={project.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="font-medium">{project.title}</div>
                        <div className="text-xs text-gray-600 mt-1">
                          カテゴリー: {project.category}
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        project.status === '募集中' ? 'bg-green-100 text-green-800' :
                        project.status === '実行中' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    
                    {/* 進捗バー */}
                    <div className="mb-2">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>目標: ¥{project.target_amount?.toLocaleString()}</span>
                        <span>{project.progress_percent}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-pink-500 h-2 rounded-full"
                          style={{ width: `${project.progress_percent}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>支援者: {project.supporters_count}人</span>
                      <span>残り{project.days_left}日</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 生データ */}
          <details className="p-4 bg-gray-100 rounded-lg">
            <summary className="cursor-pointer font-semibold text-gray-700 hover:text-gray-900">
              🔍 生データを表示
            </summary>
            <pre className="mt-3 p-3 bg-white rounded text-xs overflow-x-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </details>
        </div>
      );
    }
    
    // Yell Project Detail APIレスポンス用の特別なフォーマット
    if (response.success && response.data?.owner && response.data?.target_amount) {
      const data = response.data;
      return (
        <div className="mt-4 space-y-4">
          <div className="flex justify-between items-center p-3 bg-green-100 rounded-lg">
            <span className="font-semibold text-green-800">✅ プロジェクト詳細取得成功</span>
            <span className="text-sm text-gray-600">{response.timestamp}</span>
          </div>

          {/* プロジェクト基本情報 */}
          <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
            <h4 className="font-semibold text-lg mb-3">{data.title}</h4>
            
            {/* オーナー情報 */}
            <div className="flex items-center mb-3 p-2 bg-white rounded">
              <div className="ml-3">
                <div className="font-medium">{data.owner.name}</div>
                <div className="text-xs text-gray-600">
                  {data.owner.school} {data.owner.grade}
                </div>
              </div>
            </div>
            
            {/* 資金調達進捗 */}
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>現在: ¥{data.current_amount?.toLocaleString()}</span>
                <span>目標: ¥{data.target_amount?.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-pink-500 h-3 rounded-full"
                  style={{ width: `${(data.current_amount / data.target_amount * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* サポート状態 */}
            <div className="flex gap-2">
              {data.can_support && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  支援可能
                </span>
              )}
              {data.is_supported && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  支援済み
                </span>
              )}
            </div>
          </div>

          {/* プロジェクト説明 */}
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <h4 className="font-semibold mb-2">📝 プロジェクト詳細</h4>
            {data.why_description && (
              <div className="mb-3">
                <h5 className="text-sm font-medium text-gray-700 mb-1">なぜやるのか</h5>
                <p className="text-sm text-gray-600">{data.why_description.substring(0, 100)}...</p>
              </div>
            )}
            {data.what_description && (
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-1">何をやるのか</h5>
                <p className="text-sm text-gray-600">{data.what_description.substring(0, 100)}...</p>
              </div>
            )}
          </div>

          {/* 生データ */}
          <details className="p-4 bg-gray-100 rounded-lg">
            <summary className="cursor-pointer font-semibold text-gray-700 hover:text-gray-900">
              🔍 生データを表示
            </summary>
            <pre className="mt-3 p-3 bg-white rounded text-xs overflow-x-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </details>
        </div>
      );
    }
    
    // Profile APIレスポンス用の特別なフォーマット
    if (response.success && response.data?.user && response.data?.skill_scores) {
      const data = response.data;
      const user = data.user;
      const skills = data.skill_scores;
      const staffProgress = data.staff_progress;
      const ranking = data.ranking;
      
      return (
        <div className="mt-4 space-y-4">
          {/* ステータスヘッダー */}
          <div className="flex justify-between items-center p-3 bg-green-100 rounded-lg">
            <span className="font-semibold text-green-800">✅ プロフィール取得成功</span>
            <span className="text-sm text-gray-600">{response.timestamp}</span>
          </div>

          {/* ユーザー基本情報 */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold mb-2 text-gray-800">👤 ユーザー情報</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">ユーザーID:</span>
                <span className="ml-2 font-mono text-xs bg-white px-2 py-1 rounded">
                  {user.id}
                </span>
              </div>
              <div>
                <span className="text-gray-600">メール:</span>
                <span className="ml-2">{user.email}</span>
              </div>
              <div>
                <span className="text-gray-600">表示名:</span>
                <span className="ml-2 font-medium">{user.display_name}</span>
              </div>
              <div>
                <span className="text-gray-600">総合スコア:</span>
                <span className="ml-2 text-lg font-bold text-blue-600">
                  {user.current_total_score} pt
                </span>
              </div>
            </div>
          </div>

          {/* スキルスコア */}
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="font-semibold mb-3 text-gray-800">💪 スキルスコア</h4>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(skills).map(([key, value]) => (
                <div key={key} className="bg-white p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium capitalize text-gray-700">{key}</span>
                    <span className="text-lg font-bold text-purple-600">{value}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (value / 1000) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* スタッフ進捗 */}
          {staffProgress && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold mb-3 text-gray-800">📈 スタッフ進捗</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{staffProgress.title}</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {staffProgress.category}
                  </span>
                </div>
                <div className="flex space-x-2">
                  {staffProgress.progress.map((completed, index) => (
                    <div
                      key={index}
                      className={`flex-1 h-3 rounded-full ${
                        completed ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    ></div>
                  ))}
                </div>
                <div className="text-xs text-gray-600">
                  Step {staffProgress.step} - 
                  {staffProgress.progress.filter(p => p).length}/{staffProgress.progress.length} 完了
                </div>
              </div>
            </div>
          )}

          {/* ランキング情報 */}
          {ranking && ranking.length > 0 && (
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-semibold mb-3 text-gray-800">🏆 ランキング</h4>
              <div className="space-y-2">
                {ranking.map((item, index) => (
                  <div key={index} className="bg-white p-3 rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-bold text-yellow-600">
                        #{item.rank}
                      </span>
                      <div>
                        <div className="text-sm font-medium">{item.title}</div>
                        <div className="text-xs text-gray-500">{item.category}</div>
                      </div>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {item.participants}
                    </span>
                  </div>
                ))}
                {data.total_participants && (
                  <div className="text-center text-xs text-gray-500 mt-2">
                    総参加者数: {data.total_participants}人
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 生データ（折りたたみ可能） */}
          <details className="p-4 bg-gray-100 rounded-lg">
            <summary className="cursor-pointer font-semibold text-gray-700 hover:text-gray-900">
              🔍 生データを表示（クリックで展開）
            </summary>
            <pre className="mt-3 p-3 bg-white rounded text-xs overflow-x-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </details>
        </div>
      );
    }
    
    // JWT デコードレスポンス用の特別なフォーマット
    if (response.success && response.data?.header && response.data?.payload) {
      const data = response.data;
      const payload = data.payload;
      
      return (
        <div className="mt-4 space-y-4">
          {/* ステータスヘッダー */}
          <div className="flex justify-between items-center p-3 bg-green-100 rounded-lg">
            <span className="font-semibold text-green-800">✅ デコード成功</span>
            <span className="text-sm text-gray-600">{response.timestamp}</span>
          </div>

          {/* 有効期限情報 */}
          <div className={`p-4 rounded-lg ${payload.is_expired ? 'bg-red-100 border-red-300' : 'bg-green-50 border-green-300'} border`}>
            <h4 className="font-semibold mb-2 text-gray-800">📅 有効期限情報</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">ステータス:</span>
                <span className={`ml-2 font-medium ${payload.is_expired ? 'text-red-600' : 'text-green-600'}`}>
                  {payload.is_expired ? '❌ 期限切れ' : '✅ 有効'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">残り時間:</span>
                <span className={`ml-2 font-medium ${payload.is_expired ? 'text-red-600' : 'text-blue-600'}`}>
                  {payload.time_remaining}
                </span>
              </div>
              <div>
                <span className="text-gray-600">発行日時:</span>
                <span className="ml-2">{payload.issued_at || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-600">有効期限:</span>
                <span className="ml-2">{payload.expires_at || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* ユーザー情報 */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold mb-2 text-gray-800">👤 ユーザー情報</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">ユーザーID:</span>
                <span className="ml-2 font-mono text-xs bg-white px-2 py-1 rounded">
                  {payload.user_id || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">メール:</span>
                <span className="ml-2">{payload.email || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-600">メール認証:</span>
                <span className="ml-2">
                  {payload.email_verified ? '✅ 認証済み' : '❌ 未認証'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">ロール:</span>
                <span className="ml-2 bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                  {payload.role || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* セッション情報 */}
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-semibold mb-2 text-gray-800">🔐 セッション情報</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">セッションID:</span>
                <span className="ml-2 font-mono text-xs bg-white px-2 py-1 rounded">
                  {payload.session_id || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">認証レベル (AAL):</span>
                <span className="ml-2">{payload.aal || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-600">認証方法 (AMR):</span>
                <span className="ml-2">
                  {Array.isArray(payload.amr) ? payload.amr.join(', ') : payload.amr || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* トークン構造 */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-semibold mb-2 text-gray-800">📊 トークン構造</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <span className="text-gray-600 block">全体:</span>
                <span className="font-mono text-xs">{data.token_structure.total_length} 文字</span>
              </div>
              <div>
                <span className="text-gray-600 block">ヘッダー:</span>
                <span className="font-mono text-xs">{data.token_structure.header_length} 文字</span>
              </div>
              <div>
                <span className="text-gray-600 block">ペイロード:</span>
                <span className="font-mono text-xs">{data.token_structure.payload_length} 文字</span>
              </div>
              <div>
                <span className="text-gray-600 block">署名:</span>
                <span className="font-mono text-xs">{data.token_structure.signature_length} 文字</span>
              </div>
            </div>
          </div>

          {/* メタデータ（存在する場合） */}
          {(payload.user_metadata || payload.app_metadata) && (
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold mb-2 text-gray-800">📝 メタデータ</h4>
              {payload.user_metadata && (
                <div className="mb-2">
                  <span className="text-sm text-gray-600">ユーザーメタデータ:</span>
                  <pre className="mt-1 p-2 bg-white rounded text-xs overflow-x-auto">
                    {JSON.stringify(payload.user_metadata, null, 2)}
                  </pre>
                </div>
              )}
              {payload.app_metadata && (
                <div>
                  <span className="text-sm text-gray-600">アプリメタデータ:</span>
                  <pre className="mt-1 p-2 bg-white rounded text-xs overflow-x-auto">
                    {JSON.stringify(payload.app_metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* 生データ（折りたたみ可能） */}
          <details className="p-4 bg-gray-100 rounded-lg">
            <summary className="cursor-pointer font-semibold text-gray-700 hover:text-gray-900">
              🔍 生データを表示（クリックで展開）
            </summary>
            <pre className="mt-3 p-3 bg-white rounded text-xs overflow-x-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </details>
        </div>
      );
    }
    
    // デフォルトのフォーマット（通常のAPIレスポンス用）
    return (
      <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
        <div className="flex justify-between items-center mb-2">
          <span className={`font-semibold ${response.success ? 'text-green-600' : 'text-red-600'}`}>
            {response.success ? 'SUCCESS' : 'ERROR'}
          </span>
          <span className="text-sm text-gray-500">{response.timestamp}</span>
        </div>
        <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
          {JSON.stringify(response.success ? response.data : { error: response.error }, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">API Test Page</h1>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="font-semibold mb-2">Current API Base URL:</h2>
        <code className="text-sm">{process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api'}</code>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Global Error: {error}
        </div>
      )}

      <div className="space-y-8">
        {/* JWT Token Verification Section */}
        <div className="bg-purple-50 p-4 rounded-lg mb-6">
          <h2 className="text-2xl font-bold text-purple-800 mb-2">JWT Token Verification</h2>
          <p className="text-sm text-purple-700">ログイン認証で取得したJWTトークンの検証とデバッグ機能</p>
        </div>

        {/* Current Token Status */}
        <div className="border border-purple-200 p-6 rounded-lg bg-purple-50">
          <h3 className="text-xl font-semibold mb-4">現在の認証状態</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <span className="text-sm text-gray-600">認証状態:</span>
              <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
                isAuthenticated 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {isAuthenticated ? 'ログイン中' : '未ログイン'}
              </span>
            </div>
            
            {user && (
              <div>
                <span className="text-sm text-gray-600">ユーザー:</span>
                <span className="ml-2 text-sm font-medium">{user.email}</span>
              </div>
            )}
          </div>

          {token && (
            <div className="mb-4">
              <span className="text-sm text-gray-600">JWT Token (最初の50文字):</span>
              <div className="mt-1 p-2 bg-gray-100 rounded text-xs font-mono break-all">
                {token.substring(0, 50)}...
              </div>
            </div>
          )}

          {!isAuthenticated && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
              JWT検証機能を使用するには、まず<a href="/login" className="underline hover:text-yellow-900">ログイン</a>してください。
            </div>
          )}
        </div>

        {/* Server-side JWT Verification */}
        <div className="border border-purple-200 p-6 rounded-lg bg-purple-50">
          <h3 className="text-xl font-semibold mb-4">1. サーバーサイドJWT検証</h3>
          <p className="text-sm text-gray-600 mb-4">POST /api/test/verify-jwt - Supabaseサーバーでトークンを検証</p>
          <p className="text-xs text-purple-600 mb-4">✓ 署名検証・有効期限確認・ユーザー存在確認</p>
          
          <button
            onClick={verifyJWT}
            disabled={jwtLoading || !token}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {jwtLoading ? 'サーバー検証中...' : 'サーバーで検証'}
          </button>
          
          {formatResponse(responses.jwtVerify)}
        </div>

        {/* Client-side JWT Decode */}
        <div className="border border-purple-200 p-6 rounded-lg bg-purple-50">
          <h3 className="text-xl font-semibold mb-4">2. クライアントサイドJWTデコード</h3>
          <p className="text-sm text-gray-600 mb-2">JavaScriptでのBase64デコード - ペイロード内容の確認</p>
          <p className="text-xs text-orange-600 mb-4">⚠️ 署名検証は行いません（内容確認のみ）</p>
          
          <button
            onClick={decodeJWT}
            disabled={!token}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            クライアントでデコード
          </button>
          
          {formatResponse(responses.jwtDecode)}
        </div>

        {/* V2 APIs Section */}
        <div className="bg-green-50 p-4 rounded-lg mb-6">
          <h2 className="text-2xl font-bold text-green-800 mb-2">V2 APIs (Current/Latest)</h2>
          <p className="text-sm text-green-700">これらのAPIは最新版で、recommended_skills_displayフィールドなど新機能が含まれています。</p>
        </div>

        {/* 1. Available Quests V2 */}
        <div className="border border-green-200 p-6 rounded-lg bg-green-50">
          <h3 className="text-xl font-semibold mb-4">1. Get Available Quests (V2)</h3>
          <p className="text-sm text-gray-600 mb-2">GET /api/v1/quests/v2/available</p>
          <p className="text-xs text-green-600 mb-4">✓ recommended_skills_displayフィールドを含む</p>
          
          <button
            onClick={() => testAPI('/api/v1/quests/v2/available', 'GET', null, 'availableV2')}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test V2 API'}
          </button>
          
          {formatResponse(responses.availableV2)}
        </div>

        {/* 2. In Progress Quests V2 */}
        <div className="border border-green-200 p-6 rounded-lg bg-green-50">
          <h3 className="text-xl font-semibold mb-4">2. Get In Progress Quests (V2)</h3>
          <p className="text-sm text-gray-600 mb-2">GET /api/v1/quests/v2/in-progress</p>
          <p className="text-xs text-green-600 mb-4">✓ recommended_skills_displayフィールドを含む</p>
          
          <button
            onClick={() => testAPI('/api/v1/quests/v2/in-progress', 'GET', null, 'inProgressV2')}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test V2 API'}
          </button>
          
          {formatResponse(responses.inProgressV2)}
        </div>

        {/* 3. Upcoming Quests V2 */}
        <div className="border border-green-200 p-6 rounded-lg bg-green-50">
          <h3 className="text-xl font-semibold mb-4">3. Get Upcoming Quests (V2)</h3>
          <p className="text-sm text-gray-600 mb-2">GET /api/v1/quests/v2/upcoming</p>
          <p className="text-xs text-green-600 mb-4">✓ recommended_skills_displayフィールドを含む</p>
          
          <button
            onClick={() => testAPI('/api/v1/quests/v2/upcoming', 'GET', null, 'upcomingV2')}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test V2 API'}
          </button>
          
          {formatResponse(responses.upcomingV2)}
        </div>

        {/* Study APIs Section */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h2 className="text-2xl font-bold text-blue-800 mb-2">Study APIs</h2>
          <p className="text-sm text-blue-700">学習関連のAPI - ダッシュボード情報と学習コンテンツの取得</p>
        </div>

        {/* 1. Study Dashboard */}
        <div className="border border-blue-200 p-6 rounded-lg bg-blue-50">
          <h3 className="text-xl font-semibold mb-4">1. Get Study Dashboard</h3>
          <p className="text-sm text-gray-600 mb-2">GET /api/v1/study/dashboard</p>
          <p className="text-xs text-blue-600 mb-4">✓ 学習の進捗やダッシュボード情報を取得</p>
          
          <button
            onClick={() => testAPI('/api/v1/study/dashboard', 'GET', null, 'studyDashboard')}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Study Dashboard'}
          </button>
          
          {formatResponse(responses.studyDashboard)}
        </div>

        {/* 2. Study Contents */}
        <div className="border border-blue-200 p-6 rounded-lg bg-blue-50">
          <h3 className="text-xl font-semibold mb-4">2. Get Study Contents</h3>
          <p className="text-sm text-gray-600 mb-2">GET /api/v1/study/contents</p>
          <p className="text-xs text-blue-600 mb-4">✓ 利用可能な学習コンテンツ一覧を取得</p>
          
          <button
            onClick={() => testAPI('/api/v1/study/contents', 'GET', null, 'studyContents')}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Study Contents'}
          </button>
          
          {formatResponse(responses.studyContents)}
        </div>

        {/* Profile API Section */}
        <div className="bg-red-50 p-4 rounded-lg mb-6">
          <h2 className="text-2xl font-bold text-red-800 mb-2">Profile API</h2>
          <p className="text-sm text-red-700">ユーザープロフィール、スキルスコア、進捗状況、ランキング情報の取得</p>
          
          {/* CORS診断ガイド */}
          <div className="mt-4 p-3 bg-white rounded border border-red-200">
            <h4 className="font-semibold text-red-800 mb-2">🚨 CORS問題診断ガイド</h4>
            <div className="text-xs text-red-700 space-y-1">
              <p><strong>1. 「Failed to fetch」エラー</strong> → CORS問題の可能性が高い</p>
              <p><strong>2. Direct Fetch Test</strong> → APIクライアントをバイパスして直接テスト</p>
              <p><strong>3. Proxy Test</strong> → Next.js API Routes経由でCORS問題を回避</p>
              <p><strong>4. Console確認</strong> → F12開発者ツールで詳細なエラーログを確認</p>
              <p><strong>5. Network Tab</strong> → リクエスト/レスポンスヘッダーとステータスコードを確認</p>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="border border-red-200 p-6 rounded-lg bg-red-50">
          <h3 className="text-xl font-semibold mb-4">Get User Profile</h3>
          <p className="text-sm text-gray-600 mb-2">GET /api/v1/profile</p>
          <p className="text-xs text-red-600 mb-4">✓ ユーザー基本情報、スキルスコア、スタッフ進捗、ランキングを一括取得</p>
          
          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={() => testAPI('/api/v1/profile', 'GET', null, 'userProfile')}
              disabled={loading}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Profile API'}
            </button>
            
            <button
              onClick={() => testDirectFetch('/api/v1/profile', 'GET', null, 'userProfile')}
              disabled={loading}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? 'Testing...' : '🔥 Direct Fetch Test'}
            </button>
            
            <button
              onClick={() => testProxyAPI('profile', 'GET', null, 'userProfile')}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Testing...' : '🔄 Proxy Test'}
            </button>
          </div>
          
          {formatResponse(responses.userProfile)}
          {responses.userProfile_direct && (
            <div className="mt-4">
              <h4 className="font-semibold text-orange-600 mb-2">🔥 Direct Fetch Result:</h4>
              {formatResponse(responses.userProfile_direct)}
            </div>
          )}
          {responses.userProfile_proxy && (
            <div className="mt-4">
              <h4 className="font-semibold text-blue-600 mb-2">🔄 Proxy Test Result:</h4>
              {formatResponse(responses.userProfile_proxy)}
            </div>
          )}
        </div>

        {/* Auth APIs Section */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Auth APIs</h2>
          <p className="text-sm text-gray-700">認証関連のAPI - ログインとユーザー情報の取得</p>
        </div>

        {/* 1. Login API */}
        <div className="border border-gray-200 p-6 rounded-lg bg-gray-50">
          <h3 className="text-xl font-semibold mb-4">1. Login with Email</h3>
          <p className="text-sm text-gray-600 mb-2">POST /api/v1/auth/login</p>
          <p className="text-xs text-gray-600 mb-4">✓ メールアドレスでログイン（開発環境用のモックAPI）</p>
          
          <div className="mb-4">
            <label htmlFor="loginEmail" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address:
            </label>
            <input
              type="email"
              id="loginEmail"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="Enter email address"
              className="border border-gray-300 rounded px-3 py-2 w-full md:w-96"
            />
          </div>
          
          <button
            onClick={() => testAPI('/api/v1/auth/login', 'POST', { email: loginEmail }, 'authLogin')}
            disabled={loading || !loginEmail.trim()}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Login API'}
          </button>
          
          {formatResponse(responses.authLogin)}
        </div>

        {/* 2. Get User Info */}
        <div className="border border-gray-200 p-6 rounded-lg bg-gray-50">
          <h3 className="text-xl font-semibold mb-4">2. Get User Information</h3>
          <p className="text-sm text-gray-600 mb-2">GET /api/v1/auth/users/{'{user_id}'}</p>
          <p className="text-xs text-gray-600 mb-4">✓ 特定のユーザー情報を取得</p>
          
          <div className="mb-4">
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
              User ID:
            </label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter user ID (e.g., 1)"
              className="border border-gray-300 rounded px-3 py-2 w-full md:w-64"
            />
          </div>
          
          <button
            onClick={() => testAPI(`/api/v1/auth/users/${userId}`, 'GET', null, 'authUserInfo')}
            disabled={loading || !userId.trim()}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Get User API'}
          </button>
          
          {formatResponse(responses.authUserInfo)}
        </div>

        {/* Growth APIs Section */}
        <div className="bg-purple-50 p-4 rounded-lg mb-6">
          <h2 className="text-2xl font-bold text-purple-800 mb-2">Growth APIs</h2>
          <p className="text-sm text-purple-700">成長データ - 統計、活動履歴、グラフデータの取得</p>
        </div>

        {/* 1. Growth Sample Data */}
        <div className="border border-purple-200 p-6 rounded-lg bg-purple-50">
          <h3 className="text-xl font-semibold mb-4">1. Get Growth Data (Sample)</h3>
          <p className="text-sm text-gray-600 mb-2">GET /api/v1/growth</p>
          <p className="text-xs text-purple-600 mb-4">✓ サンプルの成長データ（統計、活動履歴、グラフデータ）</p>
          
          <button
            onClick={() => testAPI('/api/v1/growth', 'GET', null, 'growthSample')}
            disabled={loading}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Sample Growth API'}
          </button>
          
          {formatResponse(responses.growthSample)}
        </div>

        {/* 2. Growth Real Data */}
        <div className="border border-purple-200 p-6 rounded-lg bg-purple-50">
          <h3 className="text-xl font-semibold mb-4">2. Get Growth Data (Real)</h3>
          <p className="text-sm text-gray-600 mb-2">GET /api/v1/growth/real</p>
          <p className="text-xs text-purple-600 mb-4">✓ 実際の成長データ（認証が必要）</p>
          
          <button
            onClick={() => testAPI('/api/v1/growth/real', 'GET', null, 'growthReal')}
            disabled={loading}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Real Growth API'}
          </button>
          
          {formatResponse(responses.growthReal)}
        </div>

        {/* Benefits APIs Section */}
        <div className="bg-indigo-50 p-4 rounded-lg mb-6">
          <h2 className="text-2xl font-bold text-indigo-800 mb-2">Benefits APIs</h2>
          <p className="text-sm text-indigo-700">特典データ - 解放済み特典と次の特典までの進捗</p>
        </div>

        {/* 1. Benefits Sample Data */}
        <div className="border border-indigo-200 p-6 rounded-lg bg-indigo-50">
          <h3 className="text-xl font-semibold mb-4">1. Get Benefits (Sample)</h3>
          <p className="text-sm text-gray-600 mb-2">GET /api/v1/benefits</p>
          <p className="text-xs text-indigo-600 mb-4">✓ サンプルの特典データ（解放済み・未解放の特典一覧）</p>
          
          <button
            onClick={() => testAPI('/api/v1/benefits', 'GET', null, 'benefitsSample')}
            disabled={loading}
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Sample Benefits API'}
          </button>
          
          {formatResponse(responses.benefitsSample)}
        </div>

        {/* 2. Benefits Real Data */}
        <div className="border border-indigo-200 p-6 rounded-lg bg-indigo-50">
          <h3 className="text-xl font-semibold mb-4">2. Get Benefits (Real)</h3>
          <p className="text-sm text-gray-600 mb-2">GET /api/v1/benefits/real</p>
          <p className="text-xs text-indigo-600 mb-4">✓ 実際の特典データ（認証が必要）</p>
          
          <button
            onClick={() => testAPI('/api/v1/benefits/real', 'GET', null, 'benefitsReal')}
            disabled={loading}
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Real Benefits API'}
          </button>
          
          {formatResponse(responses.benefitsReal)}
        </div>

        {/* Yell APIs Section */}
        <div className="bg-pink-50 p-4 rounded-lg mb-6">
          <h2 className="text-2xl font-bold text-pink-800 mb-2">Yell APIs</h2>
          <p className="text-sm text-pink-700">応援プロジェクト - プロジェクト一覧と詳細情報の取得</p>
        </div>

        {/* 1. Yell Projects List */}
        <div className="border border-pink-200 p-6 rounded-lg bg-pink-50">
          <h3 className="text-xl font-semibold mb-4">1. Get Yell Projects</h3>
          <p className="text-sm text-gray-600 mb-2">GET /api/v1/yell/projects</p>
          <p className="text-xs text-pink-600 mb-4">✓ プロジェクト一覧（ステータスでフィルタリング可能）</p>
          
          <div className="mb-4">
            <label htmlFor="yellStatus" className="block text-sm font-medium text-gray-700 mb-2">
              Status Filter:
            </label>
            <select
              id="yellStatus"
              value={yellStatus}
              onChange={(e) => setYellStatus(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full md:w-64"
            >
              <option value="">全て</option>
              <option value="企画中">企画中</option>
              <option value="募集中">募集中</option>
              <option value="実行中">実行中</option>
            </select>
          </div>
          
          <button
            onClick={() => {
              const params = yellStatus ? `?status=${encodeURIComponent(yellStatus)}` : '';
              testAPI(`/api/v1/yell/projects${params}`, 'GET', null, 'yellProjects');
            }}
            disabled={loading}
            className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Projects API'}
          </button>
          
          {formatResponse(responses.yellProjects)}
        </div>

        {/* 2. Yell Project Detail */}
        <div className="border border-pink-200 p-6 rounded-lg bg-pink-50">
          <h3 className="text-xl font-semibold mb-4">2. Get Yell Project Detail</h3>
          <p className="text-sm text-gray-600 mb-2">GET /api/v1/yell/projects/{'{project_id}'}</p>
          <p className="text-xs text-pink-600 mb-4">✓ プロジェクトの詳細情報</p>
          
          <div className="mb-4">
            <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-2">
              Project ID:
            </label>
            <input
              type="text"
              id="projectId"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="Enter project ID (e.g., 1)"
              className="border border-gray-300 rounded px-3 py-2 w-full md:w-64"
            />
          </div>
          
          <button
            onClick={() => testAPI(`/api/v1/yell/projects/${projectId}`, 'GET', null, 'yellProjectDetail')}
            disabled={loading || !projectId.trim()}
            className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Project Detail API'}
          </button>
          
          {formatResponse(responses.yellProjectDetail)}
        </div>

        {/* V1 APIs Section */}
        <div className="bg-yellow-50 p-4 rounded-lg mb-6">
          <h2 className="text-2xl font-bold text-yellow-800 mb-2">V1 APIs (Legacy)</h2>
          <p className="text-sm text-yellow-700">これらのAPIは従来版です。比較用として残しています。</p>
        </div>

        {/* 1. Available Quests V1 */}
        <div className="border border-yellow-200 p-6 rounded-lg bg-yellow-50">
          <h3 className="text-xl font-semibold mb-4">1. Get Available Quests (V1)</h3>
          <p className="text-sm text-gray-600 mb-4">GET /api/v1/quests/available</p>
          
          <button
            onClick={() => testAPI('/api/v1/quests/available', 'GET', null, 'available')}
            disabled={loading}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test V1 API'}
          </button>
          
          {formatResponse(responses.available)}
        </div>

        {/* 2. In Progress Quests V1 */}
        <div className="border border-yellow-200 p-6 rounded-lg bg-yellow-50">
          <h3 className="text-xl font-semibold mb-4">2. Get In Progress Quests (V1)</h3>
          <p className="text-sm text-gray-600 mb-4">GET /api/v1/quests/in-progress</p>
          
          <button
            onClick={() => testAPI('/api/v1/quests/in-progress', 'GET', null, 'inProgress')}
            disabled={loading}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test V1 API'}
          </button>
          
          {formatResponse(responses.inProgress)}
        </div>

        {/* 3. Upcoming Quests V1 */}
        <div className="border border-yellow-200 p-6 rounded-lg bg-yellow-50">
          <h3 className="text-xl font-semibold mb-4">3. Get Upcoming Quests (V1)</h3>
          <p className="text-sm text-gray-600 mb-4">GET /api/v1/quests/upcoming</p>
          
          <button
            onClick={() => testAPI('/api/v1/quests/upcoming', 'GET', null, 'upcoming')}
            disabled={loading}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test V1 API'}
          </button>
          
          {formatResponse(responses.upcoming)}
        </div>

        {/* 4. Quest Detail */}
        <div className="border border-gray-200 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">4. Get Quest Detail</h3>
          <p className="text-sm text-gray-600 mb-4">GET /api/v1/quests/{'{quest_id}'}</p>
          
          <div className="mb-4">
            <label htmlFor="questId" className="block text-sm font-medium text-gray-700 mb-2">
              Quest ID:
            </label>
            <input
              type="text"
              id="questId"
              value={questId}
              onChange={(e) => setQuestId(e.target.value)}
              placeholder="Enter quest ID (e.g., 1)"
              className="border border-gray-300 rounded px-3 py-2 w-full md:w-64"
            />
          </div>
          
          <button
            onClick={() => testAPI(`/api/v1/quests/${questId}`, 'GET', null, 'detail')}
            disabled={loading || !questId.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test API'}
          </button>
          
          {formatResponse(responses.detail)}
        </div>

        {/* 5. Apply to Quest */}
        <div className="border border-gray-200 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">5. Apply to Quest</h3>
          <p className="text-sm text-gray-600 mb-4">POST /api/v1/quests/apply</p>
          
          <div className="mb-4">
            <label htmlFor="applyQuestId" className="block text-sm font-medium text-gray-700 mb-2">
              Quest ID to Apply:
            </label>
            <input
              type="text"
              id="applyQuestId"
              value={questId}
              onChange={(e) => setQuestId(e.target.value)}
              placeholder="Enter quest ID (e.g., 1)"
              className="border border-gray-300 rounded px-3 py-2 w-full md:w-64"
            />
          </div>
          
          <button
            onClick={() => testAPI('/api/v1/quests/apply', 'POST', { quest_id: parseInt(questId) }, 'apply')}
            disabled={loading || !questId.trim()}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Apply to Quest'}
          </button>
          
          {formatResponse(responses.apply)}
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Testing Instructions:</h3>
        <ol className="text-sm text-gray-700 list-decimal list-inside space-y-1">
          <li><strong>JWT認証テスト:</strong> まず<a href="/login" className="underline text-blue-600 hover:text-blue-800">ログイン</a>してJWTトークンを取得</li>
          <li><strong>JWT検証:</strong> サーバーサイド検証でトークンの有効性を確認</li>
          <li><strong>JWTデコード:</strong> クライアントサイドデコードでペイロード内容を確認</li>
          <li><strong>Auth APIテスト:</strong> Login APIでメールアドレス認証、Get User APIでユーザー情報取得をテスト</li>
          <li><strong>Growth APIテスト:</strong> サンプルと実データの成長統計・活動履歴・グラフデータを確認</li>
          <li><strong>Benefits APIテスト:</strong> サンプルと実データの特典情報・解放状況・進捗を確認</li>
          <li><strong>Yell APIテスト:</strong> プロジェクト一覧（ステータスフィルタ付き）と詳細情報を確認</li>
          <li><strong>開発サーバー再起動:</strong> 環境変数を反映させるため開発サーバーを再起動してください</li>
          <li><strong>V2 APIテスト（推奨）:</strong> まずV2のAvailable/In Progress/Upcoming APIをテストしてクエストIDを取得</li>
          <li><strong>新フィールド確認:</strong> V2のレスポンスで<code>recommended_skills_display</code>フィールドが含まれているか確認</li>
          <li><strong>Study APIテスト:</strong> Study DashboardとStudy ContentsのAPIをテストして学習関連データを確認</li>
          <li><strong>V1/V2比較:</strong> 同じクエストでV1とV2のレスポンスを比較し、フィールドの違いを確認</li>
          <li><strong>クエスト詳細テスト:</strong> ステップ9で取得したクエストIDを使ってQuest Detail APIをテスト</li>
          <li><strong>応募テスト:</strong> 有効なクエストIDを使ってApply APIをテスト</li>
          <li><strong>デバッグ情報:</strong> ブラウザコンソールとネットワークタブで追加のデバッグ情報を確認</li>
        </ol>
        <div className="mt-4 p-3 bg-purple-50 rounded border border-purple-200">
          <h4 className="font-semibold text-purple-800 mb-2">JWT検証機能チェックポイント:</h4>
          <ul className="text-xs text-purple-700 list-disc list-inside space-y-1">
            <li><strong>サーバーサイド検証:</strong> トークンの署名検証、有効期限確認、ユーザー存在確認</li>
            <li><strong>クライアントサイドデコード:</strong> ペイロード内容の即座確認（署名検証なし）</li>
            <li><strong>認証状態表示:</strong> 現在のログイン状態とユーザー情報</li>
            <li><strong>開発環境限定:</strong> セキュリティのため開発環境でのみ利用可能</li>
            <li><strong>詳細エラー情報:</strong> 失敗理由の具体的な表示</li>
          </ul>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2">Study API チェックポイント:</h4>
          <ul className="text-xs text-blue-700 list-disc list-inside space-y-1">
            <li><code>/api/v1/study/dashboard</code>: 学習の進捗やダッシュボード情報</li>
            <li><code>/api/v1/study/contents</code>: 利用可能な学習コンテンツ一覧</li>
            <li>レスポンス構造と学習関連データの確認</li>
            <li>認証が必要なAPIのテスト</li>
          </ul>
        </div>

        <div className="mt-4 p-3 bg-red-50 rounded border border-red-200">
          <h4 className="font-semibold text-red-800 mb-2">Profile API チェックポイント:</h4>
          <ul className="text-xs text-red-700 list-disc list-inside space-y-1">
            <li><code>/api/v1/profile</code>: ユーザープロフィール統合情報の取得</li>
            <li>ユーザー基本情報（ID、メール、表示名、総合スコア）</li>
            <li>スキルスコア4項目（find, shape, deliver, trust）</li>
            <li>スタッフ進捗状況とステップ情報</li>
            <li>ランキング情報と総参加者数</li>
          </ul>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-2">Auth API チェックポイント:</h4>
          <ul className="text-xs text-gray-700 list-disc list-inside space-y-1">
            <li><code>/api/v1/auth/login</code>: メールアドレスでのログイン認証</li>
            <li><code>/api/v1/auth/users/{'{user_id}'}</code>: ユーザー情報の取得</li>
            <li>JWTトークンの取得と検証</li>
            <li>開発環境でのモック認証テスト</li>
          </ul>
        </div>

        <div className="mt-4 p-3 bg-purple-50 rounded border border-purple-200">
          <h4 className="font-semibold text-purple-800 mb-2">Growth API チェックポイント:</h4>
          <ul className="text-xs text-purple-700 list-disc list-inside space-y-1">
            <li><code>/api/v1/growth</code>: サンプル成長データ</li>
            <li><code>/api/v1/growth/real</code>: 実際の成長データ</li>
            <li>統計情報（成長率、週間スコア増加）の表示</li>
            <li>活動履歴とグラフデータの確認</li>
          </ul>
        </div>

        <div className="mt-4 p-3 bg-indigo-50 rounded border border-indigo-200">
          <h4 className="font-semibold text-indigo-800 mb-2">Benefits API チェックポイント:</h4>
          <ul className="text-xs text-indigo-700 list-disc list-inside space-y-1">
            <li><code>/api/v1/benefits</code>: サンプル特典データ</li>
            <li><code>/api/v1/benefits/real</code>: 実際の特典データ</li>
            <li>特典の解放状況（unlocked/locked/used）</li>
            <li>次の特典までの進捗表示</li>
          </ul>
        </div>

        <div className="mt-4 p-3 bg-pink-50 rounded border border-pink-200">
          <h4 className="font-semibold text-pink-800 mb-2">Yell API チェックポイント:</h4>
          <ul className="text-xs text-pink-700 list-disc list-inside space-y-1">
            <li><code>/api/v1/yell/projects</code>: プロジェクト一覧（ステータスフィルタ付き）</li>
            <li><code>/api/v1/yell/projects/{'{project_id}'}</code>: プロジェクト詳細</li>
            <li>資金調達の進捗状況と支援者数</li>
            <li>プロジェクトの企画・募集・実行ステータス</li>
          </ul>
        </div>

        <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
          <h4 className="font-semibold text-green-800 mb-2">V2 API新機能チェックポイント:</h4>
          <ul className="text-xs text-green-700 list-disc list-inside space-y-1">
            <li><code>recommended_skills_display</code>: 推奨スキル表示用フィールド</li>
            <li>既存フィールドとの後方互換性</li>
            <li>レスポンス構造の変更点</li>
          </ul>
        </div>
      </div>
    </div>
  );
}