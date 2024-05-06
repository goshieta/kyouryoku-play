import Head from "next/head";
import styles from "@/styles/page.module.css";
import GameTile from "@/components/GameTile";
import PageLinkArea from "@/components/top/pageLinkArea";
import { KyouRyokuPlayCredit } from "@/components/header/Header";
import PostArea from "@/components/top/postArea";

export default function Home() {
  return (
    <>
      <Head>
        <title>峡緑プレイ | KyouRyoku Play</title>
        <meta
          name="description"
          content="ゲームで世界をつなげる。峡緑プレイは「ゲームのSNS」として人の集まる新たな場所を提供します。"
        />
      </Head>
      <div id={styles.contentArea}>
        <div id={styles.topSummary}>
          <div id={styles.summaryDescription}>
            <KyouRyokuPlayCredit />
          </div>
          <PageLinkArea />
        </div>
        <div id={styles.gameArea}>
          <h2>ゲーム</h2>
          <div className={styles.flexContent}>
            <GameTile gameCode="soccer"></GameTile>
            <GameTile gameCode="westeastbuttle"></GameTile>
            <GameTile gameCode="castlerun"></GameTile>
            <GameTile gameCode="numguess"></GameTile>
            <GameTile gameCode="flyfly"></GameTile>
            <GameTile gameCode="flash"></GameTile>
            <GameTile gameCode="othello"></GameTile>
          </div>
        </div>
        <PostArea />
      </div>
    </>
  );
}
