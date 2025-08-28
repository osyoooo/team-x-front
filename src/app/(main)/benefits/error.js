'use client';

import { useEffect } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function Error({ error, reset }) {
  useEffect(() => {
    // エラーログをコンソールに出力
    console.error('Benefits page error:', error);
  }, [error]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* ヘッダー */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ベネフィット</h1>
        <p className="text-gray-600">
          学習で獲得したポイントを素敵な特典と交換しよう
        </p>
      </div>

      {/* エラーメッセージ */}
      <Card className="mb-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            データの読み込みに失敗しました
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            特典データの取得中にエラーが発生しました。
            インターネット接続を確認するか、しばらく時間をおいてから再度お試しください。
          </p>
          
          {/* 開発環境でのエラー詳細表示 */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mb-6 text-left bg-red-50 border border-red-200 rounded-lg p-4">
              <summary className="cursor-pointer font-semibold text-red-800 mb-2">
                エラー詳細 (開発用)
              </summary>
              <pre className="text-sm text-red-700 whitespace-pre-wrap overflow-auto">
                {error?.message || 'Unknown error'}
              </pre>
              {error?.stack && (
                <pre className="text-xs text-red-600 mt-2 whitespace-pre-wrap overflow-auto">
                  {error.stack}
                </pre>
              )}
            </details>
          )}

          <div className="space-y-4">
            <Button
              onClick={reset}
              className="mx-2"
              variant="primary"
            >
              🔄 再試行
            </Button>
            <Button
              onClick={() => window.location.reload()}
              className="mx-2"
              variant="outline"
            >
              ページを再読み込み
            </Button>
          </div>
        </div>
      </Card>

      {/* 代替コンテンツ: ポイント獲得方法 */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 ポイントの獲得方法</h3>
        <p className="text-gray-600 mb-4">
          エラーが解決するまでの間、ポイント獲得に関する情報をご確認ください。
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center p-3 bg-green-50 rounded-lg">
            <span className="text-2xl mr-3">🎯</span>
            <div>
              <div className="font-medium text-gray-900">クエスト完了</div>
              <div className="text-sm text-gray-600">10-100pt</div>
            </div>
          </div>
          <div className="flex items-center p-3 bg-blue-50 rounded-lg">
            <span className="text-2xl mr-3">📚</span>
            <div>
              <div className="font-medium text-gray-900">学習コンテンツ完了</div>
              <div className="text-sm text-gray-600">20-50pt</div>
            </div>
          </div>
          <div className="flex items-center p-3 bg-purple-50 rounded-lg">
            <span className="text-2xl mr-3">🔥</span>
            <div>
              <div className="font-medium text-gray-900">連続学習</div>
              <div className="text-sm text-gray-600">5-25pt/日</div>
            </div>
          </div>
          <div className="flex items-center p-3 bg-orange-50 rounded-lg">
            <span className="text-2xl mr-3">🏆</span>
            <div>
              <div className="font-medium text-gray-900">アチーブメント達成</div>
              <div className="text-sm text-gray-600">50-200pt</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}