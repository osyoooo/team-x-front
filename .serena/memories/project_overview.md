# Team X Frontend Project Overview

## Purpose
Team X フロントエンドアプリケーション - Next.js 15ベースのReactアプリケーション

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19.1.0
- **Styling**: Tailwind CSS v4 with PostCSS
- **Language**: JavaScript (ES modules)
- **Linting**: ESLint with Next.js config
- **Fonts**: Geist Sans & Geist Mono (Next.js Google Fonts)

## Project Structure
```
src/
├── app/                 # Next.js App Router directory
│   ├── layout.js       # Root layout with fonts and global styles
│   ├── page.js         # Homepage component
│   ├── globals.css     # Global styles with Tailwind imports
│   └── favicon.ico     # Site favicon
public/                  # Static assets (SVG icons)
```

## Key Configurations
- **Path Aliases**: `@/*` maps to `./src/*` (jsconfig.json)
- **Font Setup**: Geist Sans and Geist Mono via Next.js Google Fonts
- **Dark Mode**: CSS custom properties with prefers-color-scheme
- **Styling**: Tailwind CSS v4 with `@theme inline` directive

## Development Environment
- Platform: macOS (Darwin)
- Package Manager: npm
- Node.js with ES modules support