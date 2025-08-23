'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api';

export default function ApiTestPage() {
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState({});
  const [questId, setQuestId] = useState('');
  const [error, setError] = useState('');

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

  const formatResponse = (response) => {
    if (!response) return null;
    
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
          <li><strong>開発サーバー再起動:</strong> 環境変数を反映させるため開発サーバーを再起動してください</li>
          <li><strong>V2 APIテスト（推奨）:</strong> まずV2のAvailable/In Progress/Upcoming APIをテストしてクエストIDを取得</li>
          <li><strong>新フィールド確認:</strong> V2のレスポンスで<code>recommended_skills_display</code>フィールドが含まれているか確認</li>
          <li><strong>V1/V2比較:</strong> 同じクエストでV1とV2のレスポンスを比較し、フィールドの違いを確認</li>
          <li><strong>クエスト詳細テスト:</strong> ステップ2で取得したクエストIDを使ってQuest Detail APIをテスト</li>
          <li><strong>応募テスト:</strong> 有効なクエストIDを使ってApply APIをテスト</li>
          <li><strong>デバッグ情報:</strong> ブラウザコンソールとネットワークタブで追加のデバッグ情報を確認</li>
        </ol>
        <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2">V2 API新機能チェックポイント:</h4>
          <ul className="text-xs text-blue-700 list-disc list-inside space-y-1">
            <li><code>recommended_skills_display</code>: 推奨スキル表示用フィールド</li>
            <li>既存フィールドとの後方互換性</li>
            <li>レスポンス構造の変更点</li>
          </ul>
        </div>
      </div>
    </div>
  );
}