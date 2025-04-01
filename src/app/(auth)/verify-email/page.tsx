// src/components/forms/auth-form.tsx の onSubmit 関数内の部分を修正

// ログイン処理
if (type === 'login') {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
  
      if (error) {
        // メール確認エラーを特定して処理
        if (error.message === 'Email not confirmed') {
          setError('メールアドレスの確認が完了していません。登録時に送信された確認メールをご確認ください。');
          
          // 確認メールの再送信ボタンを表示するためのフラグ
          setShowResendButton(true);
          setEmailForResend(data.email);
        } else {
          throw error;
        }
      } else {
        router.push('/home');
        router.refresh();
      }
    } catch (error: any) {
      // その他のエラー処理
      console.error('Authentication error:', error);
      setError(error.message || 'ログインに失敗しました。');
    }
  }