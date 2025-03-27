import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    // SSRの場合は、windowが存在しない
    if (typeof window === 'undefined') return;
    
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = () => setMatches(media.matches);
    
    // addEventListenerの引数は環境によって異なる
    // 新しい環境ではmatchMedia.addEventListener('change', listener)
    // 古い環境ではmatchMedia.addListener(listener)
    if (media.addEventListener) {
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    } else {
      // 古いブラウザ用
      media.addListener(listener);
      return () => media.removeListener(listener);
    }
  }, [matches, query]);

  return matches;
}

// よく使われるブレークポイントのためのフック
export function useIsMobile() {
  return useMediaQuery('(max-width: 639px)');
}

export function useIsTablet() {
  return useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
}

export function useIsDesktop() {
  return useMediaQuery('(min-width: 1024px)');
}