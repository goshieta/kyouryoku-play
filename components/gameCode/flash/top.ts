export class top extends Phaser.Scene {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super({ ...config, key: "top" });
  }
  create() {
    const backGround = this.add.graphics();
    backGround.fillStyle(0x000000, 1);
    backGround.fillRect(
      0,
      0,
      Number(this.game.config.width),
      Number(this.game.config.height)
    );

    const topFormCode = `
    <div id="ft_parent">
      <p>レベルを選択</p>
      <select name="level" id="ft_selLev">
        <option value="">ここを押して選択</option>
        <option value="1,1,5,5">レベル1 1桁5口5秒</option>
        <option value="2,1,10,10">レベル2 1桁10口10秒</option>
        <option value="3,1,5,3">レベル3 1桁5口3秒</option>
        <option value="4,1,10,5">レベル4 1桁10口5秒</option>
        <option value="5,2,5,5">レベル5 2桁5口5秒</option>
        <option value="6,2,10,10">レベル6 2桁10口10秒</option>
        <option value="7,2,10,7">レベル7 2桁10口7秒</option>
        <option value="8,2,10,5">レベル8 2桁10口5秒</option>
        <option value="9,3,5,5">レベル9 3桁5口5秒</option>
        <option value="10,3,10,10">レベル10 3桁10口10秒</option>
        <option value="11,3,10,9">レベル11 3桁10口9秒</option>
        <option value="12,3,10,7">レベル12 3桁10口7秒</option>
        <option value="13,3,10,5">レベル13 3桁10口5秒</option>
        <option value="14,3,15,10">レベル14 3桁15口10秒</option>
        <option value="15,3,15,8">レベル15 3桁15口8秒</option>
        <option value="16,3,15,6">レベル16 3桁15口6秒</option>
        <option value="17,3,15,4">レベル17 3桁15口4秒</option>
        <option value="18,4,15,10">レベル18 4桁15口10秒</option>
        <option value="19,4,20,10">レベル19 4桁20口10秒</option>
        <option value="20,5,20,5">レベル20 5桁20口5秒</option>
      </select>
      <button id="ft_start">スタート</button>
    </div>
    <style>
      #ft_parent p{
        color:#00ffa2;
        font-size:20px;
      }
      #ft_selLev{
        border-radius:3px;
        background-color:black;
        color:white;
        padding:10px 20px;
        border:solid 1px #00ffa2;
      }
      #ft_selLev option{
        color:white;
      }
      #ft_start{
        cursor:pointer;
        width:180px;
        height:40px;
        font-size:18px;
        display:block;
        background-color:#00bf79;
        border-radius:5px;
        color:white;
        margin:50px auto;
      }
      #ft_start:hover{
        background-color:#00b573;
        transition:background-color 0.2s;
      }
    </style>
    `;
    const topFormDom = this.add.dom(250, 250).createFromHTML(topFormCode);
    topFormDom.getChildByID("ft_start")?.addEventListener("click", () => {
      const levelValue: string = (<HTMLInputElement>(
        topFormDom.getChildByID("ft_selLev")
      )).value;
      if (levelValue === "") return;
      const splitValue = levelValue.split(",");
      this.scene.start("game", {
        level: splitValue[0],
        digit: splitValue[1],
        number: splitValue[2],
        second: splitValue[3],
        currentNumber: 1,
        cache: [],
      });
    });
  }
}
