import './globals.css';
import type { Metadata } from 'next';
import { inter } from './fonts';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: 'offgameboard - オフラインゲームマッチングサービス',
  description: 'WiFiサービスが終了したゲーム（モンハン、ポケモンなど）のファンが、オフラインで対戦や協力プレイをするための約束を取り交わせる掲示板サービス',
  // favicon、manifest、OGPなどのメタデータ
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  // X-Content-Type-Options
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'offgameboard - オフラインゲームマッチングサービス',
    description: 'WiFiサービスが終了したゲーム（モンハン、ポケモンなど）のファンが、オフラインで対戦や協力プレイをするための約束を取り交わせる掲示板サービス',
    type: 'website',
    locale: 'ja_JP',
    url: process.env.NEXT_PUBLIC_BASE_URL,
  },
  // クローラー設定
  robots: {
    index: true,
    follow: true,
  },
  // PWA関連（オプショナル）
  manifest: '/manifest.json',
  // その他のメタタグ
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#6366f1', // プライマリカラー
};

// CSP ヘッダーを追加（これはNext.config.jsでも設定可能）
export function generateCsp() {
  // CSPディレクティブを配列で定義
  const csp = [
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
  ];

  return csp.join('; ');
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // nonce値を生成 (CSPで使用)
  const nonce = headers().get('x-nonce') || '';

  return (
    <html lang="ja" className={inter.className}>
      <head>
        {/* CSPを直接メタタグとして追加する方法もあります */}
        {/* <meta httpEquiv="Content-Security-Policy" content={generateCsp()} /> */}
      </head>
      <body>
        {children}
        {/* フィッシング詐欺防止のため、ユーザーに連絡方法を明確に通知 */}
        <div hidden id="security-contact-info" aria-hidden="true">
          当サイトからの重要な連絡はすべて登録メールアドレスに送信されます。
          個人情報やパスワードを求めるリンクには注意してください。
          問題がある場合は support@offgameboard.example.com にご連絡ください。
        </div>
      </body>
    </html>
  );
}