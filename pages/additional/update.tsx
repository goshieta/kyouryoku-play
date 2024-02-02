import Head from "next/head";

export default function Update() {
  return (
    <>
      <Head>
        <title>アップデート情報</title>
      </Head>
      <div className="explainArea">
        <h1>アップデート情報</h1>
        <div className="block">
          <p>2024/02/02 : ダークモード対応</p>
          <p>2024/02/02 : 走る城を追加</p>
          <p>2024/02/02 : ヘマヘマサッカーを追加</p>
          <p>2024/01/28 : 東西大決戦のクリック表示をわかりやすく</p>
          <p>2024/01/28 : アップデート情報のページを追加</p>
          <p>2024/01/28 : モバイル端末で全画面表示になるように</p>
          <p>2024/01/24 : サイト公開</p>
        </div>
      </div>
    </>
  );
}
