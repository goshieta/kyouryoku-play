import putItemList from "../itemList";
import { settingType } from "../setting";
import iconsManage from "./header/items";
import stateManage from "./header/state";

export class header extends Phaser.GameObjects.DOMElement {
  header: HTMLDivElement;
  setting: settingType;
  otherMainDomObj: {
    specialItemsImg: HTMLImageElement[];
  } = { specialItemsImg: [] };
  specialItems?: {
    itemName: string;
    canSetItem: string[];
    currentItem: null | string;
    setEvent: (newSet: string) => void;
  }[];
  getEventStopper: () => boolean;
  setEventStopper: (newVal: boolean) => any;
  itemHundle: (name: string, size: number) => void;

  //管理クラス
  domMangeClass: {
    state: stateManage;
    items: iconsManage;
  };

  constructor(
    scene: Phaser.Scene,
    setting: settingType,
    getEventStopper: () => boolean,
    setEventStopper: (newVal: boolean) => any,
    additionalSetting?: {
      specialItem?: {
        itemName: string;
        //セットできるアイテムの名前を書いた配列
        canSetItem: string[];
        //セットされたときに発動するイベント
        setEvent: (newSet: string) => void;
      }[];
    }
  ) {
    super(scene, 450, 300);
    this.createFromCache("mapDom");
    scene.add.existing(this);
    this.setting = setting;
    this.getEventStopper = getEventStopper;
    this.setEventStopper = setEventStopper;

    this.header = <HTMLDivElement>this.getChildByID("fm_header");

    //スペシャルなアイテム
    if (
      additionalSetting !== undefined &&
      additionalSetting.specialItem !== undefined
    ) {
      this.specialItems = additionalSetting.specialItem.map((oneItem) => {
        return { ...oneItem, currentItem: null };
      });
      const parentDiv = <HTMLDivElement>this.getChildByID("fm_special_item");
      parentDiv.style.display = "flex";
      this.specialItems.forEach((oneItem) => {
        const template = <HTMLTemplateElement>(
          parentDiv.querySelector("#fm_special_item_temp")
        );
        const clone = <HTMLDivElement>template.content.cloneNode(true);
        (<HTMLParagraphElement>clone.querySelector("p")).innerHTML =
          oneItem.itemName;
        this.otherMainDomObj.specialItemsImg.push(
          <HTMLImageElement>clone.querySelector("div")
        );
        parentDiv.appendChild(clone);
      });
    }

    //管理クラスの管理
    this.domMangeClass = {
      state: new stateManage(
        <HTMLDivElement>this.header.querySelector("#fm_state"),
        this
      ),
      items: new iconsManage(
        <HTMLDivElement>this.header.querySelector("#fm_items"),
        this
      ),
    };

    //メソッドの登録
    this.itemHundle = this.domMangeClass.items.itemHundle.bind(
      this.domMangeClass.items
    );
  }

  updateSetting = (newSetting: settingType) => (this.setting = newSetting);

  preUpdate() {
    //スペシャルアイテムの更新
    if (this.specialItems !== undefined) {
      this.specialItems.map((oneItem, index) => {
        if (oneItem === null)
          this.otherMainDomObj.specialItemsImg[index].src = "";
        else
          this.otherMainDomObj.specialItemsImg[
            index
          ].src = `/chara/fishing/item/items/${oneItem.itemName}.png`;
      });
    }

    //管理クラスのアップデート
    this.domMangeClass.state.update();
    this.domMangeClass.items.update();
  }

  showDialog(choices: string[]): Promise<string> | undefined {
    //イベントをプロミスで処理する
    const dialogElement = this.getChildByID("fm_dialog");
    const centerDialogElement = this.getChildByID("fm_dialog_center");
    this.setPosition(450, 300);
    dialogElement?.setAttribute("style", "display:block;");
    if (centerDialogElement === null || centerDialogElement === undefined)
      return;

    return new Promise((resolve) => {
      choices.forEach((val) => {
        const button = document.createElement("button");
        button.innerHTML = val;
        button.addEventListener("click", () => {
          centerDialogElement.innerHTML = "";
          dialogElement?.setAttribute("style", "display:none;");

          resolve(val);
        });
        centerDialogElement?.appendChild(button);
      });
    });
  }

  showRichDialog(
    choices: string[],
    eventStopper: boolean,
    setEventStopper: (newEventStopper: boolean) => void,
    desc?: string,
    imagePath?: string
  ) {
    if (eventStopper) return;
    setEventStopper(false);
    //リッチなダイアログ
    const dialog = <HTMLDivElement>this.getChildByID("fm_rich_dialog");
    dialog.style.display = "flex";
    const descArea = <HTMLDivElement>dialog.querySelector("#fm_descArea");
    if (desc !== undefined || imagePath !== undefined) {
      descArea.style.display = "flex";
      const img = <HTMLImageElement>descArea.querySelector("#fm_desc_img");
      const p = <HTMLPreElement>descArea.querySelector("#fm_desc_p");
      img.style.display = "none";
      p.style.display = "none";
      if (imagePath !== undefined) {
        img.style.display = "block";
        img.src = imagePath;
      }
      if (desc !== undefined) {
        p.style.display = "block";
        p.innerHTML = desc;
      }
    } else {
      descArea.style.display = "none";
    }
    //ボタンを表示
    const buttonArea = <HTMLDivElement>(
      dialog.querySelector("#fm_dialog_button_area")
    );
    setEventStopper(false);
    return new Promise((resolve) => {
      choices.forEach((val) => {
        const button = document.createElement("button");
        button.innerHTML = val;
        button.addEventListener("click", () => {
          buttonArea.innerHTML = "";
          dialog?.setAttribute("style", "display:none;");

          resolve(val);
        });
        buttonArea.appendChild(button);
      });
    });
  }
}
