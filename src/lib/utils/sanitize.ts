/**
 * テキスト文字列からHTMLタグを無効化する基本的なサニタイズ関数
 * XSS攻撃を防ぐために使用
 */
export function sanitizeText(text: string): string {
  if (!text) return '';
  
  // 基本的なHTMLエスケープ
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * オブジェクトのすべてのstring型プロパティに対してサニタイズを適用
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const result = { ...obj };
  
  Object.keys(result).forEach(key => {
    const value = result[key];
    
    if (typeof value === 'string') {
      result[key] = sanitizeText(value);
    } else if (typeof value === 'object' && value !== null) {
      result[key] = sanitizeObject(value);
    }
  });
  
  return result;
}

/**
 * URLが安全かチェックする（外部リンクのバリデーション用）
 */
export function isSafeUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    const safeProtocols = ['https:', 'http:', 'mailto:', 'tel:'];
    
    if (!safeProtocols.includes(parsedUrl.protocol)) {
      return false;
    }
    
    // javascript: URLなどを検出するための追加チェック
    if (url.toLowerCase().includes('javascript:')) {
      return false;
    }
    
    return true;
  } catch (error) {
    // URLのパースに失敗した場合は安全でないと判断
    return false;
  }
}

/**
 * ユーザー名が安全な文字のみを含むかチェック
 */
export function isValidUsername(username: string): boolean {
  // 英数字、アンダースコア、ハイフンのみを許可
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  return usernameRegex.test(username);
}