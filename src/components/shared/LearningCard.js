import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function LearningCard({ content, onEnroll, onViewDetails, onContinue, showProgress = false }) {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return '初級';
      case 'intermediate':
        return '中級';
      case 'advanced':
        return '上級';
      default:
        return '不明';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'course':
        return '📚';
      case 'tutorial':
        return '🎯';
      case 'workshop':
        return '🛠️';
      default:
        return '📖';
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'course':
        return 'コース';
      case 'tutorial':
        return 'チュートリアル';
      case 'workshop':
        return 'ワークショップ';
      default:
        return 'コンテンツ';
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}時間${mins > 0 ? mins + '分' : ''}`;
    }
    return `${mins}分`;
  };

  const completedChapters = content.chapters?.filter(chapter => chapter.completed).length || 0;
  const totalChapters = content.chapters?.length || 0;
  const progressPercentage = content.progress || 0;

  return (
    <Card className="h-full flex flex-col">
      {/* サムネイル */}
      <div className="w-full h-40 bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg mb-4 flex items-center justify-center">
        <div className="text-4xl">
          {getTypeIcon(content.type)}
        </div>
      </div>

      {/* ヘッダー情報 */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(content.difficulty)}`}>
            {getDifficultyText(content.difficulty)}
          </span>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            {getTypeText(content.type)}
          </span>
        </div>
        <div className="text-sm text-gray-500">
          {formatDuration(content.duration)}
        </div>
      </div>

      {/* タイトルと説明 */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {content.title}
      </h3>

      <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
        {content.description}
      </p>

      {/* プログレスバー（進行中の場合） */}
      {showProgress && progressPercentage > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>進捗</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          {totalChapters > 0 && (
            <div className="text-xs text-gray-500 mt-1">
              {completedChapters}/{totalChapters} チャプター完了
            </div>
          )}
        </div>
      )}

      {/* タグ */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {content.tags?.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
            >
              {tag}
            </span>
          ))}
          {content.tags?.length > 3 && (
            <span className="text-xs text-gray-500">
              +{content.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* インストラクター */}
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
          <span className="text-xs font-medium text-gray-600">
            {content.instructor?.name?.charAt(0) || 'I'}
          </span>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-900">
            {content.instructor?.name || 'インストラクター'}
          </div>
          <div className="text-xs text-gray-500">
            ⭐ {content.rating || '4.5'} • {content.enrolledUsers || 0}人受講中
          </div>
        </div>
      </div>

      {/* 学習目標（プレビュー） */}
      {content.objectives && content.objectives.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm font-medium text-blue-900 mb-2">学習目標</div>
          <ul className="text-sm text-blue-800 space-y-1">
            {content.objectives.slice(0, 2).map((objective, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span className="line-clamp-1">{objective}</span>
              </li>
            ))}
            {content.objectives.length > 2 && (
              <li className="text-xs text-blue-600">
                +{content.objectives.length - 2}個の目標
              </li>
            )}
          </ul>
        </div>
      )}

      {/* アクションボタン */}
      <div className="mt-auto flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onViewDetails?.(content)}
        >
          詳細
        </Button>
        {progressPercentage === 0 ? (
          <Button
            size="sm"
            className="flex-1"
            onClick={() => onEnroll?.(content)}
          >
            受講開始
          </Button>
        ) : progressPercentage === 100 ? (
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
          >
            完了済み
          </Button>
        ) : (
          <Button
            size="sm"
            className="flex-1"
            onClick={() => onContinue?.(content)}
          >
            続ける
          </Button>
        )}
      </div>
    </Card>
  );
}