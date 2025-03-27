import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ResponsiveContainer } from '@/components/layout/responsive-container';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="bg-indigo-50 py-16 sm:py-24">
          <ResponsiveContainer>
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                オフラインでゲームを一緒に遊ぶ仲間を見つけよう
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                offgameboardは、WiFiサービスが終了したゲーム（モンハン、ポケモンなど）のファンのための
                マッチングサービスです。オフラインで対戦や協力プレイをしたい仲間を見つけましょう。
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <Link href="/signup">
                  <Button size="lg" className="bg-primary-500 hover:bg-primary-600">
                    無料で始める
                  </Button>
                </Link>
                <Link href="/about" className="text-sm font-semibold leading-6 text-gray-900">
                  詳しく見る <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </ResponsiveContainer>
        </section>

        <section className="py-16 sm:py-24">
          <ResponsiveContainer>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              人気のゲーム
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {/* ゲームカード */}
              <div className="rounded-lg border bg-white p-4 shadow">
                <div className="relative h-40 bg-gray-200">
                  <Image 
                    src="/images/game-covers/mh4.jpg" 
                    alt="モンスターハンター4" 
                    fill 
                    className="object-cover rounded"
                  />
                </div>
                <h3 className="mt-4 text-lg font-semibold">モンスターハンター4</h3>
                <p className="text-sm text-gray-500">3DS</p>
                <p className="mt-2 text-sm">現在の募集: 12件</p>
              </div>
              <div className="rounded-lg border bg-white p-4 shadow">
                <div className="relative h-40 bg-gray-200">
                  <Image 
                    src="/images/game-covers/pokemon-hg.jpg" 
                    alt="ポケットモンスター ハートゴールド" 
                    fill 
                    className="object-cover rounded"
                  />
                </div>
                <h3 className="mt-4 text-lg font-semibold">ポケモン ハートゴールド</h3>
                <p className="text-sm text-gray-500">DS</p>
                <p className="mt-2 text-sm">現在の募集: 8件</p>
              </div>
              <div className="rounded-lg border bg-white p-4 shadow">
                <div className="relative h-40 bg-gray-200">
                  <Image 
                    src="/images/game-covers/splatoon2.jpg" 
                    alt="スプラトゥーン2" 
                    fill 
                    className="object-cover rounded"
                  />
                </div>
                <h3 className="mt-4 text-lg font-semibold">スプラトゥーン2</h3>
                <p className="text-sm text-gray-500">Switch</p>
                <p className="mt-2 text-sm">現在の募集: 15件</p>
              </div>
              <div className="rounded-lg border bg-white p-4 shadow">
                <div className="relative h-40 bg-gray-200">
                  <div className="h-full w-full bg-gray-300 flex items-center justify-center text-gray-500">
                    画像準備中
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-semibold">マリオカート8 デラックス</h3>
                <p className="text-sm text-gray-500">Switch</p>
                <p className="mt-2 text-sm">現在の募集: 10件</p>
              </div>
            </div>
          </ResponsiveContainer>
        </section>

        <section className="bg-indigo-50 py-16 sm:py-24">
          <ResponsiveContainer>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              offgameboardの特徴
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="text-xl font-semibold">安心の評価システム</h3>
                <p className="mt-2 text-gray-600">
                  ユーザー同士の相互評価により、信頼できる相手と出会えます。
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="text-xl font-semibold">豊富なゲーム対応</h3>
                <p className="mt-2 text-gray-600">
                  モンハン、ポケモンなど多数のオフラインゲームに対応しています。
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="text-xl font-semibold">簡単マッチング</h3>
                <p className="mt-2 text-gray-600">
                  地域や駅から簡単に近くのプレイヤーを見つけることができます。
                </p>
              </div>
            </div>
          </ResponsiveContainer>
        </section>
      </main>

      <Footer />
    </div>
  );
}