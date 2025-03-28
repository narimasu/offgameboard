import './globals.css';
import type { Metadata } from 'next';
import { inter } from './fonts';

export const metadata: Metadata = {
  title: 'offgameboard - オフラインゲームマッチングサービス',
  description: 'WiFiサービスが終了したゲーム（モンハン、ポケモンなど）のファンが、オフラインで対戦や協力プレイをするための約束を取り交わせる掲示板サービス',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'offgameboard - オフラインゲームマッチングサービス',
    description: 'WiFiサービスが終了したゲーム（モンハン、ポケモンなど）のファンが、オフラインで対戦や協力プレイをするための約束を取り交わせる掲示板サービス',
    type: 'website',
    locale: 'ja_JP',
    url: process.env.NEXT_PUBLIC_BASE_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
};

// viewportを別に定義
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#6366f1', // プライマリカラー
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={inter.className}>
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