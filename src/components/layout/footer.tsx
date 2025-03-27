import Link from 'next/link';
import { ResponsiveContainer } from './responsive-container';

export function Footer() {
  return (
    <footer className="bg-gray-900 py-12 text-white">
      <ResponsiveContainer>
        <div className="flex flex-col items-center justify-between sm:flex-row">
          <div>
            <h2 className="text-xl font-bold">offgameboard</h2>
            <p className="mt-2 text-sm text-gray-400">オフラインゲームマッチングサービス</p>
          </div>
          <div className="mt-6 flex gap-8 sm:mt-0">
            <Link href="/terms" className="text-sm text-gray-400 hover:text-white">
              利用規約
            </Link>
            <Link href="/privacy" className="text-sm text-gray-400 hover:text-white">
              プライバシーポリシー
            </Link>
            <Link href="/contact" className="text-sm text-gray-400 hover:text-white">
              お問い合わせ
            </Link>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} offgameboard. All rights reserved.
        </div>
      </ResponsiveContainer>
    </footer>
  );
}