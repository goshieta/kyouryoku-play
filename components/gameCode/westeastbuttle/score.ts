//スコアの表示画面
export class score extends Phaser.Scene {
  resultForMe: boolean = true;

  constructor() {
    super("score");
  }

  init(config: { resultForMe: boolean }) {
    this.resultForMe = config.resultForMe;
  }

  create() {
    this.cameras.main.setBackgroundColor("rgb(243, 255, 250)");

    console.log(this.resultForMe);
    const domCode = `
      <div id="ws_score">
        <h1 style="color:${this.resultForMe ? "#5203fc" : "#fc0384"}">${
      this.resultForMe ? "青" : "赤"
    }の勝ち</h1>
        <button id="ws_top">トップ</button>
      </div>
      <style>
        #ws_score{
          text-align:center;
        }
        #ws_score h1{
          font-size:30px
        }
        #ws_top{
          display: block;
          width: 200px;
          height: 60px;
          background-color: rgb(199, 255, 229);
          border-radius: 5px;
          margin: 50px 0;
          border: none;
          color: black;
          cursor: pointer;
        }
        #ws_top:hover {
          background-color: rgb(149, 255, 205);
          transition: 0.2s background-color;
        }
      </style>
    `;
    const dom = this.add.dom(400, 300).createFromHTML(domCode);
    dom.getChildByID("ws_top")?.addEventListener("click", () => {
      this.scene.start("title");
    });
  }
}
