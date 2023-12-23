export class title extends Phaser.Scene {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super({ ...config, key: "title" });
  }
  create() {
    const titleCode = `
      <div id="nt_title">
        <button>初級</button>
        <button>中級</button>
        <button>上級</button>
      </div>
      <style>
        #nt_title{
          width:500px;
          height:500px;
          display:flex;
          flex-flow:column;
          align-items:center;
          justify-content:center;
          gap:50px;
        }
        #nt_title button{
          width:200px;
          height:50px;
          border-radius:5px;
          background-color:#fc036f;
          color:white;
          font-size:15px;
          display:block;
          cursor:pointer;
        }
        #nt_title button:hover{
          width:220px;
          transition: width 0.3s; 
        }
      </style>
    `;
    const titleDom = this.add.dom(250, 250).createFromHTML(titleCode);
    const titleDiv = titleDom.getChildByID("nt_title");
    if (titleDiv !== null)
      Array.from(titleDiv.children).forEach((oneButton, level) => {
        oneButton.addEventListener("click", () => {
          this.scene.start("game", { level: level });
        });
      });
  }
}
