'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { useUIStore } from '@/store/uiStore';

export default function BenefitsClient({ benefits, realBenefits }) {
  const router = useRouter();
  const { isAuthenticated } = useUserStore();
  const { addNotification } = useUIStore();
  
  const [userPoints, setUserPoints] = useState(850);
  const [nextPoints] = useState(900);
  const [rewardValue] = useState(903500);
  const [filter, setFilter] = useState('all'); // 'all', 'acquired', 'not_acquired'

  // APIデータが利用可能かチェック
  const hasApiData = benefits && realBenefits;

  // 認証チェック
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // デモデータ（Figmaデザインに基づく）
  const demoData = [
    {
      id: '1',
      name: 'はじめてのクエスト参加権',
      description: '初級クエストに参加、抽選で500円特典',
      points: 150,
      status: 'used', // 'used', 'acquired', 'available', 'applying', 'locked'
      color: '#9D9C9C'
    },
    {
      id: '2',
      name: '実践型クエスト参加権',
      description: '達成で1,000〜3,000円の報酬を獲得',
      points: 250,
      status: 'used',
      color: '#9D9C9C'
    },
    {
      id: '3',
      name: 'キャリア相談チケット',
      description: 'プロとの個別面談とギフト1,500円付',
      points: 300,
      status: 'used',
      color: '#9D9C9C'
    },
    {
      id: '4',
      name: '奨学金金利優遇チケット',
      description: '融資金利を2.5%→1.0%に優遇',
      points: 400,
      status: 'acquired',
      color: '#6ADE08'
    },
    {
      id: '5',
      name: '上級クエスト参加権',
      description: '高難度クエストで最大1万円の報酬',
      points: 500,
      status: 'acquired',
      color: '#6ADE08'
    },
    {
      id: '6',
      name: 'インターン応募パス',
      description: '限定企業のインターンに応募可能',
      points: 600,
      status: 'applying',
      color: '#5DDDE1'
    },
    {
      id: '7',
      name: '就活アドバイザー相談権',
      description: '模擬面接やES添削など就活サポート',
      points: 700,
      status: 'acquired',
      color: '#6ADE08'
    },
    {
      id: '8',
      name: '応援プロジェクト起案権',
      description: '最大50万円の寄付を受け取れる',
      points: 750,
      status: 'used',
      color: '#9D9C9C'
    },
    {
      id: '9',
      name: '起業応援プログラム',
      description: '支援金最大300万円＋起業支援を提供',
      points: 900,
      status: 'available',
      color: '#F0FE53',
      specialNote: 'あと50点'
    },
    {
      id: '10',
      name: 'coming soon...',
      description: '公開までしばらくお待ちください',
      points: 1000,
      status: 'locked',
      color: '#CCCCCC'
    }
  ];

  // フィルターされた特典リスト
  const filteredBenefits = demoData.filter(benefit => {
    if (filter === 'acquired') return benefit.status === 'acquired';
    if (filter === 'not_acquired') return benefit.status !== 'acquired' && benefit.status !== 'used';
    return true; // 'all'
  });

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-gray-200 min-h-screen">
      {/* 背景の円形エフェクト */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-40 h-40 rounded-full bg-green-400 opacity-30 blur-xl" style={{ top: '100px', right: '80px' }}></div>
        <div className="absolute w-40 h-40 rounded-full bg-yellow-300 opacity-30 blur-xl" style={{ top: '200px', left: '-25px' }}></div>
        <div className="absolute w-40 h-40 rounded-full bg-cyan-300 opacity-30 blur-xl" style={{ top: '30px', left: '30%' }}></div>
        <div className="absolute w-40 h-40 rounded-full bg-green-400 opacity-30 blur-xl" style={{ bottom: '200px', right: '80px' }}></div>
        <div className="absolute w-40 h-40 rounded-full bg-yellow-300 opacity-30 blur-xl" style={{ bottom: '100px', left: '-25px' }}></div>
        <div className="absolute w-40 h-40 rounded-full bg-cyan-300 opacity-30 blur-xl" style={{ bottom: '400px', left: '30%' }}></div>
      </div>

      <div className="relative z-10 px-4 pt-8">
        {/* ポイントサークル */}
        <div className="bg-white rounded-2xl p-6 mb-4 mx-4">
          <div className="flex justify-between items-start mb-4">
            <div className="text-xs text-gray-500">
              次の特典<br />まで<br />
              <span className="text-sm font-bold text-black">50</span>
              <span className="text-xs">点</span>
            </div>
            <div className="text-xs text-gray-500">
              8/9解放済み
            </div>
          </div>
          
          {/* メインポイントサークル */}
          <div className="flex justify-center mb-6">
            <div className="relative w-48 h-48">
              {/* 背景サークル */}
              <svg className="w-full h-full" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="85"
                  stroke="#e5e5e5"
                  strokeWidth="12"
                  fill="none"
                />
                {/* プログレスサークル */}
                <circle
                  cx="100"
                  cy="100"
                  r="85"
                  stroke="url(#pointGradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${(userPoints / nextPoints) * 534} 534`}
                  transform="rotate(-90 100 100)"
                />
                <defs>
                  <linearGradient id="pointGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6ADE08" />
                    <stop offset="100%" stopColor="#5DDDE1" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-black mb-1">{userPoints}</div>
                  <div className="text-xs text-gray-500">点</div>
                </div>
              </div>
            </div>
          </div>

          {/* ポイント詳細 */}
          <div className="flex justify-between">
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Next 特典スコア</div>
              <div className="text-2xl font-bold text-black">{nextPoints}</div>
              <div className="text-xs text-gray-500">点</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">解放済み特典価値</div>
              <div className="text-2xl font-bold text-black">{rewardValue.toLocaleString()}</div>
              <div className="text-xs text-gray-500">円</div>
            </div>
          </div>
        </div>

        {/* 特典解放マップタイトル */}
        <div className="px-4 mb-2">
          <h2 className="text-sm font-bold text-black">特典解放マップ</h2>
        </div>

        {/* フィルタータブ */}
        <div className="bg-white bg-opacity-80 rounded-full p-4 mx-4 mb-4">
          <div className="flex justify-center space-x-20">
            <button
              onClick={() => setFilter('all')}
              className={`text-xs font-bold ${
                filter === 'all' ? 'text-black' : 'text-gray-500'
              }`}
            >
              すべて
            </button>
            <button
              onClick={() => setFilter('acquired')}
              className={`text-xs ${
                filter === 'acquired' ? 'text-black font-bold' : 'text-gray-500'
              }`}
            >
              獲得済み
            </button>
            <button
              onClick={() => setFilter('not_acquired')}
              className={`text-xs ${
                filter === 'not_acquired' ? 'text-black font-bold' : 'text-gray-500'
              }`}
            >
              未獲得
            </button>
          </div>
        </div>

        {/* 特典リスト */}
        <div className="space-y-1 px-1">
          {filteredBenefits.map((benefit) => {
            const getStatusButton = () => {
              switch (benefit.status) {
                case 'used':
                  return (
                    <div className="bg-gray-400 text-white px-3 py-1 rounded-full text-xs font-bold">
                      利用済み
                    </div>
                  );
                case 'acquired':
                  return (
                    <div className="bg-green-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                      獲得済み
                    </div>
                  );
                case 'applying':
                  return (
                    <div className="bg-cyan-400 text-black px-2 py-1 rounded-full text-xs font-bold">
                      申込中
                    </div>
                  );
                case 'available':
                  return (
                    <div className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold">
                      {benefit.specialNote || '獲得可能'}
                    </div>
                  );
                case 'locked':
                  return (
                    <div className="bg-gray-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  );
                default:
                  return null;
              }
            };

            return (
              <div key={benefit.id} className="bg-white rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center flex-1">
                  {/* ポイント数 */}
                  <div className="flex flex-col items-center mr-4 min-w-16">
                    <div 
                      className="text-xl font-bold text-center"
                      style={{ color: benefit.color }}
                    >
                      {benefit.points}
                    </div>
                    {/* 小さな下向き三角形 */}
                    <div className="w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-300 mt-1"></div>
                  </div>

                  {/* 特典内容 */}
                  <div className="flex-1">
                    <h3 className="text-xs font-bold text-black mb-1">
                      {benefit.name}
                    </h3>
                    <p className="text-xs text-black opacity-80">
                      {benefit.description}
                    </p>
                  </div>

                  {/* 状態ボタン */}
                  <div className="mr-3">
                    {getStatusButton()}
                  </div>

                  {/* 矢印アイコン */}
                  <div className="text-gray-400">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}