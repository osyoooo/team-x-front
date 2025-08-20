# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 【MUST GLOBAL】Gemini活用（プロジェクトのCLAUDE.mdより優先）

### 三位一体の開発原則
人間の**意思決定**、Claude Codeの**分析と実行**、Gemini MCPの**検証と助言**を組み合わせ、開発の質と速度を最大化する：
- **人間 (ユーザー)**：プロジェクトの目的・要件・最終ゴールを定義し、最終的な意思決定を行う**意思決定者**
  - 反面、具体的なコーディングや詳細な計画を立てる力、タスク管理能力ははありません。
- **Claude Code**：高度なタスク分解・高品質な実装・リファクタリング・ファイル操作・タスク管理を担う**実行者**
  - 指示に対して忠実に、順序立てて実行する能力はありますが、意志がなく、思い込みは勘違いも多く、思考力は少し劣ります。
- **Gemini MCP**：API・ライブラリ・エラー解析など**コードレベル**の技術調査・Web検索 (Google検索) による最新情報へのアクセスを行う**コード専門家**
  - ミクロな視点でのコード品質・実装方法・デバッグに優れますが、アーキテクチャ全体の設計判断は専門外です。

### 壁打ち先の自動判定ルール
- **ユーザーの要求を受けたら即座に壁打ち**を必ず実施
- 壁打ち結果は鵜呑みにしすぎず、1意見として判断
- 結果を元に聞き方を変えて多角的な意見を抽出するのも効果的

### 主要な活用場面
1. **実現不可能な依頼**: Claude Code では実現できない要求への対処 (例: `最新のニュース記事を取得して`)
2. **前提確認**: 要求の理解や実装方針の妥当性を確認 (例: `この実装方針で要件を満たせるか確認して`)
3. **技術調査**: 最新情報・エラー解決・ドキュメント検索 (例: `Rails 7.2の新機能を調べて`)
4. **設計立案**: 新機能の設計・アーキテクチャ構築 (例: `認証システムの設計案を作成して`)
5. **問題解決**: エラーや不具合の原因究明と対処 (例: `このTypeScriptエラーの解決方法を教えて`)
6. **コードレビュー**: 品質・保守性・パフォーマンスの評価 (例: `このコードの改善点は？`)
7. **計画立案**: タスク分解・実装方針の策定 (例: `ユーザー認証機能を実装するための計画を立てて`)
8. **技術選定**: ライブラリ・フレームワークの比較検討 (例: `状態管理にReduxとZustandどちらが適切か？`)
9. **リスク評価**: 実装前の潜在的問題の洗い出し (例: `この実装のセキュリティリスクは？`)
10. **設計検証**: 既存設計の妥当性確認・改善提案 (例: `現在のAPI設計の問題点と改善案は？`)


## Project Overview

This is a Next.js 15 frontend application for Team X, using React 19 with Tailwind CSS v4 for styling. The project follows the Next.js App Router architecture and is configured with modern JavaScript (ES modules).

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint with Next.js config

## Development Rules

**Mobile-First Development:**
- すべてのUI/UXはスマートフォン表示を基準として設計・実装する
- Tailwind CSS の mobile-first ブレークポイント（`sm:`, `md:`, `lg:`, `xl:`）を活用
- デスクトップ向けスタイルは段階的にエンハンスメントとして追加
- 開発・テスト時はモバイルビューを優先的に確認
- レスポンシブデザインの実装順序: Mobile → Tablet → Desktop
- タッチ操作を前提としたインタラクションデザイン
- モバイル向けのパフォーマンス最適化を常に考慮

## Architecture

**Framework Stack:**
- Next.js 15 with App Router (`src/app/` directory structure)
- React 19 for components
- Tailwind CSS v4 with PostCSS integration
- ESLint with Next.js core web vitals config

**Project Structure:**
- `src/app/` - Next.js App Router pages and layouts
- `src/app/layout.js` - Root layout with Geist fonts and global styles
- `src/app/page.js` - Homepage component
- `src/app/globals.css` - Global styles with Tailwind imports and CSS custom properties
- `public/` - Static assets (SVG icons)

**Key Configurations:**
- Path aliases: `@/*` maps to `./src/*` (configured in jsconfig.json)
- Font setup: Uses Next.js Google Fonts with Geist Sans and Geist Mono
- Styling: CSS custom properties for theming with dark mode support
- Build: Standard Next.js build process with no custom webpack config

**Styling Architecture:**
- Tailwind CSS v4 with `@theme inline` directive for custom properties
- CSS custom properties for colors (`--background`, `--foreground`)
- Responsive design with mobile-first approach
- Dark mode support via `prefers-color-scheme`


## Figma 統合

- **Figma FCP**  
  Figma FCP を使ってデザイン、コンポーネント、レイアウトをインポートする際は、常に URL データを SVG として参照し、必要に応じて SVG 形式でダウンロードしてください。

- **デザインインポートプロセス**  
  - SVG 形式を用いて Figma のデザインおよびコンポーネント構造を読み込む  
  - レイアウト構成、ワイヤーフレーム、デザイン仕様を SVG としてインポートする  
  - Web 実装向けに Figma のデザイン要素を SVG に変換する

- **アセットストレージ**  
  ダウンロードした SVG アセットは、既存のプロジェクト構造に従った適切なディレクトリに格納してください（ダウンロードが必要な場合）。

- **実装**  
  Figma 由来のビジュアル要素、アイコン、デザインコンポーネントにはすべて SVG 形式を使用してください。