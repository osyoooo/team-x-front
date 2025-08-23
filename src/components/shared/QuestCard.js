import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
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

  const CardContent = (
    <div className={`relative bg-white border border-black rounded-lg overflow-hidden w-full max-w-sm md:max-w-md lg:max-w-lg ${isLocked ? 'opacity-60 pointer-events-none' : 'hover:shadow-lg transition-shadow duration-200'} h-full flex flex-col`} style={{minHeight: '172px'}}>
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

      <div className="flex flex-grow">
        {/* 左側：アイコン */}
        <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 relative overflow-hidden mr-3 md:mr-4 self-center">
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

          {/* 星評価と期間・報酬バッジを横並び */}
          <div className="mb-2 md:mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <StarRating rating={quest.difficulty_level || quest.starRating || 0} />
              {/* 期間・報酬バッジ (応募可能の場合のみ) */}
              {!isLocked && (quest.duration_display || quest.duration || quest.points_display || quest.reward) && (
                <>
                  {(quest.duration_display || quest.duration) && (
                    <div className="rounded-full px-2 py-1" style={{backgroundColor: '#E5E5E5'}}>
                      <span className="text-black text-center text-xs">
                        期間：{quest.duration_display || quest.duration}
                      </span>
                    </div>
                  )}
                  {(quest.points_display || quest.reward) && (
                    <div className="rounded-full px-2 py-1" style={{backgroundColor: '#E5E5E5'}}>
                      <span className="text-black text-center text-xs">
                        報酬：{quest.points_display || quest.reward}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* マッチ度 */}
          <div className="mb-1 md:mb-2">
            <span className="font-bold text-black text-xs md:text-sm">
              マッチ度： {quest.match_rate || quest.matchPercentage}%
            </span>
          </div>

          {/* スキル情報 */}
          <div className="mb-2 md:mb-3">
            {quest.requiredSkills || quest.skillTrend ? (
              <span className="text-black text-xs md:text-sm">
                {quest.requiredSkills ? `推奨スキル： ${quest.requiredSkills}` : `スキル傾向： ${quest.skillTrend}`}
              </span>
            ) : quest.objective ? (
              <span className="text-black text-xs md:text-sm">
                目的： {quest.objective}
              </span>
            ) : null}
          </div>

          {/* 提供団体 */}
          {(quest.provider_name || quest.provider) && (
            <div className="mb-2 md:mb-3">
              <span className="text-xs text-black">
                提供団体：{quest.provider_name || quest.provider}
              </span>
            </div>
          )}

          {/* 募集人数・参加人数 (応募可能の場合のみ) */}
          {!isLocked && (quest.requiredParticipants || quest.participants_display || quest.participants) && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mb-2 md:mb-3">
              {quest.requiredParticipants && (
                <div>
                  <span className="text-black text-xs">
                    募集人数： {quest.requiredParticipants}名
                  </span>
                </div>
              )}
              {(quest.participants_display || quest.participants) && (
                <div className="flex items-center">
                  <div className="w-3.5 h-3.5 mr-1 flex items-center justify-center">
                    <svg className="w-3 h-3" fill="#575757" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-black text-xs">
                    参加人数： {quest.participants_display || quest.participants || '0'}名
                  </span>
                </div>
              )}
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
        </div>
      </div>

      {/* アクションボタン */}
      <div className="px-3 pb-3 mt-auto">
        <div className="flex justify-center">
          {!isLocked ? (
            <div className="bg-blue-500 text-white font-bold text-xs px-12 py-2 rounded-full">
              クエストを見る
            </div>
          ) : (
            <div className="bg-gray-200 text-gray-500 font-bold text-xs px-12 py-2 rounded-full">
              {isUpcoming ? '解放待ち' : 'ロック中'}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isLocked) {
    return CardContent;
  }

  return (
    <Link href={`/quest/${quest.id}`} className="h-full block">
      {CardContent}
    </Link>
  );
}