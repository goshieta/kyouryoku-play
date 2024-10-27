import { Metadata } from "next";
import Link from "next/link";
import styles from "../additional.module.css";

export const metadata: Metadata = {
  title: "このサイトについて - 峡緑プレイ",
};

export default function About() {
  return (
    <div id={styles.explain_area}>
      <h1>このサイトについて</h1>
      <h2>本サイトの特徴</h2>
      <p>
        本サイトは峡緑（KyouRyoku）のプロジェクトの一つです。製作者が趣味で、軽めのブラウザゲームを公開しています。すべてのゲームは無料で、広告の表示もありません。
      </p>
      <p>
        当サイトは誰でも、いつでも遊べるゲームサイトを目指しています。そのためサイト全体としてデザインを簡素化しており、シンプルな構成となっています。また、ゲーム自体もシンプルなものを多めにするつもりです。
      </p>
      <h2>本サイトの対応環境</h2>
      <p>本サイトがサポートしているOSはWindowsとLinuxとAndroidのみです</p>
      <p>
        また、本サイトがサポートしているブラウザは以下の通りです。すべて最新バージョンです。
      </p>
      <ul>
        <li>Google Chrome</li>
        <li>Microsoft Edge</li>
        <li>Firefox</li>
        <li>Opera</li>
        <li>Brave</li>
        <li>Vivaldi</li>
        <li>Sidekick</li>
      </ul>
      <p>
        Apple製品および、SafariなどのWebkitを用いているブラウザはサポートしていません。そのため、サイトの一部の機能が使えない可能性があります。
      </p>
      <h2>このサイトの技術的な構成</h2>
      <p>
        本サイトはNext.js+TypeScriptを用いて開発されています。ゲーム自体はPhaser.jsで開発しています。
      </p>
      <p>
        またソースコードは
        <Link href="https://github.com/goshieta/kyouryoku-play">Github</Link>
        にあげています。興味のある人は見てみてください。また、Phaser.jsのために毎回3.5MBくらいの読み込みが発生するのですが、減らす方法を知っている人は教えてくれると嬉しいです。
      </p>
      <h2>アクセス解析ツールについて</h2>
      <p>
        当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を利用しています。このGoogleアナリティクスはトラフィックデータの収集のためにクッキー（Cookie）を使用しております。トラフィックデータは匿名で収集されており、個人を特定するものではありません。
      </p>
    </div>
  );
}
