import { settingType } from "./setting";

export class title extends Phaser.Scene {
  setting: settingType;

  constructor(config: Phaser.Types.Core.GameConfig) {
    super({ ...config, key: "title" });
    this.setting = {
      currentMapName: "蔵町",
      positionOfMap: "bus",
      playerState: {
        items: [],
        health: 100,
        hunger: 100,
      },
    };
  }

  create() {
    this.cameras.main.setBackgroundColor("#0384fc");

    const titleCode = `
      <div id="ft_parent">
        <div id="ft_buttonArea">
          <button id="ft_start_button">始める</button>
          <button id="ft_load_button">データをロード</button>
        </div>
      </div>
      <style>
        #ft_buttonArea button{
          display:block;
          width:300px;
          height:70px;
          border-radius:3px;
          font-size:17px;
          margin:50px;
          cursor:pointer;
          background-color:#99ceff;
          outline-color:#0384fc;
        }
        #ft_buttonArea button:hover{
          outline:solid 3px #5d00ff;
          transition:outline-color 0.5s;
        }
      </style>
    `;
    const titleDom = this.add.dom(450, 300).createFromHTML(titleCode);
    this.domEventManager(titleDom);
  }

  domEventManager(titleDom: Phaser.GameObjects.DOMElement) {
    titleDom.getChildByID("ft_start_button")?.addEventListener("click", () => {
      this.scene.start("map", this.setting);
    });
    titleDom
      .getChildByID("ft_load_button")
      ?.addEventListener("click", () => {});
  }
}
