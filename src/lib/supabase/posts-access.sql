-- 投稿関連のRLSポリシーを修正・追加するSQL
-- 投稿データにアクセスできない問題を解決します

-- applications テーブルのポリシーを修正
-- 既存の問題のあるポリシーを削除
DROP POLICY IF EXISTS "Applications are viewable by post creator and applicant" ON applications;

-- 修正したポリシーを作成（認証済みユーザーがapplicationsをカウントできるようにする）
CREATE POLICY "Applications count is visible to everyone" ON applications
  FOR SELECT USING (true);

-- サーバーサイドからの投稿カウントを許可するポリシー
CREATE POLICY "Public can count applications" ON applications
  FOR SELECT
  USING (true);