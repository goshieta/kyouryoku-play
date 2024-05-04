import Head from "next/head";
import styles from "../styles/page.module.css";
import GameTile from "@/components/GameTile";

export default function Home() {
  return (
    <>
      <Head>
        <title>峡緑プレイ | KyouRyoku Play</title>
        <meta
          name="description"
          content="使いやすく、シンプル、現実世界を重視した新世代のゲームサイト「峡緑プレイ」へようこそ。このサイトでは軽いボードゲームを中心に、様々なゲームを楽しめます。"
        />
      </Head>
      <div id={styles.gridArea}>
        <div id={styles.gameArea}>
          <h2>ゲーム</h2>
          <GameTile size="big" gameCode="soccer"></GameTile>
          <GameTile size="small" gameCode="westeastbuttle"></GameTile>
          <GameTile size="small" gameCode="castlerun"></GameTile>
          <GameTile size="small" gameCode="numguess"></GameTile>
          <GameTile gameCode="flyfly" size="small"></GameTile>
          <GameTile gameCode="flash" size="small"></GameTile>
          <GameTile size="small" gameCode="othello"></GameTile>
        </div>
        <div id={styles.postArea}>
          <h2>投稿</h2>
        </div>
      </div>
    </>
  );
}
