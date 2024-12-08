import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const url = "https://kyouryoku.net";

  redirect(url);

  return (
    <div>
      <h1>峡緑プレイは新しいドメインに移行しました</h1>
      <p>新しいドメインにリダイレクトしています…</p>
      <Link href={url}>
        自動でリダイレクトされない場合はクリックしてください
      </Link>
    </div>
  );
}
