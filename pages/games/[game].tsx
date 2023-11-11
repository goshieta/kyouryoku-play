import { useRouter } from "next/router";
import gameList from "@/gameCode/list.json";
import styles from "@/styles/game.module.css";
import { useEffect, useRef, useState } from "react";
import ReactMarkDown from "react-markdown";
import Phaser from "phaser";

function extractLastPath(url: string) {
  // クエリパラメータを取り除く
  const pathWithoutQuery = url.replace(/\?.*$/, "");

  // パスを '/' で分割し、最後の要素を取得
  const pathSegments = pathWithoutQuery.split("/");
  const lastPath = pathSegments[pathSegments.length - 1];

  return lastPath;
}

//JSONデータに対して型を強制させる
type gameListType = {
  [key: string]:
    | {
        title: string;
        width: number;
        height: number;
        otherGame: string[];
      }
    | undefined;
};
const typedGameList: gameListType = gameList;

export default function Game() {
  const router = useRouter();
  const name = extractLastPath(router.asPath);
  if (name === "[game]") return <></>;

  //ゲームリストを参照し、存在するならばゲームを定義するクラスをインポートする
  const gameObjSetting = typedGameList[name];
  if (gameObjSetting == undefined)
    return (
      <>
        <p>
          指定されたゲーム「{name}」は存在しません。URLを間違えていませんか？
        </p>
      </>
    );

  //説明のmdファイルを読み込む
  const gameArea = useRef(null);
  const [mdScript, setMdScript] = useState("");
  useEffect(() => {
    fetch(`/gameDesc/${name}.md`)
      .then((m) => m.text())
      .then((md) => setMdScript(md));
  }, []);

  //canvasを取得して、それをゲームのclassに渡す
  useEffect(() => {
    const gameFunc = require(`@/gameCode/${name}/main.ts`).default;
    const cleanFunc: () => any = gameFunc(gameObjSetting, gameArea.current);
    //クリーンアップ関数
    return cleanFunc;
  }, []);

  return (
    <div id={styles.gameSet}>
      <h1 id={styles.gameSetTitle}>{gameObjSetting.title}</h1>
      <div id={styles.gameArea} ref={gameArea}></div>
      <div id={styles.mdArea}>
        <ReactMarkDown>{mdScript}</ReactMarkDown>
      </div>
      <div id={styles.otherGame}></div>
    </div>
  );
}
