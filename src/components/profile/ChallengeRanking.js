'use client';

export default function ChallengeRanking({ rankings = [] }) {
  const defaultRankings = [
    {
      rank: 1,
      title: 'React実践開発',
      skills: 'Webアプリ開発、画面部品管理、高速レスポンス',
      participants: 45
    },
    {
      rank: 2,
      title: 'React実践開発',
      skills: 'Webアプリ開発、画面部品管理、高速レスポンス',
      participants: 45
    },
    {
      rank: 3,
      title: 'React実践開発',
      skills: 'Webアプリ開発、画面部品管理、高速レスポンス',
      participants: 45
    }
  ];

  const rankingData = rankings.length > 0 ? rankings : defaultRankings;

  return (
    <div className="bg-white px-1.5 py-1.5 rounded">
      {rankingData.map((item, index) => (
        <div key={index} className="relative">
          <div className="flex items-start p-4">
            {/* Rank number */}
            <div className="w-8 h-6 flex items-center justify-center mr-4 mt-1">
              <span className="text-xl font-bold text-gray-700">{item.rank}</span>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-xs font-bold text-black">{item.title}</h3>
                <span className="text-xs font-bold text-gray-500">{item.participants}人参加中</span>
              </div>
              <p className="text-xs text-black leading-relaxed">
                スキル：{item.skills}
              </p>
            </div>
          </div>
          
          {/* Divider line */}
          {index < rankingData.length - 1 && (
            <div className="border-b border-gray-300 mx-4"></div>
          )}
        </div>
      ))}
    </div>
  );
}