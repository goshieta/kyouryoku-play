import styles from "@/styles/game.module.css";
import { ReactNode, useRef, useEffect, useState } from "react";
import Head from "next/head";
import GameTile from "./GameTile";
import { useRouter } from "next/router";

export default function GamePageTemp(props: {
  title: string;
  children: ReactNode;
  scenes: string[];
  fileName: string;
  width: number;
  height: number;
  otherGames: string[];
}) {
  const gameArea = useRef<HTMLDivElement>(null);

  const [isReadPhaser, setIsReadPhaser] = useState<boolean>(false);
  const [phaserObj, setPhaserObj] = useState<any>(null);

  //canvasを取得して、それをゲームのclassに渡す
  useEffect(() => {
    async function initPhaser() {
      //一回のみ実行されるように書く
      if (isReadPhaser) return;

      if (gameArea.current === null) return;
      const Phaser = await import("phaser");

      phaserObj?.destroy(true);

      //シーンの読み込み。Promiseの関係でmapを使えなかったのでfor文
      const scenesArray: Phaser.Scene[] = [];
      for (let i = 0; i < props.scenes.length; i++) {
        const readModule = await import(
          `@/components/gameCode/${props.fileName}/${props.scenes[i]}`
        );
        scenesArray.push(readModule[props.scenes[i]]);
      }

      //ゲームのプログラム
      const config: Phaser.Types.Core.GameConfig = {
        title: props.title,
        type: Phaser.AUTO,
        width: props.width,
        height: props.height,
        parent: gameArea.current,
        scene: scenesArray,
        dom: {
          createContainer: true,
        },
      };

      setPhaserObj(new Phaser.Game(config));

      //読み込み完了
      setIsReadPhaser(true);
    }
    initPhaser();
  }, []);

  //ページ遷移をした場合phaserオブジェクトを破棄する
  const router = useRouter();
  const pageChangeEvent = () => {
    phaserObj?.destroy(true);
  };
  useEffect(() => {
    router.events.on("routeChangeStart", pageChangeEvent);
    return () => {
      router.events.off("routeChangeStart", pageChangeEvent);
    };
  }, []);

  return (
    <>
      <Head>
        <title>{props.title} - 峡緑プレイ</title>
      </Head>
      <div id={styles.gameSet}>
        <h1 id={styles.gameSetTitle}>{props.title}</h1>
        {phaserObj === null ? (
          <div id={styles.loadingGame}>
            <div id={styles.loadingFlex}>
              <div className={styles.roundLoader}></div>
              <div className={styles.roundLoader}></div>
              <div className={styles.roundLoader}></div>
            </div>
            <p>ゲームを読み込み中...</p>
          </div>
        ) : (
          <></>
        )}
        <div id={styles.gameArea} ref={gameArea}></div>
        <div id={styles.mdArea}>{props.children}</div>
        <div id={styles.otherGame}>
          <h2>おすすめのゲーム</h2>
          <div id={styles.otherGameTile}>
            {props.otherGames.map((game, index) => {
              return (
                <GameTile
                  gameCode={game}
                  size="small"
                  themeColor="#b994ff"
                  key={`recommendGameNumber${index}`}
                ></GameTile>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
