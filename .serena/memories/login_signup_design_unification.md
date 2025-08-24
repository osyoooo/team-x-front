# Login/Signup ページデザイン統一

## 概要
LoginページとSignupページのデザインフォーマットを統一し、一貫性のあるUI/UXを実現。

## 実装内容

### 共通コンポーネントの活用
- **TopNavigation**: ヘッダー部分の統一
- **SocialButton**: Apple/Googleソーシャルログインボタンの統一
- **UnderlineInput**: 入力フィールドの統一（アンダーラインスタイル）

### レイアウト統一
- **モバイルファースト設計**: `max-w-[393px] sm:max-w-md md:max-w-lg mx-auto`
- **コンテナ構造**: `min-h-screen bg-white` → `max-w-[393px]` コンテナ → `px-5 sm:px-6 pt-10` メインコンテンツ
- **統一されたスペーシング**: `space-y-4 mb-8`（ソーシャルボタン）、`space-y-12`（フォーム）

### ボタンスタイル統一
```javascript
// 主要アクションボタン（ログイン/はじめる）
className="w-full h-14 rounded-full bg-black text-white text-xs font-normal hover:opacity-80"

// セカンダリアクションボタン（新規登録/ログイン）
className="w-full h-14 rounded-full bg-white text-black text-xs font-normal border border-black hover:opacity-80"

// 無効状態
className="bg-[#E5E5E5] text-white cursor-not-allowed"
```

### React Hooks最適化
- 条件付きフック呼び出しの修正
- `useUIStore((state) => state.loading.auth)` を `isLoading` 変数に抽出

## ファイル構成

### 修正されたファイル
- `src/app/(auth)/login/page.js`
- `src/app/(auth)/signup/page.js`

### 使用される共通コンポーネント
- `src/components/shared/TopNavigation.js`
- `src/components/ui/SocialButton.js` 
- `src/components/ui/UnderlineInput.js`

## デザイン仕様

### カラーパレット
- プライマリ: `#000000` (黒)
- セカンダリ: `#FFFFFF` (白)
- ボーダー: `#CCCCCC`, `#E5E5E5`
- 無効状態: `#E5E5E5`

### タイポグラフィ
- タイトル: `text-xl font-bold text-black`
- サブタイトル: `text-xs text-black`
- ボタンテキスト: `text-xs font-normal`

### レスポンシブ対応
- モバイル: 393px 固定幅
- タブレット以上: `sm:max-w-md md:max-w-lg` で段階的拡大

## 効果
- **UI/UX統一**: 両ページで一貫した体験
- **保守性向上**: 共通コンポーネントによるDRY原則
- **モバイルファースト**: スマートフォン利用を想定した最適化
- **アクセシビリティ**: 統一された操作感とフォーカス管理