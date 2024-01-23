import Phaser from "phaser";
import { useEffect, useRef } from "react";

export default function phaserGame() {
  console.log("game");
  const gameArea = useRef<HTMLDivElement>(null);
  console.log(gameArea.current);

  useEffect(() => {
    if (gameArea.current !== null) {
      const config: Phaser.Types.Core.GameConfig = {
        title: "props.title",
        type: Phaser.AUTO,
        width: 500,
        height: 500,
        parent: gameArea.current,
        scene: [],
        dom: {
          createContainer: true,
        },
      };
      const game = new Phaser.Game(config);
    }
  });

  return <div ref={gameArea}></div>;
}
