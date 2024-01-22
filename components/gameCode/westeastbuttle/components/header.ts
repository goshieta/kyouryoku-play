import { game } from "../game";

//ゲームのステート自体はgameシーンで管理。このクラスはあくまでもUI
export default class header extends Phaser.GameObjects.Container {
  turnVisibleCircle: [Phaser.GameObjects.Arc, Phaser.GameObjects.Arc];
  game: game;

  constructor(game: game) {
    super(game, 400, 25);
    this.game = game;

    //青の丸
    const meRound = game.add.circle(-350, 0, 15, 0x5203fc);
    this.add(meRound);

    //赤の丸
    const youRound = game.add.circle(350, 0, 15, 0xfc0384);
    this.add(youRound);

    //ターンの表示
    this.turnVisibleCircle = [
      game.add
        .circle(-350, 0, 20, 0, 0)
        .setStrokeStyle(2, 0x5203fc)
        .setVisible(false),
      game.add
        .circle(350, 0, 20, 0, 0)
        .setStrokeStyle(2, 0xfc0384)
        .setVisible(false),
    ];
    this.add(this.turnVisibleCircle);

    game.add.existing(this);
  }

  preUpdate() {
    this.turnVisibleCircle[0].setVisible(this.game.isMeTurn);
    this.turnVisibleCircle[1].setVisible(!this.game.isMeTurn);
  }
}
