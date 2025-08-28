export default function Loading() {
  return (
    <div className="bg-gray-200 min-h-screen">
      {/* 背景の円形エフェクト */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-40 h-40 rounded-full bg-green-400 opacity-30 blur-xl animate-pulse" style={{ top: '100px', right: '80px' }}></div>
        <div className="absolute w-40 h-40 rounded-full bg-yellow-300 opacity-30 blur-xl animate-pulse" style={{ top: '200px', left: '-25px' }}></div>
        <div className="absolute w-40 h-40 rounded-full bg-cyan-300 opacity-30 blur-xl animate-pulse" style={{ top: '30px', left: '30%' }}></div>
        <div className="absolute w-40 h-40 rounded-full bg-green-400 opacity-30 blur-xl animate-pulse" style={{ bottom: '200px', right: '80px' }}></div>
        <div className="absolute w-40 h-40 rounded-full bg-yellow-300 opacity-30 blur-xl animate-pulse" style={{ bottom: '100px', left: '-25px' }}></div>
        <div className="absolute w-40 h-40 rounded-full bg-cyan-300 opacity-30 blur-xl animate-pulse" style={{ bottom: '400px', left: '30%' }}></div>
      </div>

      <div className="relative z-10 px-4 pt-8">
        {/* ポイントサークル スケルトン */}
        <div className="bg-white rounded-2xl p-6 mb-4 mx-4 animate-pulse">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-1">
              <div className="h-3 bg-gray-200 rounded w-12"></div>
              <div className="h-3 bg-gray-200 rounded w-8"></div>
              <div className="h-4 bg-gray-200 rounded w-10"></div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
          
          {/* メインポイントサークル スケルトン */}
          <div className="flex justify-center mb-6">
            <div className="relative w-48 h-48">
              <div className="w-full h-full rounded-full border-8 border-gray-200"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="h-10 bg-gray-200 rounded w-16 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-6 mx-auto"></div>
                </div>
              </div>
            </div>
          </div>

          {/* ポイント詳細 スケルトン */}
          <div className="flex justify-between">
            <div className="text-center">
              <div className="h-3 bg-gray-200 rounded w-20 mb-1 mx-auto"></div>
              <div className="h-6 bg-gray-200 rounded w-12 mb-1 mx-auto"></div>
              <div className="h-3 bg-gray-200 rounded w-4 mx-auto"></div>
            </div>
            <div className="text-center">
              <div className="h-3 bg-gray-200 rounded w-24 mb-1 mx-auto"></div>
              <div className="h-6 bg-gray-200 rounded w-20 mb-1 mx-auto"></div>
              <div className="h-3 bg-gray-200 rounded w-6 mx-auto"></div>
            </div>
          </div>
        </div>

        {/* 特典解放マップタイトル スケルトン */}
        <div className="px-4 mb-2">
          <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
        </div>

        {/* フィルタータブ スケルトン */}
        <div className="bg-white bg-opacity-80 rounded-full p-4 mx-4 mb-4 animate-pulse">
          <div className="flex justify-center space-x-20">
            <div className="h-3 bg-gray-200 rounded w-12"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
            <div className="h-3 bg-gray-200 rounded w-12"></div>
          </div>
        </div>

        {/* 特典リスト スケルトン */}
        <div className="space-y-1 px-1">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg p-4 flex items-center justify-between animate-pulse">
              <div className="flex items-center flex-1">
                {/* ポイント数 スケルトン */}
                <div className="flex flex-col items-center mr-4 min-w-16">
                  <div className="h-6 bg-gray-200 rounded w-12 mb-1"></div>
                  <div className="w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-200"></div>
                </div>

                {/* 特典内容 スケルトン */}
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded w-32 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-48"></div>
                </div>

                {/* 状態ボタン スケルトン */}
                <div className="mr-3">
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                </div>

                {/* 矢印アイコン スケルトン */}
                <div className="h-3 w-3 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>

        {/* ローディングメッセージ */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg px-6 py-3 flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-3"></div>
          <span className="text-sm text-gray-600">特典データを読み込み中...</span>
        </div>
      </div>
    </div>
  );
}