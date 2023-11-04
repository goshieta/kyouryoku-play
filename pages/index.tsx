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
      <div id="gridGameArea">
        <GameTile
          gameTitle="オセロ(リバーシ)"
          themeColor="#00FFA3"
          link="/"
          gamePhrase="定番こそ、今やるべき"
          gameDesc="ボードゲームの中でも定番中の定番である「オセロ（リバーシ）」。定番だからこそ、久しぶりにやってみると奥が深いものです。"
        ></GameTile>
      </div>
    </div>
  );
}
