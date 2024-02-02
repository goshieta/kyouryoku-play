import bot from "./bot/main";
import goal from "./components/goal";
import goalAnimation from "./components/goalAnimation";
import player from "./components/player";
import { score } from "./score";
import { top } from "./top";

export class game extends Phaser.Scene {
  top?: top;
  score?: score;
  mode: 0 | 1 | 2 = 0;
  spriteMove: {
    red: boolean;
    blue: boolean;
  } = { red: false, blue: false };
  point: {
    red: number;
    blue: number;
  } = {
    red: 0,
    blue: 0,
  };
  isCoolDown: boolean = false;
  isScoreSession: boolean = false;

  ball?: Phaser.Physics.Matter.Sprite;
  player?: {
    red: player;
    blue?: player;
  };
  pointText?: Phaser.GameObjects.Text;
  goalAnimaiton?: goalAnimation;

  cheer?: Phaser.Sound.BaseSound;

  constructor() {
    super("game");
  }
  create() {
    this.scene.launch("top");
    this.top = <top>this.scene.get("top");

    this.matter.world.setBounds(0, 0, 800, 600);

    this.add.image(400, 300, "back");

    //ゲームオブジェクトを追加
    this.ball = this.matter.add
      .sprite(400, 300, "ball")
      .setScale(0.4)
      .setCircle(25)
      .setFriction(0, 0)
      .setBounce(0.9);
    this.player = {
      red: new player(this, this.matter.world, 300, 300, "red"),
      blue: new player(this, this.matter.world, 500, 300, "blue"),
    };
    new goal(this, 40, 300, "red");
    new goal(this, 760, 300, "blue");

    //得点表示
    this.pointText = this.add
      .text(400, 20, `${this.point.red} - ${this.point.blue}`, {
        fontSize: 40,
        fontStyle: "bold",
      })
      .setOrigin(0.5, 0.5)
      .setFill("#000000");

    this.goalAnimaiton = new goalAnimation(this);

    //音
    const backsound = this.sound.add("backsound", { loop: true });
    backsound.play();
    this.cheer = this.sound.add("cheer");
  }

  update(): void {
    //タイトルのシーンを消す
    if (
      this.top?.play !== 0 &&
      this.top &&
      this.mode === 0 &&
      !this.isScoreSession
    ) {
      this.mode = this.top.play;
      this.scene.pause("top");

      //操作用ゲームオブジェクト
      if (this.score === undefined) {
        const rect1 = this.add
          .rectangle(0, 0, this.mode == 2 ? 400 : 800, 600)
          .setOrigin(0, 0)
          .setInteractive();
        rect1.on("pointerdown", () => (this.spriteMove.red = true));
        rect1.on("pointerup", () => (this.spriteMove.red = false));
        if (this.mode === 2) {
          const rect2 = this.add
            .rectangle(400, 0, 400, 600)
            .setOrigin(0, 0)
            .setInteractive();
          rect2.on("pointerdown", () => (this.spriteMove.blue = true));
          rect2.on("pointerup", () => (this.spriteMove.blue = false));
        }
      } else {
        this.isCoolDown = false;
      }
      //操作（キーボード）
      this.input.keyboard?.on("keydown", (index: any) => {
        if (index.key === "q") {
          this.spriteMove.red = true;
        } else if (index.key === "p" && this.mode == 2) {
          this.spriteMove.blue = true;
        }
      });
      this.input.keyboard?.on("keyup", (index: any) => {
        if (index.key === "q") {
          this.spriteMove.red = false;
        } else if (index.key === "p" && this.mode == 2) {
          this.spriteMove.blue = false;
        }
      });
    }

    //スコアのシーンを消す
    if (this.score?.end == true && this.isScoreSession) {
      this.isScoreSession = false;
      this.scene.pause("score");
      this.scene.launch("top");
      this.top = <top>this.scene.get("top");
      this.point = { red: 0, blue: 0 };
      this.ball?.setPosition(400, 300);
      this.ball?.setVelocity(0, 0);
      this.player?.red.reset();
      this.player?.blue?.reset();
    }

    //一人プレイの場合、bot関数を呼び出す。
    if (this.mode === 1 && this.player && this.player.blue && this.ball) {
      const botAnswer = bot(
        {
          x: this.player.blue.x,
          y: this.player.blue.y,
          angle:
            Math.sign(this.player.blue.angle) == -1
              ? 360 + this.player.blue.angle
              : this.player.blue.angle,
        },
        { x: this.ball.x, y: this.ball.y }
      );
      this.spriteMove.blue = botAnswer;
    }

    this.pointText?.setText(`${this.point.red} - ${this.point.blue}`);
  }

  gameEnd() {
    this.mode = 0;
    this.isScoreSession = true;
    this.scene.launch("score", { scoreInfo: this.point });
    this.score = <score>this.scene.get("score");
    this.score.end = false;
  }
}
