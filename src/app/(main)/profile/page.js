'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { useProfileStore } from '@/store/profileStore';
import { useUIStore } from '@/store/uiStore';
import { profileAPI } from '@/lib/profileAPI';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import SkillChart from '@/components/profile/SkillChart';
import ProfileBubble from '@/components/profile/ProfileBubble';
import ProgressSteps from '@/components/profile/ProgressSteps';
import ChallengeRanking from '@/components/profile/ChallengeRanking';

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
  
  // プロキシAPIテスト用の状態
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [apiTestResults, setApiTestResults] = useState({});

  // プロキシAPIテスト機能（api-testページから移植）
  const testProxyAPI = async (proxyPath, method = 'GET', data = null, key) => {
    console.log(`🔄 [Profile Debug] Starting ${method} request to: /api/proxy/${proxyPath}`);
    
    const proxyURL = `/api/proxy/${proxyPath}`;
    
    try {
      const config = {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        }
      };
      
      // JWTトークンがある場合は追加
      if (typeof window !== 'undefined') {
        const userStore = JSON.parse(localStorage.getItem('user-storage') || '{}');
        if (userStore.state?.token) {
          config.headers.Authorization = `Bearer ${userStore.state.token}`;
          console.log(`🔄 [Profile Debug] Added JWT token to headers`);
        }
      }
      
      if (data && method !== 'GET') {
        config.body = JSON.stringify(data);
      }
      
      const response = await fetch(proxyURL, config);
      console.log(`🔄 [Profile Debug] Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log(`✅ [Profile Debug] Success:`, result);
      
      setApiTestResults(prev => ({
        ...prev,
        [key]: {
          success: true,
          data: result,
          timestamp: new Date().toLocaleTimeString(),
          url: proxyURL,
          method: method,
        }
      }));
      
      return result;
      
    } catch (err) {
      console.error(`❌ [Profile Debug] Error:`, {
        message: err.message,
        url: proxyURL,
        method: method,
        error: err
      });
      
      setApiTestResults(prev => ({
        ...prev,
        [key]: {
          success: false,
          error: err.message,
          timestamp: new Date().toLocaleTimeString(),
          url: proxyURL,
          method: method,
        }
      }));
      
      throw err;
    }
  };

  // 認証チェック
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // プロフィール情報取得（プロキシAPIテスト機能付き）
  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated) return;
      
      setLoading('profile', true);
      
      try {
        // デバッグ用：プロキシAPI直接テスト
        if (showDebugInfo) {
          console.log(`🔄 [Profile Debug] Starting detailed API tests...`);
          
          // メインのプロフィールAPIのみテスト
          await Promise.allSettled([
            testProxyAPI('profile', 'GET', null, 'profile_test')
          ]);
        }

        // プロフィール情報取得（必要なデータはすべて含まれている）
        const profileResponse = await profileAPI.getProfile();

        if (profileResponse.success) {
          setProfile(profileResponse.data);
          setEditForm({
            nickname: profileResponse.data.user?.nickname || profileResponse.data.nickname || '',
            dream: profileResponse.data.user?.headline || profileResponse.data.dream || '',
            bio: profileResponse.data.user?.bio || profileResponse.data.bio || '',
            values: profileResponse.data.values || []
          });
          
          // APIレスポンスにランキングなどの情報が含まれているため、これらも設定
          if (profileResponse.data.ranking) {
            setAchievements(profileResponse.data.ranking);
          }
        }
        
      } catch (error) {
        console.error(`❌ [Profile Debug] fetchProfile error:`, error);
        addNotification({
          type: 'error',
          message: error.message + ' (詳細はコンソールを確認してください)'
        });
        
        // エラー発生時は強制的にデバッグモードを有効化
        setShowDebugInfo(true);
        
      } finally {
        setLoading('profile', false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, showDebugInfo, setProfile, setStats, setAchievements, setLoading, addNotification]);

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

  // スキルデータの変換（APIから取得した実際のデータ構造に基づく）
  const skillData = {
    discover: profile?.skill_scores?.find || 25,     // みつける力
    create: profile?.skill_scores?.shape || 27,     // カタチにする力  
    deliver: profile?.skill_scores?.deliver || 73   // とどける力
  };

  const trustScore = profile?.skill_scores?.trust || 125;
  const teammates = profile?.teammates || 128;

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

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#E5E5E5' }}>
      {/* Background decorative circles with blur effect */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Top area circles */}
        <div className="absolute w-40 h-40 rounded-full opacity-60" 
             style={{ 
               background: '#6ADE08', 
               filter: 'blur(50px)',
               top: '260px',
               right: '-60px'
             }}></div>
        <div className="absolute w-40 h-40 rounded-full opacity-60" 
             style={{ 
               background: '#F0FE53', 
               filter: 'blur(50px)',
               top: '200px',
               left: '-100px'
             }}></div>
        <div className="absolute w-40 h-40 rounded-full opacity-60" 
             style={{ 
               background: '#5DDDE1', 
               filter: 'blur(50px)',
               top: '-80px',
               left: '120px'
             }}></div>
        
        {/* Bottom area circles */}
        <div className="absolute w-40 h-40 rounded-full opacity-60" 
             style={{ 
               background: '#6ADE08', 
               filter: 'blur(50px)',
               bottom: '-60px',
               right: '-60px'
             }}></div>
        <div className="absolute w-40 h-40 rounded-full opacity-60" 
             style={{ 
               background: '#F0FE53', 
               filter: 'blur(50px)',
               bottom: '10px',
               left: '-100px'
             }}></div>
        <div className="absolute w-40 h-40 rounded-full opacity-60" 
             style={{ 
               background: '#5DDDE1', 
               filter: 'blur(50px)',
               bottom: '300px',
               left: '120px'
             }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-sm mx-auto px-4 pb-20">
        
        {/* Profile Information (moved to top) */}
        <div className="pt-16 mb-8">
          {/* Profile image and dream message */}
          <div className="flex items-start mb-6">
            <div className="flex flex-col items-center mr-4">
              <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-white shadow-lg flex-shrink-0 mb-3">
                <img 
                  src="/32559793_s.jpg" 
                  alt={profile?.user?.nickname || profile?.nickname || '拓叶'} 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Name directly under image */}
              <span className="text-base font-bold text-black tracking-wider text-center">
                {profile?.user?.nickname || profile?.nickname || '拓叶'}
              </span>
            </div>
            <div className="flex-1 mt-2">
              <ProfileBubble 
                message={profile?.user?.headline || profile?.dream || 'プログラミングで地域課題を解決したい'} 
                position="left"
                className="mb-2"
              />
            </div>
          </div>
        </div>

        {/* Central Skill Chart (moved below profile) */}
        <div className="flex justify-center mb-10">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/10 rounded-xl blur-sm"></div>
            <div className="relative bg-gradient-to-br from-white/40 to-transparent backdrop-blur-sm rounded-xl p-6 shadow-xl">
              <SkillChart skills={skillData} trustScore={trustScore} />
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-black mb-4">未来ステップ 進行状況</h2>
          <ProgressSteps />
        </div>

        {/* Progress indicator (moved to after Progress Steps) */}
        <div className="flex justify-center items-center gap-2 mb-8">
          <div className="w-2 h-2 rounded-full bg-black"></div>
          <div className="w-2 h-2 rounded-full bg-gray-500"></div>
          <div className="w-2 h-2 rounded-full bg-gray-500"></div>
        </div>

        {/* Challenge Ranking */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-black mb-4">同じ夢の仲間の挑戦ランキングTOP3</h2>
          <ChallengeRanking />
        </div>

        {/* Teammates info (moved to bottom) with icon */}
        <div className="flex items-center justify-center gap-4 mb-8 px-4">
          <div className="flex-1">
            <ProfileBubble 
              message={`同じ夢・目標の仲間は${profile?.total_participants || teammates}人！ともに頑張ろう！`} 
              position="center"
            />
          </div>
          <img 
            src="/yurei.png" 
            alt="仲間アイコン" 
            className="w-16 h-16 object-contain flex-shrink-0"
          />
        </div>

        {/* Debug button (if needed) */}
        {showDebugInfo && (
          <div className="fixed bottom-4 right-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDebugInfo(!showDebugInfo)}
              className="text-xs bg-white"
            >
              🔧 Debug OFF
            </Button>
          </div>
        )}
        
        {!showDebugInfo && (
          <div className="fixed bottom-4 right-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDebugInfo(!showDebugInfo)}
              className="text-xs bg-white"
            >
              🔧 Debug
            </Button>
          </div>
        )}
      </div>

      {/* Debug Panel - Overlay */}
      {showDebugInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">🔧 デバッグ情報</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDebugInfo(false)}
                >
                  ✕
                </Button>
              </div>
              
              <div className="grid grid-cols-1 gap-4 mb-6">
                <button
                  onClick={() => testProxyAPI('profile', 'GET', null, 'manual_profile')}
                  className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  🔄 Profile API Test
                </button>
              </div>

              <details>
                <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 mb-2">
                  🔍 プロフィール情報を表示
                </summary>
                <pre className="p-3 bg-gray-50 rounded text-xs overflow-x-auto">
                  {JSON.stringify({
                    profile: profile,
                    stats: stats,
                    achievements: achievements
                  }, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}