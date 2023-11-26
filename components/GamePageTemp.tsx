import styles from "@/styles/game.module.css";
import { ReactNode, useRef, useEffect, useState, useMemo } from "react";
import Head from "next/head";

export default function GamePageTemp(props: {
  title: string;
  children: ReactNode;
  scenes: any[];
  width: number;
  height: number;
}) {
  const gameArea = useRef<HTMLDivElement>(null);

  const [isReadPhaser, setIsReadPhaser] = useState<boolean>(false);
  const [phaserObj, setPhaserObj] = useState<any>(null);

  //シーンの配列が切り替わったかを判断する材料
  const [scenesCache, setScenesCache] = useState(props.scenes);

  //canvasを取得して、それをゲームのclassに渡す
  useEffect(() => {
    async function initPhaser() {
      /*if (
        typeof window !== "undefined" &&
        typeof window.navigator !== "undefined"
      )
        return;*/
      //シーンのキャッシュと一回のみ実行されるように書く
      if (isReadPhaser && scenesCache === props.scenes) return;

      if (gameArea.current === null) return;
      const Phaser = await import("phaser");

      phaserObj?.destroy(true);

      //ゲームのプログラム
      const config: Phaser.Types.Core.GameConfig = {
        title: props.title,
        type: Phaser.AUTO,
        width: 500,
        height: 600,
        parent: gameArea.current,
        scene: props.scenes,
      };

      setPhaserObj(new Phaser.Game(config));
      setScenesCache(props.scenes);

      //読み込み完了
      setIsReadPhaser(true);
    }
    //const cleanFunc = props.gameFunction(gameArea.current);
    //クリーンアップ関数
    //return cleanFunc;

    initPhaser();
  });

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
