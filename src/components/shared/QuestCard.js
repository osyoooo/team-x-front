import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function QuestCard({ quest, onJoin, onViewDetails, userQuest = false }) {
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

  const getStatusText = (status) => {
    switch (status) {
      case 'available':
        return '参加可能';
      case 'in_progress':
        return '進行中';
      case 'completed':
        return '完了';
      default:
        return '不明';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const completedSteps = quest.steps?.filter(step => step.completed).length || 0;
  const totalSteps = quest.steps?.length || 0;
  const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <Card className="h-full flex flex-col">
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quest.difficulty)}`}>
            {getDifficultyText(quest.difficulty)}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quest.status)}`}>
            {getStatusText(quest.status)}
          </span>
        </div>
        <div className="text-sm text-gray-500">
          {quest.estimatedHours}時間
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {quest.title}
      </h3>

      <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
        {quest.description}
      </p>

      {/* プログレスバー（進行中のクエストの場合） */}
      {userQuest && quest.status === 'in_progress' && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>進捗</span>
            <span>{completedSteps}/{totalSteps} ステップ</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* タグ */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {quest.tags?.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
            >
              {tag}
            </span>
          ))}
          {quest.tags?.length > 3 && (
            <span className="text-xs text-gray-500">
              +{quest.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* オーナー情報 */}
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
          <span className="text-xs font-medium text-gray-600">
            {quest.owner?.name?.charAt(0) || 'O'}
          </span>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-900">
            {quest.owner?.name || 'オーナー'}
          </div>
          <div className="text-xs text-gray-500">
            ⭐ {quest.owner?.rating || '4.5'} • {quest.participants || 0}人参加中
          </div>
        </div>
      </div>

      {/* 報酬 */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-sm font-medium text-gray-900 mb-2">報酬</div>
        <div className="flex justify-between text-sm">
          <span className="text-blue-600">経験値: {quest.rewards?.xp || 0} XP</span>
          <span className="text-green-600">ベネフィット: {quest.rewards?.benefits || 0}pt</span>
        </div>
      </div>

      {/* アクションボタン */}
      <div className="mt-auto flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onViewDetails?.(quest)}
        >
          詳細
        </Button>
        {!userQuest && quest.status === 'available' && (
          <Button
            size="sm"
            className="flex-1"
            onClick={() => onJoin?.(quest)}
          >
            参加する
          </Button>
        )}
        {userQuest && quest.status === 'in_progress' && (
          <Button
            size="sm"
            className="flex-1"
            onClick={() => onViewDetails?.(quest)}
          >
            続ける
          </Button>
        )}
      </div>
    </Card>
  );
}