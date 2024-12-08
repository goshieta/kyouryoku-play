"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Redirect() {
  const router = useRouter();
  const params = useParams();
  const url = `https://kyouryoku.net/${(params.loc as any).join("/")}`;

  useEffect(() => {
    router.push(url);
  }, []);

  return (
    <div>
      <h1>峡緑プレイは新しいドメインに移行しました。</h1>
      <p>新しいドメインにリダイレクトしています…</p>
      <Link href={url}>
        自動でリダイレクトされない場合はクリックしてください
      </Link>
    </div>
  );
}
