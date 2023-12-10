export class checkingAnswer extends Phaser.Scene {
  problemCache?: {
    userAnswer: number;
    correctAnswer: number;
  }[];

  constructor() {
    super({
      key: "checkingAnswer",
    });
  }
  init(data: {
    problemCache: {
      userAnswer: number;
      correctAnswer: number;
    }[];
  }) {
    this.problemCache = data.problemCache;
  }

  create() {
    const tableCode = `
      <div id="ca_parent">
        <div>
          <h2>答え合わせ</h2>
          <table id="answer_table">
            <tr><td>番号</td><td>判定</td><td>あなたの答え</td><td>正しい答え</td></tr>
            ${this.problemCache
              ?.map((oneProblem, index) => {
                return `
              <tr>
                <td>第${index + 1}問</td>
                <td>${
                  oneProblem.correctAnswer === oneProblem.userAnswer
                    ? "〇"
                    : "×"
                }</td>
                <td>${oneProblem.userAnswer}</td>
                <td>${oneProblem.correctAnswer}</td>
              </tr>
              `;
              })
              .join("")}
          </table>
          <button id="ca_goTop">トップへ</button>
        </div>
      </div>
      <style>
        #ca_parent *{
          color:white;
        }
        #ca_parent{
          width:500px;
          height:500px;
          display:flex;
          justify-content:center;
          align-items:center;
        }
        #answer_table{
          border-collapse:collapse;
        }
        #answer_table th,#answer_table td{
          border:solid 1px #00ffa2;
          padding:10px;
        }
        #ca_goTop{
          cursor:pointer;
          width:180px;
          height:40px;
          font-size:18px;
          display:block;
          background-color:#00bf79;
          border-radius:5px;
          color:white;
          margin:30px auto;
        }
      </style>
    `;
    const answerDom = this.add.dom(250, 250).createFromHTML(tableCode);
    answerDom.getChildByID("ca_goTop")?.addEventListener("click", () => {
      this.scene.start("top");
    });
  }
}
