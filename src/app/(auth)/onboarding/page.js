'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { useUIStore } from '@/store/uiStore';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';

export default function OnboardingPage() {
  const router = useRouter();
  const { isAuthenticated, user, updateProfile } = useUserStore();
  const { addNotification } = useUIStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    nickname: '',
    dream: '',
    values: [],
    skills: [],
    affiliation: '',
    profileImage: null
  });

  // 認証チェック
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleValuesToggle = (value) => {
    setFormData(prev => ({
      ...prev,
      values: prev.values.includes(value)
        ? prev.values.filter(v => v !== value)
        : [...prev.values, value]
    }));
  };

  const handleSkillsToggle = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    try {
      await updateProfile(formData);
      addNotification({
        type: 'success',
        message: 'プロフィール設定が完了しました！'
      });
      router.push('/quest');
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'プロフィール設定に失敗しました'
      });
    }
  };

  const predefinedValues = [
    '成長', '学習', '挑戦', '協力', '創造',
    '誠実', '責任', '革新', '品質', '効率'
  ];

  const predefinedSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript',
    'データ分析', 'デザイン', 'マネジメント', 'マーケティング', 'セールス'
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-2xl">
        {/* プログレスバー */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">
              ステップ {currentStep} / 3
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / 3) * 100)}% 完了
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* ステップ1: 基本情報 */}
        {currentStep === 1 && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                👋 ようこそ、Team Xへ！
              </h2>
              <p className="text-gray-600">
                まずは基本的な情報を教えてください
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ニックネーム <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.nickname}
                  onChange={(e) => handleInputChange('nickname', e.target.value)}
                  placeholder="みらいちゃん"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  所属・職業
                </label>
                <Input
                  type="text"
                  value={formData.affiliation}
                  onChange={(e) => handleInputChange('affiliation', e.target.value)}
                  placeholder="株式会社○○ / 大学生 / フリーランス など"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  あなたの夢・目標 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.dream}
                  onChange={(e) => handleInputChange('dream', e.target.value)}
                  placeholder="将来エンジニアとして働きたい、起業したい、新しいスキルを身につけたい など"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <Button
                onClick={handleNext}
                disabled={!formData.nickname || !formData.dream}
              >
                次へ
              </Button>
            </div>
          </div>
        )}

        {/* ステップ2: 価値観・興味 */}
        {currentStep === 2 && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                💡 あなたの価値観を教えてください
              </h2>
              <p className="text-gray-600">
                大切にしている価値観を選んでください（複数選択可）
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  価値観・信念
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {predefinedValues.map((value) => (
                    <button
                      key={value}
                      onClick={() => handleValuesToggle(value)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                        formData.values.includes(value)
                          ? 'bg-blue-100 border-blue-300 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={handlePrevious}>
                戻る
              </Button>
              <Button onClick={handleNext}>
                次へ
              </Button>
            </div>
          </div>
        )}

        {/* ステップ3: スキル・経験 */}
        {currentStep === 3 && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                🚀 あなたのスキルを教えてください
              </h2>
              <p className="text-gray-600">
                現在持っているスキルや学びたい分野を選んでください
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  スキル・興味分野
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {predefinedSkills.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => handleSkillsToggle(skill)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                        formData.skills.includes(skill)
                          ? 'bg-purple-100 border-purple-300 text-purple-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* 設定確認 */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">設定内容の確認</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">ニックネーム:</span> {formData.nickname}</div>
                  <div><span className="font-medium">夢・目標:</span> {formData.dream}</div>
                  {formData.affiliation && (
                    <div><span className="font-medium">所属:</span> {formData.affiliation}</div>
                  )}
                  {formData.values.length > 0 && (
                    <div><span className="font-medium">価値観:</span> {formData.values.join(', ')}</div>
                  )}
                  {formData.skills.length > 0 && (
                    <div><span className="font-medium">スキル:</span> {formData.skills.join(', ')}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={handlePrevious}>
                戻る
              </Button>
              <Button onClick={handleComplete}>
                設定完了
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}