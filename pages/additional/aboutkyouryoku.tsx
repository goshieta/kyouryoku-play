import Head from "next/head";
import Link from "next/link";

export default function aboutkyouryoku() {
  return (
    <>
      <Head>
        <title>峡緑について - 峡緑プレイ</title>
      </Head>
      <div className="explainArea">
        <h1>峡緑について</h1>
        <p>
          峡緑は、世界で最もパワフルになる予定の私が開発したサイトにつけているブランド名の一種です。峡緑プレイ（Kyouryoku
          Play）Inforde Top、Inforde
          Game、簡単！JavaScript入門などのサイトを運営しています。現在この中でもいくつかのサイトは閉じる予定ですが、これから新規で様々なサービスを開発していく予定です。
        </p>
        <p>一応下に運営している各サイトのリンクを載せます。</p>
        <ul>
          <li>
            <Link href="/">峡緑プレイ（KyouRyoku Play）</Link>
          </li>
          <li>
            <Link href="https://iyqzbugtwfgzyugaybuxxa.on.drv.tw/Indorde%20top/InT.html">
              Inforde Top
            </Link>
          </li>
          <li>
            <Link href="https://iyqzbugtwfgzyugaybuxxa.on.drv.tw/Indorde%20top/InT/Ing/Ing.html">
              Inforde Game
            </Link>
          </li>
          <li>
            <Link href="https://iyqzbugtwfgzyugaybuxxa.on.drv.tw/Indorde%20top/InT/%E7%B0%A1%E5%8D%98!%E8%AA%B0%E3%81%A7%E3%82%82!Javascript%E5%85%A5%E9%96%80/%E5%85%A5%E9%96%80.html">
              簡単！JavaScript入門
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
