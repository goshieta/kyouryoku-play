import Phaser from "phaser";
import { titleScreen } from "./titleScreen";
import { gameScreen } from "./game";

export default function othelloDF(gameArea: HTMLDivElement) {
  console.log("main.ts worked!");
  const config: Phaser.Types.Core.GameConfig = {
    title: "オセロ（リバーシ）",
    type: Phaser.AUTO,
    width: 500,
    height: 600,
    parent: gameArea,
    scene: [titleScreen, gameScreen],
  };
  const game = new Phaser.Game(config);
  return () => {
    game.destroy(true);
    console.log("destroy");
  };
}
