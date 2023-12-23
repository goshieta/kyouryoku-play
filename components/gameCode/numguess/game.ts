export class game extends Phaser.Scene {
  level: number;
  correctNumber: number;
  constructor() {
    super({ key: "game" });

    this.level = 0;
    this.correctNumber = 0;
  }

  init(config: { level: number }) {
    this.level = config.level;
  }

  create() {
    //正解を生成
    for (let i = 0; i < this.level + 3; i++) {
      let newVal = 0;
      do {
        if (i === this.level + 2) {
          newVal = Math.floor(Math.random() * 9 + 1);
        } else {
          newVal = Math.floor(Math.random() * 10);
        }
      } while (this.correctNumber.toString().includes(String(newVal)));
      this.correctNumber += newVal * 10 ** i;
    }

    const gameCode = `
      <div id="ng_main">
        <div id="ng_input_area">
          <h2>${["初級", "中級", "上級"][this.level]}</h2>
          <div>
            <input type="number"></input><button>回答</button>
          </div>
        </div>
        <div id="ng_history"></div>
        <div id="ng_para">
          <div id="ng_seconds">
            <p>残り時間</p>
            <p>0.0</p>
          </div>
          <div id="ng_times">
            <p>残り回数</p>
            <p>0</p>
          </div>
        </div>
      </div>
      <style>
        #ng_main{
          width:500px;
          height:500px;
          display:grid;
          grid-template-rows: 2fr 2fr 1fr;
        }
        #ng_main *{
          color:white;
        }
        #ng_input_area h2{
          margin:50px 0;
        }
        #ng_input_area > div{
          display:flex;
          gap:20px;
          justify-content:center;
          max-hight:100%;
          margin-top:30px;
        }
        #ng_input_area input[type="number"]{
          background-color:black;
          border-radius:5px;
          border:solid 2px #fc036f;
          height:40px;
          box-sizing:border-box;
          width:300px;
          padding:0 20px;
          -moz-appearance:textfield;
        }
        #ng_input_area input[type="number"]::-webkit-inner-spin-button,
        #ng_input_area input[type="number"]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        #ng_input_area button{
          width:120px;
          height:40px;
          border-radius:5px;
          background-color:#fc036f;
          color:white;
          font-size:15px;
          display:block;
          cursor:pointer;
        }
        #ng_para{
          display:grid;
          grid-template-columns:1fr 1fr;
          text-align:center;
        }
      </style>
    `;
    const gameDom = this.add.dom(250, 250).createFromHTML(gameCode);
  }
}
