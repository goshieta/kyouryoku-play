import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Redirect({
  params,
}: {
  params: Promise<{ loc: string[] }>;
}) {
  let basePath = (await params).loc.join("/");
  const specificURL: { [key: string]: string } = {
    "additional/about": "blog/15542357-ea21-8033-91ab-cd1580261a28",
    "additional/aboutkyouryoku": "blog/15542357-ea21-80e0-9e4e-f332ba4171a6",
    "additional/report": "blog/15542357-ea21-80c6-82d3-f44c97d82376",
    "additional/update": "blog",
  };
  if (specificURL[basePath]) {
    basePath = specificURL[basePath];
  }

  const url = "https://kyouryoku.net/" + basePath;

  redirect(url);

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
