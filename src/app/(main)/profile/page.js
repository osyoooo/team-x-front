'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { useProfileStore } from '@/store/profileStore';
import { useUIStore } from '@/store/uiStore';
import { profileAPI } from '@/lib/profileAPI';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated } = useUserStore();
  const { 
    profile, 
    stats, 
    achievements, 
    isEditing,
    setProfile, 
    setStats, 
    setAchievements,
    setEditing,
    updateProfile,
    getLevel,
    getXPToNextLevel
  } = useProfileStore();
  const { setLoading, addNotification } = useUIStore();
  
  const [editForm, setEditForm] = useState({
    nickname: '',
    dream: '',
    bio: '',
    values: []
  });
  const [newValue, setNewValue] = useState('');
  const [statsPeriod, setStatsPeriod] = useState('month');

  // 認証チェック
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // プロフィール情報取得
  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated) return;
      
      setLoading('profile', true);
      try {
        const [profileResponse, statsResponse, achievementsResponse] = await Promise.all([
          profileAPI.getProfile(),
          profileAPI.getStats(statsPeriod),
          profileAPI.getAchievements()
        ]);

        if (profileResponse.success) {
          setProfile(profileResponse.data);
          setEditForm({
            nickname: profileResponse.data.nickname || '',
            dream: profileResponse.data.dream || '',
            bio: profileResponse.data.bio || '',
            values: profileResponse.data.values || []
          });
        }

        if (statsResponse.success) {
          setStats(statsResponse.data);
        }

        if (achievementsResponse.success) {
          setAchievements(achievementsResponse.data);
        }
      } catch (error) {
        addNotification({
          type: 'error',
          message: error.message
        });
      } finally {
        setLoading('profile', false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, statsPeriod, setProfile, setStats, setAchievements, setLoading, addNotification]);

  const handleEditToggle = () => {
    if (isEditing) {
      // 編集をキャンセル
      setEditForm({
        nickname: profile?.nickname || '',
        dream: profile?.dream || '',
        bio: profile?.bio || '',
        values: profile?.values || []
      });
    }
    setEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    try {
      const response = await profileAPI.updateProfile(editForm);
      if (response.success) {
        updateProfile(editForm);
        setEditing(false);
        addNotification({
          type: 'success',
          message: 'プロフィールを更新しました'
        });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.message
      });
    }
  };

  const handleAddValue = () => {
    if (newValue.trim() && !editForm.values.includes(newValue.trim())) {
      setEditForm(prev => ({
        ...prev,
        values: [...prev.values, newValue.trim()]
      }));
      setNewValue('');
    }
  };

  const handleRemoveValue = (valueToRemove) => {
    setEditForm(prev => ({
      ...prev,
      values: prev.values.filter(value => value !== valueToRemove)
    }));
  };

  const getSkillLevelText = (level) => {
    switch (level) {
      case 1:
        return '入門';
      case 2:
        return '初級';
      case 3:
        return '中級';
      case 4:
        return '上級';
      case 5:
        return '専門家';
      default:
        return '不明';
    }
  };

  const getSkillLevelColor = (level) => {
    switch (level) {
      case 1:
        return 'bg-gray-100 text-gray-800';
      case 2:
        return 'bg-blue-100 text-blue-800';
      case 3:
        return 'bg-green-100 text-green-800';
      case 4:
        return 'bg-yellow-100 text-yellow-800';
      case 5:
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isLoading = useUIStore((state) => state.loading.profile);

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  const currentLevel = getLevel();
  const xpToNext = getXPToNextLevel();
  const levelProgress = profile?.stats?.totalXP ? ((profile.stats.totalXP % 100) / 100) * 100 : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">プロフィール</h1>
          <p className="text-gray-600">あなたの学習の軌跡と成長を確認しましょう</p>
        </div>
        <Button
          variant={isEditing ? 'outline' : 'primary'}
          onClick={isEditing ? handleEditToggle : handleEditToggle}
        >
          {isEditing ? 'キャンセル' : '編集'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左カラム - プロフィール基本情報 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 基本情報 */}
          <Card>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-6">
                  {profile?.nickname?.charAt(0) || 'U'}
                </div>
                <div>
                  {isEditing ? (
                    <Input
                      value={editForm.nickname}
                      onChange={(e) => setEditForm(prev => ({ ...prev, nickname: e.target.value }))}
                      placeholder="ニックネーム"
                      className="text-lg font-semibold"
                    />
                  ) : (
                    <h2 className="text-2xl font-bold text-gray-900">{profile?.nickname}</h2>
                  )}
                  <p className="text-gray-600">{profile?.email}</p>
                  <div className="flex items-center mt-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                      レベル {currentLevel}
                    </span>
                    <span className="ml-2 text-sm text-gray-600">
                      次のレベルまで {xpToNext} XP
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* レベルプログレスバー */}
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${levelProgress}%` }}
                ></div>
              </div>
            </div>

            {/* 夢・目標 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">💫 夢・目標</h3>
              {isEditing ? (
                <textarea
                  value={editForm.dream}
                  onChange={(e) => setEditForm(prev => ({ ...prev, dream: e.target.value }))}
                  placeholder="あなたの夢や目標を教えてください"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              ) : (
                <p className="text-gray-700 bg-blue-50 p-4 rounded-lg">
                  {profile?.dream || '夢や目標を設定してみましょう！'}
                </p>
              )}
            </div>

            {/* 自己紹介 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">📝 自己紹介</h3>
              {isEditing ? (
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="自己紹介を書いてみましょう"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              ) : (
                <p className="text-gray-700">
                  {profile?.bio || '自己紹介を追加してみましょう！'}
                </p>
              )}
            </div>

            {/* 価値観 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">⭐ 価値観</h3>
              {isEditing ? (
                <div>
                  <div className="flex gap-2 mb-3">
                    <Input
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      placeholder="新しい価値観を追加"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddValue()}
                    />
                    <Button onClick={handleAddValue} size="sm">
                      追加
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {editForm.values.map((value, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm cursor-pointer hover:bg-purple-200"
                        onClick={() => handleRemoveValue(value)}
                      >
                        {value}
                        <span className="ml-1">×</span>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile?.values?.map((value, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                    >
                      {value}
                    </span>
                  )) || <span className="text-gray-500">価値観を追加してみましょう！</span>}
                </div>
              )}
            </div>

            {isEditing && (
              <div className="mt-6 flex gap-3">
                <Button onClick={handleSaveProfile}>
                  保存
                </Button>
                <Button variant="outline" onClick={handleEditToggle}>
                  キャンセル
                </Button>
              </div>
            )}
          </Card>

          {/* スキル */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🛠️ スキル</h3>
            <div className="space-y-3">
              {profile?.skills?.map((skill, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium text-gray-900">{skill.name}</span>
                    <span className="text-sm text-gray-600 ml-2">({skill.category})</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSkillLevelColor(skill.level)}`}>
                    {getSkillLevelText(skill.level)}
                  </span>
                </div>
              )) || <p className="text-gray-500">スキルを追加してみましょう！</p>}
            </div>
          </Card>
        </div>

        {/* 右カラム - 統計とアチーブメント */}
        <div className="space-y-6">
          {/* 統計 */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">📊 統計</h3>
              <select
                value={statsPeriod}
                onChange={(e) => setStatsPeriod(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-2 py-1"
              >
                <option value="week">今週</option>
                <option value="month">今月</option>
                <option value="all">全期間</option>
              </select>
            </div>
            <div className="space-y-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats?.questsCompleted || 0}</div>
                <div className="text-sm text-gray-600">完了クエスト</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats?.learningHours || 0}h</div>
                <div className="text-sm text-gray-600">学習時間</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{stats?.xpGained || 0}</div>
                <div className="text-sm text-gray-600">獲得経験値</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{stats?.streakDays || 0}日</div>
                <div className="text-sm text-gray-600">継続日数</div>
              </div>
            </div>
          </Card>

          {/* バッジ */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 バッジ</h3>
            <div className="grid grid-cols-2 gap-3">
              {profile?.stats?.badges?.map((badge, index) => (
                <div key={index} className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="text-2xl mb-1">{badge.icon}</div>
                  <div className="text-xs font-medium text-gray-900">{badge.name}</div>
                </div>
              )) || <p className="col-span-2 text-gray-500 text-center">バッジを獲得してみましょう！</p>}
            </div>
          </Card>

          {/* 最近のアチーブメント */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🎉 最近のアチーブメント</h3>
            <div className="space-y-3">
              {achievements?.slice(0, 3).map((achievement) => (
                <div key={achievement.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-900 text-sm">{achievement.title}</div>
                  <div className="text-xs text-gray-600">{achievement.description}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(achievement.date).toLocaleDateString('ja-JP')}
                  </div>
                </div>
              )) || <p className="text-gray-500">アチーブメントを獲得してみましょう！</p>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}