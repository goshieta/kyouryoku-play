import styles from "@/styles/game.module.css";
import { ReactNode, useRef, useEffect } from "react";
import Head from "next/head";

export default function GamePageTemp(props: {
  title: string;
  children: ReactNode;
  gameFunction: (gameArea: HTMLDivElement) => () => void;
}) {
  const gameArea = useRef<HTMLDivElement>(null);

  //canvasを取得して、それをゲームのclassに渡す
  useEffect(() => {
    console.log("useEffect done.");
    if (gameArea.current === null) return;
    const cleanFunc = props.gameFunction(gameArea.current);
    //クリーンアップ関数
    return cleanFunc;
  }, []);

  return (
    <>
      <Head>
        <title>{props.title} - 峡緑プレイ</title>
      </Head>
      <div id={styles.gameSet}>
        <h1 id={styles.gameSetTitle}>{props.title}</h1>
        <div id={styles.gameArea} ref={gameArea}></div>
        <div id={styles.mdArea}>{props.children}</div>
        <div id={styles.otherGame}></div>
      </div>
    </>
  );
}
