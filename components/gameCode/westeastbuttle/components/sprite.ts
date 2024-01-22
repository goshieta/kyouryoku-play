import { game } from "../game";

export class spriteMain extends Phaser.Physics.Arcade.Sprite {
  sprite: sprite;
  game: game;

  constructor(game: game, sprite: sprite) {
    super(game, 0, 0, sprite.isMe ? "me" : "you");
    this.sprite = sprite;
    this.game = game;
    this.setAngle(sprite.isMe ? 90 : 270);

    this.setScale(sprite.magnitude / 100);

    game.add.existing(this);
    game.physics.add.existing(this);

    if (!(game.playerMode === 1 && !sprite.isMe)) {
      this.setInteractive();
      this.on("pointerover", () => sprite.circle.setVisible(true));
      this.on("pointerout", () => sprite.circle.setVisible(false));
      this.on("pointerup", () => sprite.spriteClickEvent());
    }
  }

  protected preUpdate(): void {
    this.setScale((this.sprite.magnitude + 50) / 150);

    if (this.sprite.destination[0] !== 0 || this.sprite.destination[1] !== 0) {
      this.setAngle(
        360 -
          Math.atan(this.sprite.destination[0] / this.sprite.destination[1]) *
            (180 / Math.PI) +
          (Math.sign(this.sprite.destination[1]) === 1 ? 180 : 0)
      );
    } else this.setAngle(this.sprite.isMe ? 90 : 270);
  }

  attacked() {
    if (
      Math.floor(Math.random() * (5 + this.sprite.itemEffect.strengthup)) === 0
    ) {
      this.sprite.magnitude -= 1;
      if (!this.sprite.sounds[2].isPlaying) this.sprite.sounds[2].play();
    }
    if (this.sprite.magnitude <= 0) {
      //輪廻転生
      this.game.sound.add("death").play();
      this.sprite.destroy();

      if (this.sprite.isKing) {
        this.game.gameEnd(!this.sprite.isMe);
      }
    }
  }

  getItem(itemName: string) {
    const itemFuncList: {
      [key: string]: () => void;
    } = {
      protect: () => (this.sprite.itemEffect.strengthup += 10),
      recovery: () => (this.sprite.magnitude += 50),
      speedup: () => (this.sprite.itemEffect.speedup += 20),
      stalker: () => (this.sprite.itemEffect.stalker = true),
    };
    const itemFunc = itemFuncList[itemName];
    itemFunc();
  }
}

export default class sprite extends Phaser.GameObjects.Container {
  spriteMain: spriteMain;
  text: Phaser.GameObjects.Text;
  circle: Phaser.GameObjects.Arc;
  destinationLine: Phaser.GameObjects.Line;
  sounds: Phaser.Sound.BaseSound[];

  magnitude: number;
  isMe: boolean;
  isKing: boolean;
  destination: [number, number];
  tracking: boolean = false;
  itemEffect = {
    speedup: 0,
    strengthup: 0,
    stalker: false,
  };

  game: game;

  constructor(
    game: game,
    x: number,
    y: number,
    magnitude: number,
    isMe: boolean,
    isKing: boolean = false
  ) {
    super(game);
    this.game = game;
    this.magnitude = magnitude;
    this.isMe = isMe;
    this.isKing = isKing;
    this.destination = [0, 0];

    //ホバーサークルを追加
    this.circle = game.add
      .circle(0, 0, 40, 0, 0)
      .setStrokeStyle(2, isMe ? 0x5203fc : 0xfc0384)
      .setVisible(false);
    this.add(this.circle);

    //目的地を示す線を追加
    this.destinationLine = game.add
      .line(0, 0, 0, 0, ...this.destination)
      .setOrigin(0, 0)
      .setStrokeStyle(1, isMe ? 0x5203fc : 0xfc0384);
    this.add(this.destinationLine);

    //スプライトを追加
    this.spriteMain = new spriteMain(game, this);
    this.add(this.spriteMain);

    //王の場合、王冠を追加
    if (isKing) {
      const crown = game.add.sprite(0, -45, "crown");
      this.add(crown);
    }

    //テキストを追加
    this.text = game.add
      .text(0, 0, magnitude.toString(), {
        font: "15px Arial",
      })
      .setFill("white")
      .setOrigin(0.5, 0.5)
      .setPosition(0, -40);
    this.add(this.text);

    //サウンドを追加
    this.sounds = [
      game.sound.add("don"),
      game.sound.add("dodon"),
      game.sound.add("damage"),
    ];

    this.setPosition(x, y);
    game.add.existing(this);
  }

