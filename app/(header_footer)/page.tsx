import styles from "@/app/style/page/top.module.css";
import GameTile from "@/app/component/common/gameTile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "峡緑プレイ | KyouRyoku Play",
  description:
    "使いやすく、シンプル、現実世界を重視した新世代のゲームサイト「峡緑プレイ」へようこそ。このサイトでは軽いボードゲームを中心に、様々なゲームを楽しめます。",
};

export default async function Home() {
  return (
    <div id={styles.gridGameArea}>
      <GameTile gameCode="soccer"></GameTile>
      <GameTile gameCode="westeastbuttle"></GameTile>
      <GameTile gameCode="castlerun"></GameTile>
      <GameTile gameCode="numguess"></GameTile>
      <GameTile gameCode="flyfly"></GameTile>
      <GameTile gameCode="flash"></GameTile>
      <GameTile gameCode="othello"></GameTile>
    </div>
  );
}
