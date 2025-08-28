'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { transformGrowthDataForChart } from '@/lib/growthDataTransformer';

export default function GrowthClient({ growth, realGrowth }) {
  const router = useRouter();
  const { isAuthenticated } = useUserStore();
  
  const [activeTab, setActiveTab] = useState('learning'); // 'learning', 'quest', 'project'
  const [periodFilter, setPeriodFilter] = useState('ALL'); // 'ALL', 'YEAR', 'MONTH', 'WEEK'

  // 認証チェック
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // APIデータを変換してグラフ表示用データを生成
  const transformedData = useMemo(() => {
    return transformGrowthDataForChart(growth, realGrowth);
  }, [growth, realGrowth]);

  // レガシー互換性のためのデータ構造（削除予定）
  const demoData = {
    totalGrowthRate: 8.2,
    weeklyScore: 40,
    currentScore: 580,
    activities: {
      completedLearning: 86,
      completedQuest: 15,
      projects: 3,
      totalLearningTime: 156
    },
    activityHistory: {
      learning: [
        {
          id: 1,
          score: 40,
          title: 'React実装開発',
          skills: 'スキル：Webアプリ開発、画面部品管理、高速レスポンス',
          date: '完了日：2030年8月9日'
        },
        {
          id: 2,
          score: 30,
          title: 'AWS中級',
          skills: 'スキル：クラウド公開、自動拡張、コスト管理',
          date: '完了日：2030年7月29日'
        },
        {
          id: 3,
          score: 35,
          title: 'python×データ分析',
          skills: 'スキル：データ解析、グラフ作成、ビジネス分析',
          date: '完了日：2030年7月15日'
        }
      ],
      quest: [
        {
          id: 1,
          score: 45,
          title: 'Vue.js実践開発',
          skills: 'スキル：フロントエンド、コンポーネント設計',
          date: '完了日：2030年8月5日'
        }
      ],
      project: [
        {
          id: 1,
          score: 50,
          title: 'ECサイト構築プロジェクト',
          skills: 'スキル：フルスタック開発、DB設計',
          date: '完了日：2030年7月20日'
        }
      ]
    },
    chartData: [
      { x: 0, y: 50, color: '#9747FF' },   // 紫
      { x: 0.2, y: 80, color: '#9747FF' },
      { x: 0.4, y: 120, color: '#9747FF' },
      { x: 0.6, y: 180, color: '#9747FF' },
      { x: 0.8, y: 280, color: '#9747FF' },
      { x: 1, y: 580, color: '#9747FF' },
      
      { x: 0, y: 30, color: '#F1FE56' },   // 黄緑
      { x: 0.2, y: 60, color: '#F1FE56' },
      { x: 0.4, y: 100, color: '#F1FE56' },
      { x: 0.6, y: 160, color: '#F1FE56' },
      { x: 0.8, y: 240, color: '#F1FE56' },
      { x: 1, y: 450, color: '#F1FE56' },
      
      { x: 0, y: 20, color: '#AEEE31' },   // 緑
      { x: 0.2, y: 40, color: '#AEEE31' },
      { x: 0.4, y: 70, color: '#AEEE31' },
      { x: 0.6, y: 120, color: '#AEEE31' },
      { x: 0.8, y: 200, color: '#AEEE31' },
      { x: 1, y: 300, color: '#AEEE31' },
      
      { x: 0, y: 10, color: '#74FBFC' },   // 水色
      { x: 0.2, y: 30, color: '#74FBFC' },
      { x: 0.4, y: 50, color: '#74FBFC' },
      { x: 0.6, y: 80, color: '#74FBFC' },
      { x: 0.8, y: 120, color: '#74FBFC' },
      { x: 1, y: 200, color: '#74FBFC' }
    ]
  };

  if (!isAuthenticated) {
    return null;
  }

  const getCurrentActivityData = () => {
    return transformedData.activityHistory[activeTab] || [];
  };

  // タブのマッピング
  const tabMapping = {
    'learning': '学習',
    'quest': 'クエスト',
    'project': 'プロジェクト'
  };

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

      <div className="relative z-10">
        {/* 成長グラフエリア */}
        <div className="bg-black bg-opacity-25 text-white relative px-4 py-8">
          {/* グラフ背景 */}
          <div className="relative h-96 mb-8">
            {/* Y軸ラベル */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-white">
              <span>900</span>
              <span>800</span>
              <span>700</span>
              <span>600</span>
              <span>500</span>
              <span>400</span>
              <span>300</span>
              <span>200</span>
              <span>100</span>
            </div>

            {/* グリッドライン */}
            <div className="absolute left-8 top-0 right-0 h-full">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-full border-t border-dashed border-gray-400 opacity-50"
                  style={{ top: `${(i / 8) * 100}%` }}
                />
              ))}
            </div>

            {/* グラフライン - SVG（動的データ対応） */}
            <div className="absolute left-8 top-0 right-0 h-full">
              <svg className="w-full h-full" viewBox="0 0 400 400">
                {(() => {
                  // チャートデータを色ごとにグループ化
                  const groupedData = {};
                  transformedData.chartData.forEach(point => {
                    if (!groupedData[point.color]) {
                      groupedData[point.color] = [];
                    }
                    groupedData[point.color].push(point);
                  });

                  // 各色のラインを描画
                  return Object.entries(groupedData).map(([color, points], groupIndex) => {
                    if (points.length === 0) return null;
                    
                    // ポイントをX座標でソート
                    const sortedPoints = points.sort((a, b) => a.x - b.x);
                    
                    // SVGポリラインのポイント文字列を生成
                    const svgPoints = sortedPoints.map(point => {
                      const x = point.x * 400; // 0-1の範囲を0-400に変換
                      const y = 400 - ((point.y / 900) * 400); // Y軸を反転して0-900を400-0に変換
                      return `${x},${y}`;
                    }).join(' ');

                    // フィルタースタイルを動的生成
                    const filterStyle = {
                      filter: `drop-shadow(0px 1px 4px ${color})`
                    };

                    return (
                      <polyline
                        key={`line-${groupIndex}`}
                        points={svgPoints}
                        fill="none"
                        stroke={color}
                        strokeWidth="2"
                        style={filterStyle}
                      />
                    );
                  });
                })()}
                
                {/* 現在値のドット（動的配置） */}
                {(() => {
                  // 最新のデータポイントを取得してドットを配置
                  const latestPoint = transformedData.chartData.find(p => p.color === '#9747FF');
                  if (latestPoint) {
                    const x = latestPoint.x * 400;
                    const y = 400 - ((latestPoint.y / 900) * 400);
                    return <circle cx={x} cy={y} r="3" fill="white" />;
                  }
                  return <circle cx="300" cy="100" r="3" fill="white" />;
                })()}
              </svg>
            </div>

            {/* X軸ラベル */}
            <div className="absolute bottom-0 left-8 right-0 flex justify-between text-xs text-white">
              <span>25/08</span>
              <span>30/08</span>
            </div>
          </div>

          {/* 統計情報 */}
          <div className="flex justify-between items-end px-4">
            <div>
              <div className="text-xs mb-1">トータル成長率</div>
              <div className="text-2xl font-bold">
                {transformedData.totalGrowthRate}
                <span className="text-xs ml-1">倍</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs mb-1">今週の増加スコア</div>
              <div className="text-2xl font-bold">
                {transformedData.weeklyScore}
                <span className="text-xs ml-1">点</span>
              </div>
            </div>
          </div>

          {/* 現在スコア表示 */}
          <div className="absolute top-4 right-4">
            <div className="text-right">
              <div className="text-xs opacity-75">
                {(() => {
                  const now = new Date();
                  const month = String(now.getMonth() + 1).padStart(2, '0');
                  const day = String(now.getDate()).padStart(2, '0');
                  return `${day}/${month}`;
                })()}
              </div>
              <div className="text-lg font-bold">{transformedData.currentScore}</div>
            </div>
          </div>

          {/* 期間フィルタードロップダウン */}
          <div className="absolute top-4 right-16">
            <div className="relative">
              <select 
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value)}
                className="text-xs text-white bg-transparent border-none appearance-none pr-6 cursor-pointer focus:outline-none"
              >
                <option value="ALL" className="text-black">ALL</option>
                <option value="YEAR" className="text-black">YEAR</option>
                <option value="MONTH" className="text-black">MONTH</option>
                <option value="WEEK" className="text-black">WEEK</option>
              </select>
              <svg className="w-3 h-3 absolute right-0 top-1/2 transform -translate-y-1/2 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* 活動サマリー */}
        <div className="px-4 py-4">
          <h2 className="text-sm font-bold text-black mb-4">活動サマリー</h2>
          
          <div className="bg-white rounded-lg p-4 flex justify-between items-center">
            <div className="text-center">
              <div className="text-xs text-gray-600 mb-1">完了学習</div>
              <div className="text-2xl font-bold text-black">{transformedData.activities.completedLearning}</div>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-xs text-gray-600 mb-1">完了クエスト</div>
              <div className="text-2xl font-bold text-black">{transformedData.activities.completedQuest}</div>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-xs text-gray-600 mb-1">プロジェクト</div>
              <div className="text-2xl font-bold text-black">{transformedData.activities.projects}</div>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-xs text-gray-600 mb-1">累計学習時間</div>
              <div className="text-2xl font-bold text-black">{transformedData.activities.totalLearningTime}</div>
            </div>
          </div>
        </div>

        {/* 活動履歴 */}
        <div className="px-4 py-4">
          <h2 className="text-sm font-bold text-black mb-4">活動履歴</h2>
          
          {/* Figmaデザインに基づくタブ */}
          <nav className="w-full bg-[#9D9C9C]/80 rounded-lg mb-4">
            <div className="flex justify-center items-center gap-[48px] px-[27px] py-[11px]">
              {['learning', 'quest', 'project'].map((tabKey) => (
                <button
                  key={tabKey}
                  onClick={() => setActiveTab(tabKey)}
                  className={`
                    w-[81px] h-[21px] 
                    text-xs leading-[1.2] text-center
                    transition-colors duration-200
                    ${activeTab === tabKey 
                      ? 'font-bold text-black' 
                      : 'font-normal text-[#575757]'
                    }
                  `}
                >
                  {tabMapping[tabKey]}
                </button>
              ))}
            </div>
          </nav>

          {/* アンダーライン */}
          <div className="w-32 h-0.5 bg-black mb-6"></div>

          {/* 活動リスト */}
          <div className="space-y-4">
            {getCurrentActivityData().map((activity) => (
              <div key={activity.id} className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-2xl font-bold text-black mr-4 min-w-12">
                      {activity.score}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-black text-sm mb-1">
                        {activity.title}
                      </h3>
                      <p className="text-xs text-gray-600 mb-1">
                        {activity.skills}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.date}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 履歴一覧リンク */}
          <div className="flex justify-end items-center mt-6">
            <button className="text-xs font-bold text-gray-600 flex items-center">
              履歴一覧
              <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}