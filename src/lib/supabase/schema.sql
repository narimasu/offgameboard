-- ユーザーテーブル
CREATE TABLE users (
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

-- ゲームテーブル
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  platform TEXT NOT NULL,
  image_url TEXT,
  category TEXT,
  release_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ユーザーゲーム関連テーブル
CREATE TABLE user_games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  skill_level INTEGER CHECK (skill_level BETWEEN 1 AND 5),
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, game_id)
);

-- 投稿テーブル
CREATE TABLE posts (
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

-- 応募テーブル
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- 評価テーブル
CREATE TABLE ratings (
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

-- メッセージスレッドテーブル
CREATE TABLE message_threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- メッセージスレッドメンバーテーブル
CREATE TABLE thread_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID REFERENCES message_threads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(thread_id, user_id)
);

-- メッセージテーブル
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID REFERENCES message_threads(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 通報テーブル
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reported_id UUID REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ブロックテーブル
CREATE TABLE blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blocker_id UUID REFERENCES users(id) ON DELETE CASCADE,
  blocked_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(blocker_id, blocked_id)
);

-- サンプルゲームデータ
INSERT INTO games (title, platform, image_url, category, release_year) VALUES
('モンスターハンター4', '3DS', '/images/game-covers/mh4.jpg', 'アクション', 2013),
('ポケットモンスター ハートゴールド', 'DS', '/images/game-covers/pokemon-hg.jpg', 'RPG', 2009),
('スプラトゥーン2', 'Switch', '/images/game-covers/splatoon2.jpg', 'シューティング', 2017),
('マリオカート8 デラックス', 'Switch', '/images/game-covers/mk8.jpg', 'レース', 2017),
('ドラゴンクエストIX 星空の守り人', 'DS', '/images/game-covers/dq9.jpg', 'RPG', 2009);

-- RLS (Row Level Security) の設定
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

-- RLSポリシー: ユーザー
CREATE POLICY "Users are viewable by everyone" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- RLSポリシー: ゲーム
CREATE POLICY "Games are viewable by everyone" ON games
  FOR SELECT USING (true);

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