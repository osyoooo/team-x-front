export default function Loading() {
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
        {/* 成長グラフエリア スケルトン */}
        <div className="bg-black bg-opacity-25 text-white relative px-4 py-8">
          {/* グラフ背景 スケルトン */}
          <div className="relative h-96 mb-8">
            {/* Y軸ラベル スケルトン */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="w-6 h-3 bg-white bg-opacity-30 rounded animate-pulse"></div>
              ))}
            </div>

            {/* グリッドライン スケルトン */}
            <div className="absolute left-8 top-0 right-0 h-full">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-full border-t border-dashed border-gray-400 opacity-50"
                  style={{ top: `${(i / 8) * 100}%` }}
                />
              ))}
            </div>

            {/* グラフエリア スケルトン */}
            <div className="absolute left-8 top-0 right-0 h-full">
              <div className="w-full h-full bg-white bg-opacity-10 rounded animate-pulse"></div>
            </div>

            {/* X軸ラベル スケルトン */}
            <div className="absolute bottom-0 left-8 right-0 flex justify-between text-xs">
              <div className="w-10 h-3 bg-white bg-opacity-30 rounded animate-pulse"></div>
              <div className="w-10 h-3 bg-white bg-opacity-30 rounded animate-pulse"></div>
            </div>
          </div>

          {/* 統計情報 スケルトン */}
          <div className="flex justify-between items-end px-4">
            <div>
              <div className="w-20 h-3 bg-white bg-opacity-30 rounded mb-1 animate-pulse"></div>
              <div className="w-12 h-6 bg-white bg-opacity-30 rounded animate-pulse"></div>
            </div>
            <div className="text-right">
              <div className="w-24 h-3 bg-white bg-opacity-30 rounded mb-1 animate-pulse"></div>
              <div className="w-12 h-6 bg-white bg-opacity-30 rounded animate-pulse"></div>
            </div>
          </div>

          {/* 現在スコア表示 スケルトン */}
          <div className="absolute top-4 right-4">
            <div className="text-right">
              <div className="w-8 h-3 bg-white bg-opacity-30 rounded mb-1 animate-pulse"></div>
              <div className="w-12 h-5 bg-white bg-opacity-30 rounded animate-pulse"></div>
            </div>
          </div>

          {/* ALL ドロップダウン スケルトン */}
          <div className="absolute top-4 right-16">
            <div className="w-8 h-4 bg-white bg-opacity-30 rounded animate-pulse"></div>
          </div>
        </div>

        {/* 活動サマリー スケルトン */}
        <div className="px-4 py-4">
          <div className="w-20 h-4 bg-gray-400 rounded mb-4 animate-pulse"></div>
          
          <div className="bg-white rounded-lg p-4 flex justify-between items-center">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-3 bg-gray-300 rounded mb-1 animate-pulse mx-auto"></div>
                <div className="w-8 h-6 bg-gray-300 rounded animate-pulse mx-auto"></div>
              </div>
            ))}
          </div>
        </div>

        {/* 活動履歴 スケルトン */}
        <div className="px-4 py-4">
          <div className="w-16 h-4 bg-gray-400 rounded mb-4 animate-pulse"></div>
          
          {/* タブ スケルトン */}
          <div className="bg-gray-400 bg-opacity-80 rounded-full p-3 mb-4 flex justify-center space-x-12">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="w-12 h-4 bg-white bg-opacity-40 rounded-full animate-pulse"></div>
            ))}
          </div>

          {/* アンダーライン スケルトン */}
          <div className="w-32 h-0.5 bg-gray-400 mb-6"></div>

          {/* 活動リスト スケルトン */}
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg p-4 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-300 rounded mr-4"></div>
                    <div className="flex-1">
                      <div className="w-32 h-4 bg-gray-300 rounded mb-1"></div>
                      <div className="w-48 h-3 bg-gray-300 rounded mb-1"></div>
                      <div className="w-24 h-3 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 履歴一覧リンク スケルトン */}
          <div className="flex justify-end items-center mt-6">
            <div className="w-16 h-4 bg-gray-400 rounded animate-pulse"></div>
          </div>
        </div>

        {/* 中央ローディング表示 */}
        <div className="flex justify-center items-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-sm">成長データを読み込み中...</p>
          </div>
        </div>
      </div>
    </div>
  );
}