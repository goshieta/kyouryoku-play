import Phaser from "phaser";
import { useEffect, useRef, useState } from "react";

export default function phaserGame(props: {
  title: string;
  width: number;
  height: number;
  scenes: string[];
  fileName: string;
  additionalConfig?: Phaser.Types.Core.GameConfig;
}) {
  const gameArea = useRef<HTMLDivElement>(null);
  const [phaserobj, setPhaserobj] = useState<Phaser.Game>();

  useEffect(() => {
    const makeGame = async () => {
      if (gameArea.current == null) return;
      //シーンの読み込み。Promiseの関係でmapを使えなかったのでfor文
      const scenesArray: Phaser.Scene[] = [];
      for (let i = 0; i < props.scenes.length; i++) {
        const readModule = await import(
          `@/components/gameCode/${props.fileName}/${props.scenes[i]}`
        );
        scenesArray.push(readModule[props.scenes[i]]);
      }

      const config: Phaser.Types.Core.GameConfig = {
        title: props.title,
        type: Phaser.AUTO,
        parent: gameArea.current,
        scene: scenesArray,
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          width: props.width,
          height: props.height,
          max: {
            width: props.width,
            height: props.height,
          },
          min: {
            width: 10,
            height: 10,
          },
        },
        dom: {
          createContainer: true,
        },
        ...props.additionalConfig,
      };
      setPhaserobj(new Phaser.Game(config));
    };
    makeGame();
  }, [gameArea]);

  useEffect(() => {
    return () => {
      phaserobj?.destroy(true);
    };
  }, []);

  return <div ref={gameArea}></div>;
}
