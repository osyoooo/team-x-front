# Code Style and Conventions

## Code Structure
- **File Extensions**: `.js` for React components and configuration
- **Export Style**: Default exports for React components
- **Import Style**: ES6 imports with destructuring where appropriate

## React Conventions
- **Components**: Functional components using arrow function or function declaration
- **Naming**: PascalCase for components (e.g., `RootLayout`, `Home`)
- **Props**: Destructured in function parameters
- **JSX**: Proper indentation and readable formatting

## CSS/Styling Conventions
- **Tailwind CSS**: Utility-first approach with v4 syntax
- **Custom Properties**: CSS variables for theming (`--background`, `--foreground`)
- **Dark Mode**: Uses `prefers-color-scheme` media query
- **Class Names**: Tailwind utility classes with proper spacing

## File Organization
- **App Router**: All pages in `src/app/` directory
- **Layouts**: Root layout defines overall structure
- **Global Styles**: Centralized in `src/app/globals.css`
- **Static Assets**: SVG icons in `public/` directory

## Configuration Standards
- **ESLint**: Next.js core web vitals configuration
- **Path Aliases**: Use `@/` for src imports
- **Fonts**: Next.js Google Fonts integration

## HTML/Accessibility
- **Language**: `lang="en"` on html element
- **Hydration**: `suppressHydrationWarning={true}` for SSR compatibility
- **Semantic Elements**: Use proper HTML semantics (main, footer, etc.)