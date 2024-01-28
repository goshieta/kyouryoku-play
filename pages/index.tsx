import Head from "next/head";
import styles from "../styles/page.module.css";
import GameTile from "@/components/GameTile";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Head>
        <title>峡緑プレイ | KyouRyoku Play</title>
        <meta
          name="description"
          content="使いやすく、シンプル、現実世界を重視した新世代のゲームサイト「峡緑プレイ」へようこそ。このサイトでは軽いボードゲームを中心に、様々なゲームを楽しめます。"
        />
      </Head>
      <div id={styles.gridGameArea}>
        <GameTile size="big" gameCode="othello"></GameTile>
        <GameTile size="small" gameCode="westeastbuttle"></GameTile>
        <GameTile size="small" gameCode="numguess"></GameTile>
        <GameTile gameCode="flyfly" size="small"></GameTile>
        <GameTile gameCode="flash" size="small"></GameTile>
      </div>
      <Link href="/additional/update" id={styles.updateInfoLink}>
        アップデート情報
      </Link>
    </div>
  );
}
