export class game extends Phaser.Scene {
  level: number;
  correctNumber: number;
  seconds: number;
  times: number;

  private domItem?: {
    seconds: Element;
    times: Element;
    input: HTMLInputElement;
    submitButton: Element;
  };

  constructor() {
    super({ key: "game" });

    this.level = 0;
    this.correctNumber = 0;
    this.seconds = 0;
    this.times = 0;
  }

  init(config: { level: number }) {
    this.level = config.level;

    this.seconds = 100 + this.level * 50;
    this.times = 10 + this.level * 5;
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
            <input type="number" id="ng_input"></input><button id="ng_submit">回答</button>
          </div>
        </div>
        <div id="ng_history"></div>
        <div id="ng_para">
          <div id="ng_seconds">
            <p>残り時間</p>
            <p id="ng_seconds_p">${this.seconds}</p>
          </div>
          <div id="ng_times">
            <p>残り回数</p>
            <p id="ng_times_p">${this.times}</p>
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

    this.domItem = {
      seconds: <Element>gameDom.getChildByID("ng_seconds_p"),
      times: <Element>gameDom.getChildByID("ng_times_p"),
      input: <HTMLInputElement>gameDom.getChildByID("ng_input"),
      submitButton: <Element>gameDom.getChildByID("ng_submit"),
    };

    //イベントを設定
    this.domItem.submitButton.addEventListener("click", () => {
      if (this.domItem === undefined) return;
      if (this.domItem.input.value === null) return;
      const result = this.parse(this.domItem.input.value, this.correctNumber);
      console.log(result);
    });
  }

  update(time: number, delta: number): void {
    this.seconds -= delta / 1000;

    if (this.domItem === undefined) return;
    this.domItem.seconds.innerHTML = String(Math.floor(this.seconds));
    this.domItem.times.innerHTML = String(this.times);
  }

  //入力された数字を答えと照らし合わせる
  parse(userAnswer: string, correctNumber: number) {
    const stringCorrectNumber = String(correctNumber);

    //例外処理
    const exceptionArray = [
      {
        regularExpression: `^.{${String(this.level + 3)}}$`,
        errorMessage: "桁数が違います",
      },
      {
        regularExpression: /^[0-9]+$/,
        errorMessage: "数字以外が含まれています",
      },
      {
        regularExpression: /^(?!.*(.).*\1)[^$]+$/,
        errorMessage: "重複した数字が存在します",
      },
    ];
    const errorMes: string[] = [];
    exceptionArray.forEach((oneException) => {
      const regularExpression = new RegExp(oneException.regularExpression);
      const isOk = regularExpression.test(userAnswer);
      if (!isOk) errorMes.push(oneException.errorMessage);
    });
    if (errorMes.length !== 0)
      return {
        errorMes: errorMes,
        round: 0,
        triangle: 0,
        correctNumber: correctNumber,
      };

    //マッチしている数を調べる
    const roundNumber = Array.from(stringCorrectNumber).reduce(
      (previousValue, currentValue, currentIndex) => {
        if (userAnswer[currentIndex] === currentValue)
          return String(Number(previousValue) + 1);
        else return previousValue;
      },
      "0"
    );
    const triangleNumber = Array.from(stringCorrectNumber).reduce(
      (previousValue, currentValue, currentIndex) => {
        const isMatch = Array.from(userAnswer).some(
          (val, index) => val === currentValue && index !== currentIndex
        );
        if (isMatch) return String(Number(previousValue) + 1);
        else return previousValue;
      },
      "0"
    );

    return {
      errorMes: errorMes,
      round: roundNumber,
      triangle: triangleNumber,
      correctNumber: correctNumber,
    };
  }
}
