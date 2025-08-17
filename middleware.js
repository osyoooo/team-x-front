import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // 認証が不要なパス
  const publicPaths = ['/login', '/signup', '/forgot-password'];
  const isPublicPath = publicPaths.includes(pathname);
  
  // API routes are handled separately
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  // トークンの有無をチェック（簡易的な実装）
  const token = request.cookies.get('auth-token')?.value;
  
  // ログインしていない場合
  if (!token && !isPublicPath && pathname !== '/') {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  // ログインしているのに認証ページにアクセスしようとした場合
  if (token && isPublicPath) {
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};