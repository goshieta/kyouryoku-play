import styles from "@/styles/game.module.css";
import { ReactNode, useRef, useEffect, useState } from "react";
import Head from "next/head";
import GameTile from "./GameTile";
import dynamic from "next/dynamic";
import gameInfo from "@/public/gameInfo.json";

export default function GamePageTemp(props: {
  title: string;
  children: ReactNode;
  scenes: string[];
  fileName: string;
  width: number;
  height: number;
  otherGames: string[];
  additionalConfig?: Phaser.Types.Core.GameConfig;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const DynamicPhaser = dynamic(() => import("@/components/phaserGame"), {
    loading: () => (
      <div id={styles.loadingGame}>
        <div id={styles.loadingFlex}>
          <div className={styles.roundLoader}></div>
          <div className={styles.roundLoader}></div>
          <div className={styles.roundLoader}></div>
        </div>
        <p>ゲームを読み込み中...</p>
      </div>
    ),
    ssr: false,
  });

  type TypeGameInfo = {
    title: string;
    catchCopy?: string;
    description?: string;
    gameCode: string;
    color: string;
  };
  const onTypeGameInfo: {
    [key: string]: TypeGameInfo;
  } = gameInfo;

  return (
    <>
      <Head>
        <title>{`${props.title} - 峡緑プレイ`}</title>
      </Head>
      <div id={styles.gameSet}>
        <h1 id={styles.gameSetTitle}>{props.title}</h1>
        <div
          id={styles.gameArea}
          style={{ backgroundColor: onTypeGameInfo[props.fileName].color }}
        >
          <img
            src={`/gamesImage/${props.fileName}.svg`}
            alt={props.title}
            width={80}
            height={80}
          />
          <button
            style={{ backgroundColor: onTypeGameInfo[props.fileName].color }}
            onClick={() => {
              const defaultScreenSize = [window.innerWidth, window.innerHeight];
              //小さかったら全画面、さらにゲームの向きと画面の向きがあっていなかったら、横向きにさせる。
              if (
                defaultScreenSize[0] < props.width ||
                defaultScreenSize[1] < props.height
              ) {
                if (
                  defaultScreenSize[0] < defaultScreenSize[1] !==
                  props.width < props.height
                ) {
                  //横向き強制
                  alert("画面の向きを回転させてください");
                  return;
                }
                //フルスクリーン強制
                document.documentElement.requestFullscreen();
              }
              setIsOpen(true);
            }}
          >
            <span>Play</span>
          </button>
        </div>
        <div id={styles.mdArea}>{props.children}</div>
        <div id={styles.otherGame}>
          <h2>おすすめのゲーム</h2>
          <div id={styles.otherGameTile}>
            {props.otherGames.map((game, index) => {
              return (
                <GameTile
                  gameCode={game}
                  size="small"
                  key={`recommendGameNumber${index}`}
                ></GameTile>
              );
            })}
          </div>
        </div>
      </div>
      <div
        id={styles.gameScreen}
        style={{ display: isOpen ? "block" : "none" }}
      >
        <button id={styles.closeGameScreen}>
          <img
            src="/navigation/close.svg"
            alt="閉じる"
            width={25}
            height={25}
            onClick={() => setIsOpen(false)}
          />
        </button>
        <div id={styles.gameScreenIn}>
          <DynamicPhaser
            title={props.title}
            width={props.width}
            height={props.height}
            scenes={props.scenes}
            fileName={props.fileName}
            additionalConfig={props.additionalConfig}
          ></DynamicPhaser>
        </div>
      </div>
    </>
  );
}
