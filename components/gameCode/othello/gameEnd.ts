export class gameEnd extends Phaser.Scene {
  lastScore: {
    black: number;
    white: number;
  };

  constructor() {
    super({
      key: "gameEnd",
    });

    this.lastScore = {
      black: 0,
      white: 0,
    };
  }

  create() {
    const backGround = this.add.graphics();
    backGround.fillStyle(0x1aff97, 1);
    backGround.fillRect(
      0,
      0,
      Number(this.game.config.width),
      Number(this.game.config.height)
    );

    let resultString = "";
    if (this.lastScore.black > this.lastScore.white)
      resultString = "黒の勝ち！";
    else if (this.lastScore.black === this.lastScore.white)
      resultString = "引き分け";
    else resultString = "白の勝ち！";

    const result = `
      <div id="rge_top">
        <h2>${resultString}</h2>
        <div id="rge_scoreArea">
          <div id="rge_blackScoreArea">
            ${this.lastScore.black}
          </div>
          <div id="rge_whiteScoreArea">
            ${this.lastScore.white}
          </div>
        </div>
        <button id="rge_backToTop">トップに戻る</button>
      </div>
      <style>
      #rge_top{
        text-align:center;
      }
      #rge_scoreArea{
        display:flex;
        gap:20px;
        justify-content:center;
        margin:30px 0;
      }
      #rge_scoreArea > div{
        width:80px;
        height:40px;
        display:flex;
        justify-content:center;
        align-items:center;
        border-radius:2px;
        font-size:20px;
        font-weight:bold;
        box-sizing:border-box;
      }
      #rge_blackScoreArea{
        background-color:black;
        color:white;
      }
      #rge_whiteScoreArea{
        background-color:white;
      }
      #rge_backToTop{
        cursor:pointer;
        margin:60px;
        display:block;
        border-radius:5px;
        width:200px;
        height:60px;
        font-size:20px;
        font-weight:bold;
        border:none;
      }
    </style>
    `;
    const resultDom = this.add.dom(250, 300).createFromHTML(result);
    resultDom.getChildByID("rge_backToTop")?.addEventListener("click", () => {
      this.scene.start("titleScreen");
    });
  }

  init(data: { black: string; white: string }) {
    this.lastScore = { white: Number(data.white), black: Number(data.black) };
  }
}
