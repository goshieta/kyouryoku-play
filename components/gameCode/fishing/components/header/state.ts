import { header } from "../header";

export default class stateManage {
  dom: HTMLDivElement;
  private headerClass: header;
  stateDom: {
    health: HTMLDivElement;
    hunger: HTMLDivElement;
  };

  constructor(dom: HTMLDivElement, propHeader: header) {
    this.dom = dom;
    this.headerClass = propHeader;
    this.stateDom = {
      health: <HTMLDivElement>dom.querySelector("#fm_state_progress_health"),
      hunger: <HTMLDivElement>dom.querySelector("#fm_state_progress_hunger"),
    };
  }
  update() {
    //ヘッダーを更新
    this.stateDom.health.style.width = `${
      this.headerClass.setting.playerState.health * 1.5
    }px`;
    this.stateDom.hunger.style.width = `${
      this.headerClass.setting.playerState.hunger * 1.5
    }px`;
  }
}
