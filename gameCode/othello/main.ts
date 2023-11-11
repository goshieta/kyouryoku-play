import Phaser from "phaser";
import { titleScreen } from "./titleScreen";
import { gameScreen } from "./game";

type gameConfigType = {
  title: string;
  width: number;
  height: number;
  otherGame: string[];
};
export default function othelloDF(
  gameObjSetting: gameConfigType,
  gameArea: HTMLDivElement
) {
  const config: Phaser.Types.Core.GameConfig = {
    title: "オセロ（リバーシ）",
    type: Phaser.AUTO,
    width: gameObjSetting.width,
    height: gameObjSetting.height,
    parent: gameArea,
    scene: [titleScreen, gameScreen],
  };
  const game = new Phaser.Game(config);
  return () => {
    game.destroy(true);
    console.log("destroy");
  };
}
