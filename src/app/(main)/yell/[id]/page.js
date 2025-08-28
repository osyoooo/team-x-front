'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { fetchProjectDetail, normalizeProjectData } from '@/lib/yellAPI';
import Image from 'next/image';
import Link from 'next/link';

export default function YellProjectDetailPage({ params }) {
  const router = useRouter();
  const { isAuthenticated } = useUserStore();
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProjectOverviewExpanded, setIsProjectOverviewExpanded] = useState(false);

  // 認証チェック
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // プロジェクト詳細を取得
  useEffect(() => {
    const loadProjectDetail = async () => {
      setLoading(true);
      setError(null);
      
      const result = await fetchProjectDetail(projectId);
      
      if (result.success) {
        const normalizedData = normalizeProjectData(result.data);
        setProject(normalizedData);
      } else {
        setError(result.error);
        if (result.notFound) {
          // 404の場合は一覧ページへリダイレクト
          setTimeout(() => router.push('/yell'), 3000);
        }
      }
      
      setLoading(false);
    };

    if (isAuthenticated && projectId) {
      loadProjectDetail();
    }
  }, [projectId, isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-200 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-200 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Link
            href="/yell"
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            プロジェクト一覧へ戻る
          </Link>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-green-50 relative overflow-hidden">
      {/* カラフルなグラデーション背景ボール */}
      <div className="absolute inset-0 pointer-events-none">
        {/* エメラルド系 */}
        <div className="absolute w-52 h-52 bg-emerald-300 rounded-full blur-2xl opacity-50" 
             style={{ top: '10%', right: '20%' }}></div>
        <div className="absolute w-40 h-40 bg-emerald-200 rounded-full blur-2xl opacity-60" 
             style={{ bottom: '30%', right: '10%' }}></div>
        
        {/* ライム系 */}
        <div className="absolute w-48 h-48 bg-lime-300 rounded-full blur-2xl opacity-50" 
             style={{ top: '25%', left: '-5%' }}></div>
        <div className="absolute w-36 h-36 bg-lime-200 rounded-full blur-2xl opacity-60" 
             style={{ bottom: '15%', left: '15%' }}></div>
        
        {/* スカイブルー系 */}
        <div className="absolute w-44 h-44 bg-sky-300 rounded-full blur-2xl opacity-50" 
             style={{ top: '-5%', left: '30%' }}></div>
        <div className="absolute w-56 h-56 bg-sky-200 rounded-full blur-3xl opacity-40" 
             style={{ bottom: '40%', left: '40%' }}></div>
        
        {/* ピンク系 */}
        <div className="absolute w-40 h-40 bg-pink-300 rounded-full blur-2xl opacity-40" 
             style={{ top: '50%', right: '35%' }}></div>
        
        {/* 紫系 */}
        <div className="absolute w-36 h-36 bg-purple-300 rounded-full blur-2xl opacity-40" 
             style={{ bottom: '5%', right: '45%' }}></div>
      </div>

      {/* 戻るボタン */}
      <div className="relative z-20 max-w-md mx-auto pt-4 px-4">
        <Link
          href="/yell"
          className="inline-flex items-center text-white hover:text-gray-200 transition-colors"
        >
          <svg className="w-6 h-6 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm">一覧へ戻る</span>
        </Link>
      </div>

      {/* メインコンテンツカード */}
      <div className="relative z-10 max-w-md mx-auto bg-white min-h-screen mt-4">
        
        {/* ヒーロー画像 */}
        {project.imageUrl && (
          <div className="relative w-full h-40 bg-gray-100">
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* メインコンテンツ */}
        <div className="px-9 py-4">
          
          {/* タイトルセクション */}
          <div className="mb-6">
            <h1 className="text-base font-bold text-black mb-1 leading-tight">
              {project.title}
            </h1>
            {project.category && (
              <p className="text-xs text-gray-600">
                カテゴリー: {project.category}
              </p>
            )}
          </div>

          {/* オーナー情報と実績バッジ */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-300">
                {project.owner.avatarUrl && (
                  <Image
                    src={project.owner.avatarUrl}
                    alt={project.owner.name}
                    width={28}
                    height={28}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div>
                <div className="text-xs text-gray-600">オーナー</div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-black font-medium">
                    {project.owner.name}
                  </span>
                  <span className="text-xs text-gray-600">
                    （{project.owner.school} {project.owner.grade}）
                  </span>
                </div>
              </div>
            </div>
            
            {/* 実績バッジ（将来実装用） */}
            <div className="bg-gray-200 rounded-full px-4 py-1">
              <span className="text-xs text-black">これまでの実績</span>
            </div>
          </div>

          {/* 資金調達情報 */}
          <div className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="text-xs text-gray-600 mb-1">支援総額</div>
                <div className="text-base font-bold text-black">
                  {project.currentAmount.toLocaleString()} 円
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-600 mb-1">目標金額</div>
                <div className="text-xs text-gray-600">
                  {project.targetAmount.toLocaleString()} 円
                </div>
              </div>
            </div>

            {/* プログレスバー */}
            <div className="relative w-full h-6 bg-gray-300 rounded-full mb-3 shadow-inner">
              <div 
                className="absolute top-1 left-1 h-4 bg-gradient-to-r from-cyan-300 to-lime-300 rounded-full"
                style={{ width: `${Math.max(0, Math.min(96, (project.currentAmount / project.targetAmount) * 100 - 2))}%` }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-white opacity-90">
                  {project.progressPercent}%
                </span>
              </div>
            </div>

            {/* 統計情報 */}
            <div className="flex justify-between items-center">
              <div className="flex items-center text-xs text-gray-600">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                </svg>
                応援者{project.supportersCount}名
              </div>
              <div className="flex items-center text-xs text-gray-600">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                </svg>
                あと{project.daysLeft}日
              </div>
            </div>
          </div>

          {/* なぜつくるのか？ */}
          {project.whyDescription && (
            <div className="mb-4">
              <h3 className="text-xs font-normal text-gray-600 mb-2">なぜつくるのか？</h3>
              <p className="text-xs text-black whitespace-pre-wrap">{project.whyDescription}</p>
            </div>
          )}

          {/* 何を実現するのか？ */}
          {project.whatDescription && (
            <div className="mb-6">
              <h3 className="text-xs font-normal text-gray-600 mb-2">何を実現するのか？</h3>
              <p className="text-xs text-black whitespace-pre-wrap">{project.whatDescription}</p>
            </div>
          )}

          {/* 特徴リスト */}
          {project.features && project.features.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-normal text-gray-600 mb-2">特徴</h3>
              <div className="space-y-1">
                {project.features.map((feature, index) => (
                  <p key={index} className="text-xs text-black leading-relaxed">
                    • {feature}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* 区切り線 */}
          <div className="border-b border-gray-200 mb-4"></div>

          {/* 応援コメント（updates） */}
          {project.updates && project.updates.length > 0 && (
            <div className="mb-4">
              <h3 className="text-xs font-normal text-gray-600 mb-4">応援コメント</h3>
              
              {project.updates.map((update, index) => (
                <div key={index} className="flex items-start space-x-3 mb-6">
                  <div className="w-7 h-7 rounded-full bg-gray-300 flex-shrink-0"></div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-normal text-gray-600">
                        {update.supporter_name || `サポーター${index + 1}`}
                      </span>
                      {update.amount && (
                        <span className="bg-gray-100 text-xs font-bold text-gray-600 px-1 py-0.5 rounded text-right">
                          {update.amount.toLocaleString()}円
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-black mb-1">{update.message || update.content}</p>
                    {update.created_at && (
                      <span className="text-xs text-gray-600">
                        {new Date(update.created_at).toLocaleDateString('ja-JP')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* リワード情報 */}
          {project.rewards && project.rewards.length > 0 && (
            <>
              <div className="border-b border-gray-200 mb-4"></div>
              <div className="mb-6">
                <h3 className="text-xs font-normal text-gray-600 mb-4">リワード</h3>
                <div className="space-y-3">
                  {project.rewards.map((reward, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-black">
                          {reward.amount.toLocaleString()}円
                        </span>
                        {reward.limit && (
                          <span className="text-xs text-gray-600">
                            限定{reward.limit}名
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-black mb-1">{reward.title}</p>
                      <p className="text-xs text-gray-600">{reward.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* プロジェクト概要（折りたたみ） */}
          <div className="border-b border-gray-200 mb-4"></div>
          <div className="mb-8">
            <button
              onClick={() => setIsProjectOverviewExpanded(!isProjectOverviewExpanded)}
              className="flex items-center justify-between w-full py-2 text-left"
            >
              <span className="text-xs font-normal text-gray-600">プロジェクト概要</span>
              <svg 
                className={`w-6 h-6 text-gray-600 transition-transform ${isProjectOverviewExpanded ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isProjectOverviewExpanded && (
              <div className="mt-3 text-xs text-black">
                {project.owner.bio && (
                  <div className="mb-3">
                    <h4 className="font-medium mb-1">オーナーについて</h4>
                    <p>{project.owner.bio}</p>
                  </div>
                )}
                {project.whyDescription && (
                  <div className="mb-3">
                    <h4 className="font-medium mb-1">詳細な背景</h4>
                    <p className="whitespace-pre-wrap">{project.whyDescription}</p>
                  </div>
                )}
                {project.whatDescription && (
                  <div>
                    <h4 className="font-medium mb-1">詳細な実現内容</h4>
                    <p className="whitespace-pre-wrap">{project.whatDescription}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 支援ボタン */}
          {project.canSupport && !project.isSupported && (
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20">
              <div className="max-w-md mx-auto">
                <button 
                  className="w-full py-3 bg-gradient-to-r from-pink-400 to-pink-500 text-white font-bold rounded-lg hover:from-pink-500 hover:to-pink-600 transition-all shadow-lg"
                  onClick={() => alert('支援機能は現在準備中です')}
                >
                  このプロジェクトを支援する
                </button>
              </div>
            </div>
          )}

          {project.isSupported && (
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600 font-medium">
                ✓ このプロジェクトを支援済みです
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}