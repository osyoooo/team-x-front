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

  const testAPI = async (endpoint, method = 'GET', data = null, key) => {
    setLoading(true);
    setError('');
    
    try {
      let result;
      
      if (method === 'GET') {
        result = await apiClient.get(endpoint);
      } else if (method === 'POST') {
        result = await apiClient.post(endpoint, data);
      }
      
      setResponses(prev => ({
        ...prev,
        [key]: {
          success: true,
          data: result,
          timestamp: new Date().toLocaleTimeString()
        }
      }));
    } catch (err) {
      setError(err.message);
      setResponses(prev => ({
        ...prev,
        [key]: {
          success: false,
          error: err.message,
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
          <li><strong>開発サーバー再起動:</strong> 環境変数を反映させるため開発サーバーを再起動してください</li>
          <li><strong>V2 APIテスト（推奨）:</strong> まずV2のAvailable/In Progress/Upcoming APIをテストしてクエストIDを取得</li>
          <li><strong>新フィールド確認:</strong> V2のレスポンスで<code>recommended_skills_display</code>フィールドが含まれているか確認</li>
          <li><strong>Study APIテスト:</strong> Study DashboardとStudy ContentsのAPIをテストして学習関連データを確認</li>
          <li><strong>V1/V2比較:</strong> 同じクエストでV1とV2のレスポンスを比較し、フィールドの違いを確認</li>
          <li><strong>クエスト詳細テスト:</strong> ステップ5で取得したクエストIDを使ってQuest Detail APIをテスト</li>
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