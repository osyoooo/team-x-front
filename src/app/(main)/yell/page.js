'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { useUIStore } from '@/store/uiStore';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';

export default function YellPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useUserStore();
  const { addNotification } = useUIStore();
  
  const [yells, setYells] = useState([]);
  const [newYell, setNewYell] = useState('');

  // 認証チェック
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // モックのエールデータ
  useEffect(() => {
    if (isAuthenticated) {
      setYells([
        {
          id: '1',
          from: { name: '田中さん', avatar: '👨‍💻' },
          to: { name: 'みらいちゃん', avatar: '👩‍🎓' },
          message: 'JavaScript学習お疲れ様です！一緒に頑張りましょう！',
          timestamp: '2024-08-17T09:30:00Z',
          reactions: ['👏', '🎉', '💪']
        },
        {
          id: '2',
          from: { name: '佐藤さん', avatar: '👩‍💼' },
          to: { name: 'みらいちゃん', avatar: '👩‍🎓' },
          message: 'React入門クエスト参加おめでとう！私も同じクエストやってます。質問があったらいつでも声かけてくださいね😊',
          timestamp: '2024-08-16T14:20:00Z',
          reactions: ['😊', '🤝', '📚']
        },
        {
          id: '3',
          from: { name: '山田さん', avatar: '👨‍🔬' },
          to: { name: 'コミュニティ', avatar: '🌟' },
          message: '今日も学習お疲れ様でした！継続は力なり、みんなで頑張りましょう！',
          timestamp: '2024-08-15T18:00:00Z',
          reactions: ['🔥', '💪', '🎯']
        }
      ]);
    }
  }, [isAuthenticated]);

  const handleSendYell = () => {
    if (!newYell.trim()) return;

    const yell = {
      id: Date.now().toString(),
      from: { name: user?.nickname || 'あなた', avatar: '👤' },
      to: { name: 'コミュニティ', avatar: '🌟' },
      message: newYell,
      timestamp: new Date().toISOString(),
      reactions: []
    };

    setYells(prev => [yell, ...prev]);
    setNewYell('');
    addNotification({
      type: 'success',
      message: 'エールを送信しました！'
    });
  };

  const handleReaction = (yellId, reaction) => {
    setYells(prev => prev.map(yell => {
      if (yell.id === yellId) {
        const reactions = yell.reactions.includes(reaction)
          ? yell.reactions.filter(r => r !== reaction)
          : [...yell.reactions, reaction];
        return { ...yell, reactions };
      }
      return yell;
    }));
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffHours < 24) return `${diffHours}時間前`;
    if (diffDays < 7) return `${diffDays}日前`;
    return date.toLocaleDateString('ja-JP');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* ヘッダー */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">エール</h1>
        <p className="text-gray-600">
          仲間と励まし合い、学習のモチベーションを高めよう
        </p>
      </div>

      {/* エール投稿フォーム */}
      <Card className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📣 エールを送る</h3>
        <div className="space-y-4">
          <textarea
            value={newYell}
            onChange={(e) => setNewYell(e.target.value)}
            placeholder="仲間を励ますメッセージを書いてみましょう..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
            maxLength={200}
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {newYell.length}/200文字
            </span>
            <Button
              onClick={handleSendYell}
              disabled={!newYell.trim()}
            >
              エールを送る
            </Button>
          </div>
        </div>
      </Card>

      {/* おすすめのエール例 */}
      <Card className="mb-8 bg-blue-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 エールの例</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-white rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700">「今日も学習お疲れ様です！一緒に頑張りましょう！」</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700">「同じクエストを進めている仲間です。お互い頑張りましょう😊」</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700">「継続は力なり！今日も一歩前進ですね🎯」</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700">「新しいスキル習得おめでとうございます！🎉」</p>
          </div>
        </div>
      </Card>

      {/* エール一覧 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">🌟 みんなのエール</h3>
        
        {yells.length > 0 ? (
          yells.map((yell) => (
            <Card key={yell.id}>
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{yell.from.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-900">{yell.from.name}</span>
                    <span className="text-gray-500">→</span>
                    <span className="font-medium text-blue-600">{yell.to.name}</span>
                    <span className="text-sm text-gray-500">{formatTimestamp(yell.timestamp)}</span>
                  </div>
                  <p className="text-gray-700 mb-3">{yell.message}</p>
                  
                  {/* リアクション */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">リアクション:</span>
                    {['👏', '🎉', '💪', '😊', '🔥'].map((reaction) => (
                      <button
                        key={reaction}
                        onClick={() => handleReaction(yell.id, reaction)}
                        className={`text-lg hover:scale-110 transition-transform ${
                          yell.reactions.includes(reaction) ? 'bg-yellow-100 rounded' : ''
                        }`}
                      >
                        {reaction}
                      </button>
                    ))}
                  </div>
                  
                  {/* 既存のリアクション表示 */}
                  {yell.reactions.length > 0 && (
                    <div className="mt-2 flex space-x-1">
                      {yell.reactions.map((reaction, index) => (
                        <span key={index} className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {reaction}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            まだエールがありません。最初のエールを送ってみましょう！
          </div>
        )}
      </div>

      {/* エールの効果 */}
      <Card className="mt-8 bg-green-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">✨ エールの効果</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4">
            <div className="text-3xl mb-2">🤝</div>
            <div className="font-medium text-gray-900">コミュニティ形成</div>
            <div className="text-sm text-gray-600">仲間とのつながりを深める</div>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl mb-2">💪</div>
            <div className="font-medium text-gray-900">モチベーション向上</div>
            <div className="text-sm text-gray-600">学習への意欲を高める</div>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl mb-2">🎯</div>
            <div className="font-medium text-gray-900">継続力アップ</div>
            <div className="text-sm text-gray-600">学習習慣の定着をサポート</div>
          </div>
        </div>
      </Card>
    </div>
  );
}