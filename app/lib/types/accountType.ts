export type accountDataType = {
  id: string;
  name: string;
  rank: number; // 初回ログイン時のランク
  totalPoints: number; // 初回ログイン時の合計ポイント
  description: string; // アカウントの説明（必要に応じて追加）
  profileImageUrl: string; // アカウント画像のURL
};

export type secretAccountDataType = {
  createdAt: Date;
  email: string;
};
