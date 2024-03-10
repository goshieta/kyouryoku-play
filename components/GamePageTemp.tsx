import styles from "@/styles/game.module.css";
import { ReactNode, useRef, useState } from "react";
import Head from "next/head";
import GameTile from "./GameTile";
import dynamic from "next/dynamic";
import gameInfo from "@/public/gameInfo.json";
import Image from "next/image";
import Loading from "./tips/loading";

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
  const gameScreen = useRef<HTMLDivElement>(null);

  const DynamicPhaser = dynamic(() => import("@/components/phaserGame"), {
    loading: () => <Loading></Loading>,
    ssr: false,
  });

  const gameAccess = () => {
    const defaultScreenSize = [window.innerWidth, window.innerHeight];
    //小さかったら全画面、さらにゲームの向きと画面の向きがあっていなかったら、横向きにさせる。
    if (
      defaultScreenSize[0] < props.width ||
      defaultScreenSize[1] < props.height
    ) {
      //フルスクリーン強制
      const elem = gameScreen.current;
      if (elem) {
        if (document.fullscreenEnabled) elem.requestFullscreen();
      }
    }
    setIsOpen(true);
  };
  const gameExit = () => {
    //フルスクリーン解除
    if (document.fullscreenEnabled && document.fullscreenElement)
      document.exitFullscreen();

    setIsOpen(false);
  };

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
        <div id={styles.gameArea}>
          <Image
            src={`/gamesImage/${props.fileName}.svg`}
            alt={props.title}
            width={80}
            height={80}
            priority={true}
          />
          <button
            style={{ backgroundColor: onTypeGameInfo[props.fileName].color }}
            onClick={gameAccess}
          >
            Play
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
        style={{ display: isOpen ? "flex" : "none" }}
        ref={gameScreen}
      >
        <button id={styles.closeGameScreen}>
          <Image
            src="/navigation/close.svg"
            alt="閉じる"
            width={25}
            height={25}
            onClick={gameExit}
          />
        </button>
        <div
          id={styles.gameScreenIn}
          style={{ maxWidth: props.width, maxHeight: props.height }}
        >
          <DynamicPhaser
            title={props.title}
            width={props.width}
            height={props.height}
            scenes={props.scenes}
            fileName={props.fileName}
            additionalConfig={props.additionalConfig}
            isOpen={isOpen}
          ></DynamicPhaser>
        </div>
      </div>
    </>
  );
}
