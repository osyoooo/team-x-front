'use client';

import { useEffect } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function Error({ error, reset }) {
  useEffect(() => {
    // エラーログをコンソールに出力
    console.error('Growth page error:', error);
  }, [error]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* ヘッダー */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">成長記録</h1>
        <p className="text-gray-600">
          あなたの学習の軌跡と達成した成果を振り返りましょう
        </p>
      </div>

      {/* エラーメッセージ */}
      <Card className="mb-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            成長データの読み込みに失敗しました
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            成長記録データの取得中にエラーが発生しました。
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

      {/* 代替コンテンツ: 成長のヒント */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 成長のヒント</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p>• 毎日少しずつでも継続することが大切です</p>
            <p>• 完了したクエストや学習を振り返ることで成長を実感できます</p>
            <p>• 目標を設定して達成していくことでモチベーションが保てます</p>
            <p>• 他の学習者と交流することで刺激を受けられます</p>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 成長を記録する理由</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p>• 自分の努力を可視化することができます</p>
            <p>• 学習の継続性を確認できます</p>
            <p>• 達成感を味わうことができます</p>
            <p>• 将来の学習計画の参考になります</p>
          </div>
        </Card>
      </div>
    </div>
  );
}