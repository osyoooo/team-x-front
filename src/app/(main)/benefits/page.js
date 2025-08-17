'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { useUIStore } from '@/store/uiStore';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function BenefitsPage() {
  const router = useRouter();
  const { isAuthenticated } = useUserStore();
  const { addNotification } = useUIStore();
  
  const [userPoints, setUserPoints] = useState(250);

  // 認証チェック
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const benefits = [
    {
      id: '1',
      name: 'プレミアムコース1ヶ月利用券',
      description: '通常有料のプレミアムコースを1ヶ月間無料で利用できます',
      points: 500,
      category: '学習',
      icon: '🎓',
      available: true
    },
    {
      id: '2', 
      name: 'オンライン相談会参加券',
      description: 'エキスパートとの1対1オンライン相談会に参加できます',
      points: 300,
      category: 'サポート',
      icon: '💬',
      available: true
    },
    {
      id: '3',
      name: 'Team X オリジナルステッカー',
      description: 'Team Xのロゴが入ったオリジナルステッカーセット',
      points: 100,
      category: 'グッズ',
      icon: '🎨',
      available: true
    },
    {
      id: '4',
      name: 'プロフィールバッジ「ゴールドメンバー」',
      description: 'プロフィールに表示される特別なゴールドメンバーバッジ',
      points: 150,
      category: 'バッジ',
      icon: '🏆',
      available: true
    },
    {
      id: '5',
      name: '年間パスポート',
      description: '全てのコンテンツとイベントにアクセスできる年間パスポート',
      points: 2000,
      category: '学習',
      icon: '🎫',
      available: false
    }
  ];

  const handleExchange = (benefit) => {
    if (userPoints >= benefit.points) {
      setUserPoints(prev => prev - benefit.points);
      addNotification({
        type: 'success',
        message: `「${benefit.name}」と交換しました！`
      });
    } else {
      addNotification({
        type: 'error',
        message: 'ポイントが不足しています'
      });
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* ヘッダー */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ベネフィット</h1>
        <p className="text-gray-600">
          学習で獲得したポイントを素敵な特典と交換しよう
        </p>
      </div>

      {/* ポイント残高 */}
      <Card className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">現在のポイント</h2>
          <div className="text-5xl font-bold mb-2">{userPoints}</div>
          <p className="text-blue-100">学習を続けてポイントを貯めよう！</p>
        </div>
      </Card>

      {/* 特典一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((benefit) => (
          <Card key={benefit.id} className={`h-full flex flex-col ${!benefit.available ? 'opacity-50' : ''}`}>
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">{benefit.icon}</div>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                {benefit.category}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {benefit.name}
            </h3>

            <p className="text-gray-600 text-sm mb-4 flex-grow">
              {benefit.description}
            </p>

            <div className="mt-auto">
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold text-blue-600">
                  {benefit.points} pt
                </span>
                {benefit.available ? (
                  <span className="text-green-600 text-sm">交換可能</span>
                ) : (
                  <span className="text-gray-500 text-sm">準備中</span>
                )}
              </div>

              <Button
                className="w-full"
                disabled={!benefit.available || userPoints < benefit.points}
                onClick={() => handleExchange(benefit)}
                variant={userPoints < benefit.points ? 'outline' : 'primary'}
              >
                {!benefit.available 
                  ? '準備中' 
                  : userPoints < benefit.points 
                  ? 'ポイント不足' 
                  : '交換する'
                }
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* ポイント獲得方法 */}
      <Card className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 ポイントの獲得方法</h3>
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