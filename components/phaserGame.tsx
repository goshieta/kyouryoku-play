import Phaser from "phaser";
import { useEffect, useRef, useState } from "react";

export default function phaserGame(props: {
  title: string;
  width: number;
  height: number;
  scenes: string[];
  fileName: string;
  additionalConfig?: Phaser.Types.Core.GameConfig;
  isOpen: boolean;
}) {
  const gameArea = useRef<HTMLDivElement>(null);
  const [sceneArray, setSceneArray] = useState<Phaser.Scene[]>([]);

  useEffect(() => {
    const readScenes = async () => {
      //シーンの読み込み。Promiseの関係でmapを使えなかったのでfor文
      const readScenesArray: Phaser.Scene[] = [];
      for (let i = 0; i < props.scenes.length; i++) {
        const readModule = await import(
          `@/components/gameCode/${props.fileName}/${props.scenes[i]}`
        );
        readScenesArray.push(readModule[props.scenes[i]]);
      }

      setSceneArray(readScenesArray);
    };
    readScenes();
  }, []);

  useEffect(() => {
    if (gameArea.current == null) return;
    if (sceneArray.length == 0) return;
    if (!props.isOpen) return;

    const config: Phaser.Types.Core.GameConfig = {
      title: props.title,
      type: Phaser.AUTO,
      parent: gameArea.current,
      scene: sceneArray,
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
    const phaserObj = new Phaser.Game(config);

    return () => {
      phaserObj.destroy(true, false);
    };
  }, [gameArea, sceneArray]);

  return <div ref={gameArea}></div>;
}
