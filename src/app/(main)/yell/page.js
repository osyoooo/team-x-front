'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { fetchProjects, normalizeProjectsData } from '@/lib/yellAPI';
import Link from 'next/link';

export default function YellProjectsPage() {
  const router = useRouter();
  const { isAuthenticated } = useUserStore();
  const [activeTab, setActiveTab] = useState('募集中');
  const [projectsData, setProjectsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 認証チェック
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // プロジェクト一覧を取得
  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      setError(null);
      
      const result = await fetchProjects(activeTab);
      
      if (result.success) {
        const normalizedData = normalizeProjectsData(result.data);
        setProjectsData(normalizedData);
      } else {
        setError(result.error);
      }
      
      setLoading(false);
    };

    if (isAuthenticated) {
      loadProjects();
    }
  }, [activeTab, isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  const tabs = projectsData?.tabs || ['企画中', '募集中', '実行中'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-green-50">
      {/* カラフルなグラデーション背景ボール */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* エメラルド系 */}
        <div className="absolute w-48 h-48 bg-emerald-300 rounded-full blur-2xl opacity-50" 
             style={{ top: '8%', right: '18%' }}></div>
        
        {/* ライム系 */}
        <div className="absolute w-44 h-44 bg-lime-300 rounded-full blur-2xl opacity-50" 
             style={{ top: '35%', left: '5%' }}></div>
        
        {/* スカイブルー系 */}
        <div className="absolute w-52 h-52 bg-sky-300 rounded-full blur-2xl opacity-50" 
             style={{ bottom: '25%', right: '12%' }}></div>
        
        {/* ピンク系 */}
        <div className="absolute w-40 h-40 bg-pink-300 rounded-full blur-2xl opacity-40" 
             style={{ top: '60%', left: '40%' }}></div>
        
        {/* 紫系 */}
        <div className="absolute w-36 h-36 bg-purple-300 rounded-full blur-2xl opacity-40" 
             style={{ bottom: '10%', left: '25%' }}></div>
      </div>

      <div className="relative z-10 max-w-md mx-auto min-h-screen">
        {/* タブナビゲーション */}
        <div className="pt-6 px-6 pb-4">
          <div className="bg-[#CCCCCC] rounded-full px-1 py-1.5 flex relative shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25)] gap-1.5 w-[340px] mx-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-[160px] h-[25px] flex items-center justify-center rounded-full text-[11px] font-bold transition-all duration-300 relative z-10 ${
                  activeTab === tab
                    ? 'bg-black text-white shadow-lg'
                    : 'text-[#9D9C9C] bg-[#E5E5E5]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* コンテンツ */}
        <div className="px-4 pb-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-500"></div>
              </div>
            ) : error ? (
              <div className="text-center py-10">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                >
                  再読み込み
                </button>
              </div>
            ) : projectsData?.projects?.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500">
                  {activeTab}のプロジェクトはありません
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {projectsData?.projects?.map((project) => (
                  <Link
                    key={project.id}
                    href={`/yell/${project.id}`}
                    className="block"
                  >
                    <div className="bg-white/95 border border-gray-200/50 rounded-xl p-4 hover:shadow-md transition-shadow">
                    {/* プロジェクトヘッダー */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-sm text-gray-900 mb-1">
                          {project.title}
                        </h3>
                        <p className="text-xs text-gray-600 mb-2">
                          カテゴリー: {project.category}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        project.status === '募集中' 
                          ? 'bg-green-100 text-green-800'
                          : project.status === '実行中'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {project.status}
                      </span>
                    </div>

                    {/* オーナー情報 */}
                    <div className="flex items-center mb-3 text-xs text-gray-600">
                      <div className="w-6 h-6 rounded-full bg-gray-300 mr-2"></div>
                      <span>{project.owner.name}</span>
                      <span className="mx-1">・</span>
                      <span>{project.owner.school} {project.owner.grade}</span>
                    </div>

                    {/* 進捗バー */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>¥{project.currentAmount.toLocaleString()}</span>
                        <span>目標: ¥{project.targetAmount.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-cyan-300 to-lime-300 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(100, project.progressPercent)}%` }}
                        ></div>
                      </div>
                      <div className="text-center text-xs text-gray-600 mt-1">
                        {project.progressPercent}%
                      </div>
                    </div>

                    {/* 統計情報 */}
                    <div className="flex justify-between text-xs text-gray-600">
                      <span className="flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                        </svg>
                        支援者 {project.supportersCount}人
                      </span>
                      <span className="flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                        </svg>
                        残り{project.daysLeft}日
                      </span>
                    </div>
                  </div>
                </Link>
              ))}

              {/* プロジェクト総数表示 */}
              {projectsData?.totalCount > 0 && (
                <div className="text-center text-xs text-gray-500 mt-4">
                  全{projectsData.totalCount}件のプロジェクト
                </div>
              )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}