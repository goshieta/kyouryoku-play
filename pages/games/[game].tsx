import { useRouter } from "next/router";
import gameList from "@/gameCode/list.json";
import styles from "@/styles/game.module.css";
import { useEffect, useRef, useState } from "react";
import ReactMarkDown from "react-markdown";

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
  const [mdScript, setMdScript] = useState("");
  useEffect(() => {
    fetch(`/gameDesc/${name}.md`)
      .then((m) => m.text())
      .then((md) => setMdScript(md));
  }, []);

  //canvasを取得して、それをゲームのclassに渡す
  const gameCanvas = useRef();
  const gameClass = require(`@/gameCode/${name}/main.ts`).default;
  const [gameInstance, setGameInstance] = useState<any>(undefined);
  useEffect(() => {
    setGameInstance(new gameClass(gameCanvas));
  }, []);

  return (
    <>
      <h1>{gameObjSetting.title}</h1>
      <canvas
        width={gameObjSetting.width}
        height={gameObjSetting.height}
        ref={gameCanvas.current}
      ></canvas>
      <div id={styles.mdArea}>
        <ReactMarkDown>{mdScript}</ReactMarkDown>
      </div>
    </>
  );
}
