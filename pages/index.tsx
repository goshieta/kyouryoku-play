import Head from "next/head";
import styles from "../styles/page.module.css";
import GameTile from "@/components/GameTile";

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
        <GameTile themeColor="#00ffa2" size="big" gameCode="othello"></GameTile>
        <GameTile
          gameCode="flyfly"
          themeColor="#b994ff"
          size="small"
        ></GameTile>
        <GameTile gameCode="flash" themeColor="#b994ff" size="small"></GameTile>
      </div>
    </div>
  );
}
