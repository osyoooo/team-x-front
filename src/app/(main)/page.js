export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Team X ダッシュボード
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">クエスト</h2>
          <p className="text-gray-600">新しいクエストを始めよう</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">学習</h2>
          <p className="text-gray-600">スキルを向上させよう</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">成長記録</h2>
          <p className="text-gray-600">進歩を確認しよう</p>
        </div>
      </div>
    </div>
  );
}