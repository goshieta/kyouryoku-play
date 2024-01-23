export class gameAnswer extends Phaser.Scene {
  gameData?: {
    level: number;
    digit: number;
    number: number;
    second: number;
    currentNumber: number;
    cache: { userAnswer: number; correctAnswer: number }[];
    correctNumber: number;
  };

  constructor() {
    super({
      key: "gameAnswer",
    });
  }
  init(data: {
    level: number;
    digit: number;
    number: number;
    second: number;
    currentNumber: number;
    cache: { userAnswer: number; correctAnswer: number }[];
    correctNumber: number;
  }) {
    this.gameData = data;
  }

  create() {
    const formCode = `
      <form id="fga_parent" onsubmit="return false;">
        <input type="number" id="fga_answer" />
        <button id="fga_enter" type="submit">回答</button>
      </div>
      <style>
        #fga_parent{
          text-align:center;
        }
        #fga_answer{
          display:block;
          border-radius:3px;
          background-color:black;
          color:white;
          width:180px;
          margin-bottom:30px;
          border:solid 1px #00ffa2;
          padding:5px;
          text-align:center;
          font-size:20px;
          box-sizing:border-box;
          -moz-appearance:textfield;
          outline:none;
        }
        #fga_answer::-webkit-inner-spin-button,
        #fga_answer::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        #fga_enter{
          cursor:pointer;
          width:180px;
          height:40px;
          font-size:18px;
          display:block;
          background-color:#00bf79;
          border-radius:5px;
          color:white;
          margin:0px auto;
          border:none;
          outline:none;
        }
      </style>
    `;
    const formDom = this.add.dom(250, 250).createFromHTML(formCode);

    const enterAnswer = () => {
      if (this.gameData === undefined) return;
      this.gameData.cache.push({
        userAnswer: Number(
          (<HTMLInputElement>formDom.getChildByID("fga_answer")).value
        ),
        correctAnswer: this.gameData.correctNumber,
      });
      this.gameData.currentNumber += 1;

      //次のシーンへの分岐
      if (this.gameData.currentNumber <= 5) {
        this.scene.start("game", this.gameData);
      } else {
        //５問解いたら
        this.scene.start("checkingAnswer", {
          problemCache: this.gameData.cache,
        });
      }
    };

    (<HTMLInputElement>formDom.getChildByID("fga_answer")).focus();

    formDom.getChildByID("fga_enter")?.addEventListener("click", enterAnswer);
  }
}
