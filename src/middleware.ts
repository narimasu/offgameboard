import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // 認証が必要なパスに対するアクセスをチェック
  const protectedPaths = ['/profile', '/posts/new', '/messages']
  const isProtectedPath = protectedPaths.some(path => 
    req.nextUrl.pathname.startsWith(path)
  )

  // API経由のアクセス制限
  const isProtectedApi = req.nextUrl.pathname.startsWith('/api/') && 
    !req.nextUrl.pathname.startsWith('/api/public/') &&
    !req.nextUrl.pathname.startsWith('/api/auth/')

  if ((isProtectedPath || isProtectedApi) && !session) {
    // 認証がない場合はログインページにリダイレクト
    if (req.nextUrl.pathname.startsWith('/api/')) {
      // APIリクエストの場合は401エラーを返す
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    } else {
      // 通常のページアクセスの場合はログインページにリダイレクト
      const redirectUrl = new URL('/login', req.url)
      redirectUrl.searchParams.set('redirect', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return res
}

export const config = {
  matcher: [
    // 認証チェックが必要なページとAPIルート
    '/profile/:path*',
    '/posts/new/:path*', 
    '/messages/:path*',
    '/api/((?!public|auth).*)/:path*',
    // 静的なファイルやリソースは除外
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}