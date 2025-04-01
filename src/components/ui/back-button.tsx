'use client';

import { useRouter } from 'next/navigation';

interface BackButtonProps {
  className?: string;
}

export function BackButton({ className }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <button
      onClick={handleBack}
      className={`text-gray-500 hover:text-gray-700 ${className || ''}`}
    >
      ← 戻る
    </button>
  );
}