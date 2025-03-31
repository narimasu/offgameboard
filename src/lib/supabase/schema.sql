-- ユーザープロフィールテーブル (既に存在する場合はスキップ)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  prefecture TEXT,
  city TEXT,
  trust_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ゲームテーブル (既に存在する場合はスキップ)
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  platform TEXT NOT NULL,
  image_url TEXT,
  category TEXT,
  release_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ユーザーゲーム関連テーブル (既に存在する場合はスキップ)
CREATE TABLE IF NOT EXISTS user_games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  skill_level INTEGER CHECK (skill_level BETWEEN 1 AND 5),
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, game_id)
);

-- 投稿テーブル (既に存在する場合はスキップ)
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  play_type TEXT NOT NULL CHECK (play_type IN ('battle', 'coop', 'trade', 'other')),
  meeting_date DATE NOT NULL,
  meeting_time TIME NOT NULL,
  location_type TEXT NOT NULL CHECK (location_type IN ('address', 'station')),
  prefecture TEXT,
  city TEXT,
  railway TEXT,
  station TEXT,
  participant_limit INTEGER NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'canceled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (
    (location_type = 'address' AND prefecture IS NOT NULL AND city IS NOT NULL) OR
    (location_type = 'station' AND railway IS NOT NULL AND station IS NOT NULL)
  )
);

-- 応募テーブル (既に存在する場合はスキップ)
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- 評価テーブル (既に存在する場合はスキップ)
CREATE TABLE IF NOT EXISTS ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reviewee_id UUID REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  punctuality_score INTEGER CHECK (punctuality_score BETWEEN 1 AND 5),
  manner_score INTEGER CHECK (manner_score BETWEEN 1 AND 5),
  skill_score INTEGER CHECK (skill_score BETWEEN 1 AND 5),
  communication_score INTEGER CHECK (communication_score BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(reviewer_id, reviewee_id, post_id)
);

-- メッセージスレッドテーブル (既に存在する場合はスキップ)
CREATE TABLE IF NOT EXISTS message_threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- メッセージスレッドメンバーテーブル (既に存在する場合はスキップ)
CREATE TABLE IF NOT EXISTS thread_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID REFERENCES message_threads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(thread_id, user_id)
);

-- メッセージテーブル (既に存在する場合はスキップ)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID REFERENCES message_threads(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 通報テーブル (既に存在する場合はスキップ)
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reported_id UUID REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ブロックテーブル (既に存在する場合はスキップ)
CREATE TABLE IF NOT EXISTS blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blocker_id UUID REFERENCES users(id) ON DELETE CASCADE,
  blocked_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(blocker_id, blocked_id)
);

-- サンプルゲームデータ（重複しないように条件付き挿入）
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM games WHERE title = 'モンスターハンター4') THEN
    INSERT INTO games (title, platform, image_url, category, release_year) VALUES
    ('モンスターハンター4', '3DS', '/images/game-covers/mh4.jpg', 'アクション', 2013);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM games WHERE title = 'ポケットモンスター ハートゴールド') THEN
    INSERT INTO games (title, platform, image_url, category, release_year) VALUES
    ('ポケットモンスター ハートゴールド', 'DS', '/images/game-covers/pokemon-hg.jpg', 'RPG', 2009);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM games WHERE title = 'スプラトゥーン2') THEN
    INSERT INTO games (title, platform, image_url, category, release_year) VALUES
    ('スプラトゥーン2', 'Switch', '/images/game-covers/splatoon2.jpg', 'シューティング', 2017);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM games WHERE title = 'マリオカート8 デラックス') THEN
    INSERT INTO games (title, platform, image_url, category, release_year) VALUES
    ('マリオカート8 デラックス', 'Switch', '/images/game-covers/mk8.jpg', 'レース', 2017);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM games WHERE title = 'ドラゴンクエストIX 星空の守り人') THEN
    INSERT INTO games (title, platform, image_url, category, release_year) VALUES
    ('ドラゴンクエストIX 星空の守り人', 'DS', '/images/game-covers/dq9.jpg', 'RPG', 2009);
  END IF;
END
$$;

-- RLS (Row Level Security) の設定（既に有効化されている場合もエラーにならない）
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE thread_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;

-- RLSポリシー（既存のポリシーをドロップしてから作成）
DO $$
BEGIN
    -- users テーブルのポリシー
    DROP POLICY IF EXISTS "Users are viewable by everyone" ON users;
    DROP POLICY IF EXISTS "Users can update own profile" ON users;
    DROP POLICY IF EXISTS "Users can insert their own profile" ON users;

    -- games テーブルのポリシー
    DROP POLICY IF EXISTS "Games are viewable by everyone" ON games;
    DROP POLICY IF EXISTS "Authenticated users can insert games" ON games;

    -- posts テーブルのポリシー
    DROP POLICY IF EXISTS "Posts are viewable by everyone" ON posts;
    DROP POLICY IF EXISTS "Users can create posts" ON posts;
    DROP POLICY IF EXISTS "Users can update own posts" ON posts;
    DROP POLICY IF EXISTS "Users can delete own posts" ON posts;

    -- applications テーブルのポリシー
    DROP POLICY IF EXISTS "Applications are viewable by post creator and applicant" ON applications;
    DROP POLICY IF EXISTS "Users can apply to posts" ON applications;
    DROP POLICY IF EXISTS "Users can update own applications" ON applications;
    DROP POLICY IF EXISTS "Post creators can update applications" ON applications;
END
$$;

-- RLSポリシー: ユーザー
CREATE POLICY "Users are viewable by everyone" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- 追加: ユーザーが自分自身のプロフィールを作成できるポリシー (修正済み)
CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLSポリシー: ゲーム
CREATE POLICY "Games are viewable by everyone" ON games
  FOR SELECT USING (true);

-- 追加: 認証されたユーザーはゲームを追加できる (修正済み)
CREATE POLICY "Authenticated users can insert games" ON games
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- RLSポリシー: 投稿
CREATE POLICY "Posts are viewable by everyone" ON posts
  FOR SELECT USING (true);

CREATE POLICY "Users can create posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts" ON posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts" ON posts
  FOR DELETE USING (auth.uid() = user_id);

-- RLSポリシー: 応募
CREATE POLICY "Applications are viewable by post creator and applicant" ON applications
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM posts WHERE id = post_id
      UNION
      SELECT user_id FROM applications WHERE id = id
    )
  );

CREATE POLICY "Users can apply to posts" ON applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications" ON applications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Post creators can update applications" ON applications
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM posts WHERE id = post_id
    )
  );