import React from 'react';
import Image from 'next/image';
import StarRating from '@/components/ui/StarRating';
import Button from '@/components/ui/Button';

export default function QuestCard({ quest, onJoin, onViewDetails }) {
  const isLocked = quest.isLocked;

  return (
    <div className="relative bg-white border border-black rounded-lg overflow-hidden">
      {/* ロック状態のオーバーレイ */}
      {isLocked && (
        <>
          <div className="absolute inset-0 bg-gray-300 opacity-50 z-10"></div>
          <div className="absolute top-3 left-3 w-7 h-7 bg-black bg-opacity-75 rounded-full flex items-center justify-center z-20">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
        </>
      )}

      <div className="flex p-3">
        {/* 左側：アイコン */}
        <div className="flex-shrink-0 mr-4">
          <div className="w-32 h-32 relative overflow-hidden">
            <Image
              src={quest.icon}
              alt={quest.title}
              fill
              className="object-cover"
              sizes="128px"
            />
          </div>
        </div>

        {/* 右側：情報 */}
        <div className="flex-1 min-w-0">
          {/* タイトル */}
          <h3 className="text-xs font-bold text-black leading-tight mb-3">
            {quest.title}
          </h3>

          {/* 星評価 */}
          <div className="mb-3">
            <StarRating rating={quest.starRating} />
          </div>

          {/* マッチ度 */}
          <div className="mb-2">
            <span className="text-xs font-bold text-black">
              マッチ度： {quest.matchPercentage}%
            </span>
          </div>

          {/* スキル情報 */}
          <div className="mb-3">
            {quest.requiredSkills ? (
              <span className="text-xs text-black">
                推奨スキル： {quest.requiredSkills}
              </span>
            ) : (
              <span className="text-xs text-black">
                スキル傾向：{quest.skillTrend}
              </span>
            )}
          </div>

          {/* 募集人数・参加人数 (応募可能の場合のみ) */}
          {!isLocked && quest.requiredParticipants && (
            <>
              <div className="mb-2">
                <span className="text-xs text-black">
                  募集人数： {quest.requiredParticipants}名
                </span>
              </div>
              <div className="mb-3 flex items-center">
                <div className="w-3.5 h-3.5 mr-1 flex items-center justify-center">
                  <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xs text-black">
                  参加人数： {quest.participants}名
                </span>
              </div>
            </>
          )}

          {/* 期間・報酬バッジ (応募可能の場合のみ) */}
          {!isLocked && quest.duration && (
            <div className="flex gap-2 mb-3">
              <div className="bg-gray-200 rounded-full px-2 py-1">
                <span className="text-xs text-black text-center">
                  期間：{quest.duration}
                </span>
              </div>
              <div className="bg-gray-200 rounded-full px-2 py-1">
                <span className="text-xs text-black text-center">
                  報酬：{quest.reward}
                </span>
              </div>
            </div>
          )}

          {/* 解放条件バッジ (ロック状態の場合) */}
          {isLocked && quest.unlockCondition && (
            <div className="mb-3">
              <div className="bg-yellow-300 rounded-full px-2 py-1 inline-block">
                <span className="text-xs text-black text-center">
                  解放条件：{quest.unlockCondition}
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

      {/* アクションボタン (ロックされていない場合のみ) */}
      {!isLocked && (
        <div className="px-3 pb-3">
          <div className="flex justify-center">
            <Button
              onClick={() => onViewDetails?.(quest)}
              className="bg-gray-300 text-white font-bold text-xs px-12 py-2 rounded-full"
            >
              クエストを見る
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}