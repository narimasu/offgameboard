import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// シンプルなメモリベースのレートリミッター
// 本番環境では Redis などを使用することを推奨
// これはあくまで簡易的な実装です
interface RequestData {
  count: number;
  timestamp: number;
}

// IPアドレスごとのリクエスト数を追跡
const ipRequests: Record<string, RequestData> = {}

// 定期的に古いデータをクリーンアップするためのタイマー設定
// 本番環境ではもっと洗練された方法を使用してください
if (typeof global !== 'undefined') {
  const CLEANUP_INTERVAL = 60 * 60 * 1000; // 1時間ごとにクリーンアップ
  
  // クリーンアップ関数
  function cleanupOldEntries() {
    const now = Date.now();
    const TIME_WINDOW = 60 * 60 * 1000; // 1時間以上古いエントリを削除
    
    Object.keys(ipRequests).forEach(ip => {
      if (now - ipRequests[ip].timestamp > TIME_WINDOW) {
        delete ipRequests[ip];
      }
    });
  }
  
  // グローバル変数がすでに設定されていない場合のみタイマーを設定
  if (!(global as any).cleanupTimer) {
    (global as any).cleanupTimer = setInterval(cleanupOldEntries, CLEANUP_INTERVAL);
  }
}

/**
 * APIレートリミッター関数
 * @param req NextRequest オブジェクト
 * @param limit 時間枠内の最大リクエスト数 (デフォルト: 10)
 * @param timeWindow ミリ秒単位の時間枠 (デフォルト: 60000 = 1分)
 * @returns リミット超過時はNextResponseオブジェクト、それ以外はnull
 */
export function rateLimiter(req: NextRequest, limit = 10, timeWindow = 60000) {
  // IPアドレスの取得 (X-Forwarded-For ヘッダーまたはリモートアドレス)
  const forwardedFor = req.headers.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : req.ip || 'unknown';
  
  const now = Date.now();
  
  // 初めてのリクエストまたは時間枠を超えた場合は新しいエントリを作成
  if (!ipRequests[ip] || now - ipRequests[ip].timestamp > timeWindow) {
    ipRequests[ip] = { count: 1, timestamp: now };
    return null; // リミットに達していない
  }
  
  // 時間枠内の場合はカウントを増加
  ipRequests[ip].count++;
  
  // リミット超過をチェック
  if (ipRequests[ip].count > limit) {
    // Retry-After ヘッダーで再試行可能な時間を指示
    const retryAfter = Math.ceil((timeWindow - (now - ipRequests[ip].timestamp)) / 1000);
    
    return NextResponse.json(
      { 
        error: 'Too Many Requests', 
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter 
      },
      { 
        status: 429,
        headers: {
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': Math.ceil((ipRequests[ip].timestamp + timeWindow) / 1000).toString()
        }
      }
    );
  }
  
  return null; // リミットに達していない
}

/**
 * APIルートでレートリミットを適用するヘルパー関数
 * @param handler APIルートハンドラー関数
 * @param limit 制限数
 * @param timeWindow 時間枠 (ミリ秒)
 */
export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse> | NextResponse,
  limit = 10,
  timeWindow = 60000
) {
  return async function(req: NextRequest) {
    // レートリミットチェック
    const limitResponse = rateLimiter(req, limit, timeWindow);
    if (limitResponse) {
      return limitResponse;
    }
    
    // リミットに達していない場合は通常の処理を実行
    return handler(req);
  };
}