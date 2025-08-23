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
        {/* 1. Available Quests */}
        <div className="border border-gray-200 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">1. Get Available Quests</h3>
          <p className="text-sm text-gray-600 mb-4">GET /api/v1/quests/available</p>
          
          <button
            onClick={() => testAPI('/api/v1/quests/available', 'GET', null, 'available')}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test API'}
          </button>
          
          {formatResponse(responses.available)}
        </div>

        {/* 2. In Progress Quests */}
        <div className="border border-gray-200 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">2. Get In Progress Quests</h3>
          <p className="text-sm text-gray-600 mb-4">GET /api/v1/quests/in-progress</p>
          
          <button
            onClick={() => testAPI('/api/v1/quests/in-progress', 'GET', null, 'inProgress')}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test API'}
          </button>
          
          {formatResponse(responses.inProgress)}
        </div>

        {/* 3. Upcoming Quests */}
        <div className="border border-gray-200 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">3. Get Upcoming Quests</h3>
          <p className="text-sm text-gray-600 mb-4">GET /api/v1/quests/upcoming</p>
          
          <button
            onClick={() => testAPI('/api/v1/quests/upcoming', 'GET', null, 'upcoming')}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test API'}
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
          <li>Make sure the development server is restarted to pick up the new environment variable</li>
          <li>Test the Available/In Progress/Upcoming APIs first to get quest IDs</li>
          <li>Use the quest IDs from step 2 to test the Quest Detail API</li>
          <li>Use a valid quest ID to test the Apply API</li>
          <li>Check the browser console and network tab for additional debugging info</li>
        </ol>
      </div>
    </div>
  );
}