  effectDeltaCache: number = 0;

  preUpdate(time: number, delta: number) {
    this.effectDeltaCache += delta;
    this.text.setText(this.magnitude.toString());

    this.destinationLine.setTo(
      ...(this.tracking
        ? [this.scene.input.x - this.x, this.scene.input.y - this.y]
        : [...this.destination])
    );

    //動かす
    //ストーカー
    if (this.itemEffect.stalker) {
      if (this.isMe) {
        this.destination = [
          this.game.you[13].getBounds().centerX - this.x,
          this.game.you[13].getBounds().centerY - this.y,
        ];
      } else {
        this.destination = [
          this.game.me[13].getBounds().centerX - this.x,
          this.game.me[13].getBounds().centerY - this.y,
        ];
      }
    }
    //目的地へ向かう
    if (this.destination[0] !== 0 && this.destination[1] !== 0) {
      const speed = 1000 / this.magnitude + this.itemEffect.speedup;
      const normalizeDestination = [
        this.destination[0] /
          Math.sqrt(this.destination[0] ** 2 + this.destination[1] ** 2),
        this.destination[1] /
          Math.sqrt(this.destination[0] ** 2 + this.destination[1] ** 2),
      ];
      const moveAmount: [number, number] = [
        (speed * delta * normalizeDestination[0]) / 1000,
        (speed * delta * normalizeDestination[1]) / 1000,
      ];
      this.setPosition(this.x + moveAmount[0], this.y + moveAmount[1]);

      //目的地のベクトルを修正
      const destinationCache = this.destination;
      this.destination = [
        this.destination[0] - moveAmount[0],
        this.destination[1] - moveAmount[1],
      ];
      if (
        Math.sign(destinationCache[0]) !== Math.sign(this.destination[0]) ||
        Math.sign(destinationCache[1]) !== Math.sign(this.destination[1])
      ) {
        this.destination = [0, 0];
      }
    }
    //エフェクト
    if (this.effectDeltaCache > 100) {
      this.effectDeltaCache = 0;
      const effectEnableType = [];
      if (this.itemEffect.speedup !== 0) effectEnableType.push("speedup");
      if (this.itemEffect.strengthup !== 0) effectEnableType.push("protect");
      if (this.itemEffect.stalker) effectEnableType.push("stalker");
      effectEnableType.forEach((oneEffectName) => {
        const image = this.game.add.image(
          Math.floor(Math.random() * 40 - 20),
          -10,
          oneEffectName
        );
        image.setScale(0.2);
        this.add(image);
        this.game.tweens.add({
          targets: image,
          duration: 200,
          y: -50,
          alpha: 0,
          onComplete: () => image.destroy(),
        });
      });
    }
  }

  wayOfOperationForBot(x: number, y: number) {
    this.sounds[1].play();
    this.game.isMeTurn = true;
    this.destination = [x - this.x, y - this.y];
  }
  spriteClickEvent() {
    if (this.itemEffect.stalker) return;
    if (this.game.pauseInput) return;
    if (!(this.game.isMeTurn === this.isMe)) return;
    this.game.pauseInput = true;
    this.tracking = true;
    this.sounds[0].play();

    let inputTime = 0;

    const upEvent = () => {
      if (inputTime === 0) {
        inputTime = 1;
        return;
      }
      this.destination = [
        this.scene.input.x - this.x,
        this.scene.input.y - this.y,
      ];
      this.tracking = false;
      this.sounds[1].play();
      this.scene.input.removeListener("pointerup", upEventBindThis);
      this.game.pauseInput = false;
      this.game.isMeTurn = !this.game.isMeTurn;
    };
    const upEventBindThis = upEvent.bind(this);

    this.scene.input.on("pointerup", upEventBindThis);
  }
}
