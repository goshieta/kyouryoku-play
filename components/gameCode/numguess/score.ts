export class score extends Phaser.Scene {
  scoreData?: {
    times: number;
    seconds: number;
    level: number;
    judgement: boolean;
    correctNum: number;
  };

  constructor() {
    super({ key: "score" });
  }

  init(scoreData: {
    times: number;
    seconds: number;
    level: number;
    judgement: boolean;
    correctNum: number;
  }) {
    this.scoreData = scoreData;
  }

  create() {
    if (!this.scoreData) return;
    const score = Math.floor(
      this.scoreData.seconds +
        this.scoreData.times * 10 -
        (this.scoreData.judgement ? 0 : 100)
    );

    const scoreBoardCode = `
      <div id="ns_main">
        <div id="ns_overview">
          <h1>${
            this.scoreData.judgement ? "ゲームクリア！" : "ゲームオーバー"
          }</h1>
          <h2>${score}pt</h2>
        </div>
        <div id="ns_detail">
          <div>残り回数 : ${this.scoreData.times}</div>
          <div>残りタイム : ${Math.floor(this.scoreData.seconds)}</div>
          <div>正解 : ${this.scoreData.correctNum}</div>
        </div>
        <div id="ns_buttonArea">
          <button id="ns_goto_top">トップ</button>
        </div>
      </div>
      <style>
          #ns_main{
            width:500px;
            height:500px;
            display:flex;
            flex-flow:column;
            justify-content:center;
            align-items:center;
          }
          #ns_main *{
            color:white;
          }
          #ns_overview{
            margin:40px 0;
          }
          #ns_overview *{
            animation:appear 0.4s forwards;
            opacity:0;
          }
          #ns_overview *:nth-child(1){
            animation-delay:0.2s;
          }
          #ns_overview *:nth-child(2){
            animation-delay:0.8s;
          }
          #ns_detail{
            display:flex;
            margin:20px auto;
            border:solid 1px #fc036f;
            width:fit-content;
            border-radius:5px;
          }
          #ns_detail div{
            padding:20px 30px;
            height:20px;
            animation:appear 0.4s forwards;
            opacity:0;
          }
          #ns_detail div:nth-child(1){
            animation-delay:1.6s;
          }
          #ns_detail div:nth-child(2){
            animation-delay:2.0s;
          }
          #ns_detail div:nth-child(3){
            animation-delay:2.4s;
          }
          #ns_buttonArea button{
            width:200px;
            height:50px;
            border-radius:5px;
            background-color:#fc036f;
            color:white;
            font-size:15px;
            display:block;
            cursor:pointer;
            margin: 20px auto;
          }
          #ns_buttonArea button:hover{
            background-color:#c20054;
            transition:background-color 0.3s;
          }

          @keyframes appear{
            0%{
              transform:translateY(150px);
              opacity:0;
            }
            100%{
              transform:translateY(0px);
              opacity:1;
            }
          }
      </style>
    `;
    const scoreBoardDom = this.add.dom(250, 250).createFromHTML(scoreBoardCode);

    scoreBoardDom.getChildByID("ns_goto_top")?.addEventListener("click", () => {
      this.scene.start("title");
    });
  }
}
