import React from 'react';
import Image from 'next/image';
import StarRating from '@/components/ui/StarRating';
import Button from '@/components/ui/Button';

// ランダムなクエスト画像の配列
const questImages = [
  '/quest/ぱそこん-removebg-preview.png',
  '/quest/ぺん-removebg-preview.png',
  '/quest/ぼうさい-removebg-preview.png',
  '/quest/れびゅ-removebg-preview.png',
  '/quest/れぽ-removebg-preview.png'
];

// ランダムな画像を選択する関数
const getRandomQuestImage = () => {
  const randomIndex = Math.floor(Math.random() * questImages.length);
  return questImages[randomIndex];
};

export default function QuestCard({ quest, onJoin, onViewDetails, isUpcoming = false }) {
  const isLocked = quest.isLocked || isUpcoming;
  
  // 画像ソースの決定：quest.iconが有効でない場合はランダム画像を使用
  const imageSource = quest.icon && quest.icon.trim() ? quest.icon : getRandomQuestImage();

  return (
    <div className={`relative bg-white border border-black rounded-lg overflow-hidden w-full max-w-sm md:max-w-md lg:max-w-lg ${isLocked ? 'opacity-60' : ''}`} style={{minHeight: '172px'}}>
      {/* ロック状態のオーバーレイ */}
      {isLocked && (
        <>
          <div className="absolute inset-0 bg-gray-200 opacity-40 z-10"></div>
          <div className="absolute top-3 left-3 w-7 h-7 bg-black bg-opacity-80 rounded-full flex items-center justify-center z-20">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
        </>
      )}

      <div className="flex h-full">
        {/* 左側：アイコン */}
        <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 relative overflow-hidden mr-3 md:mr-4">
          <Image
            src={imageSource}
            alt={quest.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 80px, (max-width: 1024px) 96px, 128px"
          />
        </div>

        {/* 右側：情報 */}
        <div className="flex-1 min-w-0 py-2 md:py-3">
          {/* タイトル */}
          <h3 className="text-xs md:text-sm font-bold text-black leading-tight mb-2 md:mb-3 truncate">
            {quest.title}
          </h3>

          {/* 星評価 */}
          <div className="mb-2 md:mb-3">
            <StarRating rating={quest.starRating} />
          </div>

          {/* マッチ度 */}
          <div className="mb-1 md:mb-2">
            <span className="font-bold text-black text-xs md:text-sm">
              マッチ度： {quest.matchPercentage}%
            </span>
          </div>

          {/* スキル情報 */}
          <div className="mb-2 md:mb-3">
            {quest.requiredSkills ? (
              <span className="text-black text-xs md:text-sm">
                推奨スキル： {quest.requiredSkills}
              </span>
            ) : (
              <span className="text-black text-xs md:text-sm">
                スキル傾向：{quest.skillTrend}
              </span>
            )}
          </div>

          {/* 期間・報酬バッジ (応募可能の場合のみ) */}
          {!isLocked && quest.duration && (
            <div className="flex flex-wrap gap-1 md:gap-2 mb-2 md:mb-3">
              <div className="rounded-full px-2 py-1" style={{backgroundColor: '#E5E5E5'}}>
                <span className="text-black text-center text-xs">
                  期間：{quest.duration}
                </span>
              </div>
              <div className="rounded-full px-2 py-1" style={{backgroundColor: '#E5E5E5'}}>
                <span className="text-black text-center text-xs">
                  報酬：{quest.reward}
                </span>
              </div>
            </div>
          )}

          {/* 募集人数・参加人数 (応募可能の場合のみ) */}
          {!isLocked && quest.requiredParticipants && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              <div>
                <span className="text-black text-xs">
                  募集人数： {quest.requiredParticipants}名
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3.5 h-3.5 mr-1 flex items-center justify-center">
                  <svg className="w-3 h-3" fill="#575757" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-black text-xs">
                  参加人数： {quest.participants}名
                </span>
              </div>
            </div>
          )}

          {/* 解放条件バッジ (ロック状態の場合) */}
          {isLocked && (quest.unlockCondition || quest.unlock_message) && (
            <div className="mb-3">
              <div className="bg-yellow-300 rounded-full px-2 py-1 inline-block">
                <span className="text-xs text-black text-center">
                  解放条件：{quest.unlockCondition || quest.unlock_message}
                </span>
              </div>
            </div>
          )}

          {/* 提供団体 */}
          {quest.provider && (
            <div className="mb-3">
              <span className="text-xs text-black">
                提供団体：{quest.provider}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* アクションボタン */}
      <div className="px-3 pb-3">
        <div className="flex justify-center">
          {!isLocked ? (
            <Button
              onClick={() => onViewDetails?.(quest)}
              className="bg-gray-300 text-white font-bold text-xs px-12 py-2 rounded-full hover:bg-gray-400"
            >
              クエストを見る
            </Button>
          ) : (
            <Button
              disabled
              className="bg-gray-200 text-gray-500 font-bold text-xs px-12 py-2 rounded-full cursor-not-allowed"
            >
              {isUpcoming ? '解放待ち' : 'ロック中'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}