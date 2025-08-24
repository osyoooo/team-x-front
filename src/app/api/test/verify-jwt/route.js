import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request) {
  // 開発環境でのみ利用可能
  if (process.env.NODE_ENV !== 'development') {
    return new NextResponse('Not Found', { status: 404 });
  }

  try {
    // リクエストボディからトークンを取得
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'トークンが提供されていません',
          details: 'リクエストボディに token フィールドが必要です'
        }, 
        { status: 400 }
      );
    }

    // Supabaseクライアントを作成
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // 提供されたトークンを使用してユーザー情報を取得
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error) {
      return NextResponse.json({
        success: false,
        error: '無効なトークンです',
        details: error.message,
        errorCode: error.status || 'UNKNOWN',
        timestamp: new Date().toISOString()
      }, { status: 401 });
    }

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'ユーザーが見つかりません',
        details: 'トークンは有効ですが、対応するユーザーが存在しません',
        timestamp: new Date().toISOString()
      }, { status: 404 });
    }

    // JWTペイロードのデコード（参考情報として）
    let decodedPayload = null;
    try {
      const payloadBase64 = token.split('.')[1];
      decodedPayload = JSON.parse(atob(payloadBase64));
    } catch (decodeError) {
      console.warn('JWT payload decode failed:', decodeError.message);
    }

    // 成功レスポンス
    return NextResponse.json({
      success: true,
      message: 'トークンは有効です',
      data: {
        user: {
          id: user.id,
          email: user.email,
          email_confirmed_at: user.email_confirmed_at,
          phone: user.phone,
          created_at: user.created_at,
          updated_at: user.updated_at,
          user_metadata: user.user_metadata,
          app_metadata: user.app_metadata,
        },
        token_info: {
          expires_at: decodedPayload?.exp ? new Date(decodedPayload.exp * 1000).toISOString() : null,
          issued_at: decodedPayload?.iat ? new Date(decodedPayload.iat * 1000).toISOString() : null,
          issuer: decodedPayload?.iss,
          audience: decodedPayload?.aud,
          subject: decodedPayload?.sub,
          role: decodedPayload?.role,
          session_id: decodedPayload?.session_id,
        },
        raw_payload: decodedPayload,
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('JWT verification error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'サーバーエラーが発生しました',
      details: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// GETメソッドのサポート（トークンをクエリパラメータで受け取る場合）
export async function GET(request) {
  // 開発環境でのみ利用可能
  if (process.env.NODE_ENV !== 'development') {
    return new NextResponse('Not Found', { status: 404 });
  }

  return NextResponse.json({
    message: 'JWT Verification API',
    usage: 'POST /api/test/verify-jwt with { "token": "your_jwt_token" }',
    environment: 'development',
    available_methods: ['POST'],
    timestamp: new Date().toISOString()
  });
}