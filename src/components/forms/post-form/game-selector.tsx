'use client';

import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Search } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Game } from '@/types/post.types';

export function GameSelector() {
  const { register, setValue, watch } = useFormContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Game[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const gameId = watch('gameId');
  const supabase = createClient();

  // 初期選択ゲームの取得
  useEffect(() => {
    if (gameId && !selectedGame) {
      fetchGameById(gameId);
    }
  }, [gameId]);

  const fetchGameById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setSelectedGame(data);
      }
    } catch (error) {
      console.error('ゲーム取得エラー:', error);
    }
  };

  // 検索処理
  useEffect(() => {
    const fetchGames = async () => {
      if (searchTerm.trim() === '') {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .ilike('title', `%${searchTerm}%`)
          .order('title')
          .limit(10);

        if (error) throw error;
        setSearchResults(data || []);
      } catch (error) {
        console.error('ゲーム検索エラー:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchGames();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, supabase]);

  // ゲーム選択処理
  const handleSelectGame = (game: Game) => {
    setSelectedGame(game);
    setValue('gameId', game.id);
    setSearchTerm('');
    setShowResults(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          onBlur={() => {
            // 少し遅延させて、選択処理が完了した後に結果を非表示にする
            setTimeout(() => setShowResults(false), 200);
          }}
          placeholder="ゲームを検索..."
          className="input w-full pl-10"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          <Search size={18} />
        </div>
      </div>

      {/* 隠しフィールド */}
      <input type="hidden" {...register('gameId')} />

      {/* 選択中のゲーム */}
      {selectedGame && (
        <div className="mt-2 flex items-center rounded-md border border-gray-200 bg-gray-50 p-2">
          <div className="mr-3 h-10 w-10 flex-shrink-0 overflow-hidden rounded bg-gray-200">
            {selectedGame.image_url ? (
              <img 
                src={selectedGame.image_url} 
                alt={selectedGame.title} 
                className="h-full w-full object-cover" 
              />
            ) : (
              <div className="h-full w-full bg-gray-300 flex items-center justify-center text-xs text-gray-600">
                画像なし
              </div>
            )}
          </div>
          <div>
            <p className="font-medium">{selectedGame.title}</p>
            <p className="text-xs text-gray-500">{selectedGame.platform}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedGame(null);
              setValue('gameId', '');
              setSearchTerm('');
            }}
            className="ml-auto text-sm text-gray-500 hover:text-red-500"
          >
            ×
          </button>
        </div>
      )}

      {/* 検索結果 */}
      {showResults && searchTerm && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
          {isLoading ? (
            <div className="p-3 text-center text-gray-500">検索中...</div>
          ) : searchResults.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {searchResults.map((game) => (
                <li
                  key={game.id}
                  onMouseDown={() => handleSelectGame(game)} // onMouseDownを使用して、onBlurより先に実行されるようにする
                  className="flex cursor-pointer items-center p-3 hover:bg-gray-50"
                >
                  <div className="mr-3 h-10 w-10 flex-shrink-0 overflow-hidden rounded bg-gray-200">
                    {game.image_url ? (
                      <img 
                        src={game.image_url} 
                        alt={game.title} 
                        className="h-full w-full object-cover" 
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-300 flex items-center justify-center text-xs text-gray-600">
                        画像なし
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{game.title}</p>
                    <p className="text-xs text-gray-500">{game.platform}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-3 text-center text-gray-500">
              検索結果がありません
              <div className="mt-1 text-xs">
                見つからない場合は、別の検索キーワードをお試しください
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}