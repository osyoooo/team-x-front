# Task Completion Checklist

## When completing any development task, always run:

### 1. Code Quality Check
```bash
npm run lint
```
- Fix all ESLint errors and warnings
- Ensure code follows Next.js core web vitals standards

### 2. Build Verification
```bash
npm run build
```
- Verify production build succeeds
- Check for build-time errors or warnings
- Ensure no TypeScript/JavaScript errors

### 3. Development Testing
```bash
npm run dev
```
- Test functionality in development mode
- Verify hot reload works correctly
- Check browser console for errors

### 4. File Organization Check
- Ensure files are in correct directories (`src/app/` for pages)
- Verify imports use path aliases (`@/` when appropriate)
- Check that static assets are in `public/`

### 5. Style Verification
- Confirm Tailwind classes are working
- Test dark mode functionality
- Verify responsive design on different screen sizes

### 6. Git Operations (if applicable)
- Stage and commit changes with meaningful messages
- Ensure no sensitive data is committed
- Check git status for untracked files

## Critical Notes
- **Always test build before considering task complete**
- **Never commit without running lint**
- **Verify functionality works in both light and dark modes**