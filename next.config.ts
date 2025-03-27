/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'localhost',
      process.env.NEXT_PUBLIC_SUPABASE_URL 
        ? process.env.NEXT_PUBLIC_SUPABASE_URL.replace('https://', '').split('.')[0] + '.supabase.co'
        : '',
    ].filter(Boolean),
    // 画像サイズのセキュリティ制限
    minimumCacheTTL: 60,
    formats: ['image/webp'],
  },
  // セキュリティヘッダー設定
  async headers() {
    return [
      {
        // 全ルートに適用
        source: '/:path*',
        headers: [
          // CSP (Content-Security-Policy)
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Supabaseドメインとの通信を許可
              `connect-src 'self' ${process.env.NEXT_PUBLIC_SUPABASE_URL || ''} https://*.supabase.co`,
              // Vercelのアナリティクスを許可（必要に応じて）
              "connect-src 'self' vitals.vercel-insights.com",
              // スタイル設定
              "style-src 'self' 'unsafe-inline'",
              // インラインスクリプトは避けるべきだが、必要な場合は制限付きで許可
              "script-src 'self'",
              // フォントとイメージ
              "font-src 'self' data:",
              "img-src 'self' data: blob: https://*.supabase.co",
              "media-src 'self'",
              "object-src 'none'",
              // フレーム関連
              "frame-ancestors 'self'",
              "frame-src 'self'",
              // フォーム送信先の制限
              "form-action 'self'",
              // その他のセキュリティ強化オプション
              "base-uri 'self'",
              "manifest-src 'self'",
            ].join('; '),
          },
          // XSS Protection
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          // Content-Type オプション
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          // フレーム表示の制限
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          // Referrer Policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // Permissions Policy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
      {
        // APIルートに対するCORS設定
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: process.env.NEXT_PUBLIC_BASE_URL || '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
          { key: 'Access-Control-Max-Age', value: '86400' },
        ],
      },
    ]
  },
  // キャッシュ設定
  onDemandEntries: {
    // サーバーサイドでのページキャッシュ時間 (ms)
    maxInactiveAge: 25 * 1000,
    // 一度にキャッシュするページ数
    pagesBufferLength: 2,
  },
  // 本番環境でのエラーの詳細表示を防止
  productionBrowserSourceMaps: false,
}

module.exports = nextConfig