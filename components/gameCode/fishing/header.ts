import { settingType } from "./setting";

export class header extends Phaser.GameObjects.DOMElement {
  header: HTMLDivElement;
  setting: settingType;
  headerMainObject: {
    state: {
      health: HTMLDivElement;
      hunger: HTMLDivElement;
    };
    items: {
      gameContainer: HTMLDivElement;
      itemNumberString: HTMLParagraphElement;
      itemName: string;
    }[];
    itemContainer: HTMLDivElement;
  };
  otherMainDomObj: {
    specialItemsImg: HTMLImageElement[];
  } = { specialItemsImg: [] };
  specialItems?: {
    itemName: string;
    canSetItem: string[];
    currentItem: null | string;
    setEvent: (newSet: string) => void;
  }[];

  constructor(
    scene: Phaser.Scene,
    setting: settingType,
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

    this.header = <HTMLDivElement>this.getChildByID("fm_header");

    //アイテム
    const itemGameObj = this.setting.playerState.items.map((oneItem, index) => {
      return this.makeHeaderItem(
        index,
        oneItem,
        <HTMLDivElement>this.getChildByID("fm_items")
      );
    });
    this.headerMainObject = {
      state: {
        health: <HTMLDivElement>this.getChildByID("fm_state_progress_health"),
        hunger: <HTMLDivElement>this.getChildByID("fm_state_progress_hunger"),
      },
      items: itemGameObj,
      itemContainer: <HTMLDivElement>this.getChildByID("fm_items"),
    };

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
  }

  updateSetting = (newSetting: settingType) => (this.setting = newSetting);

  preUpdate() {
    //ヘッダーを更新
    if (this.headerMainObject === undefined) return;
    this.headerMainObject.state.health.style.width = `${
      this.setting.playerState.health * 1.5
    }px`;
    this.headerMainObject.state.hunger.style.width = `${
      this.setting.playerState.hunger * 1.5
    }px`;
    //アイテムを更新
    let restItemList = this.setting.playerState.items;
    this.headerMainObject.items = this.headerMainObject.items.filter(
      (oneItem, index) => {
        const itemInfo = restItemList.find(
          (oneItemInfo) => oneItemInfo.name === oneItem.itemName
        );
        if (itemInfo === undefined) {
          this.headerMainObject?.items.splice(index, 1);
          return false;
        }
        oneItem.itemNumberString.innerHTML = itemInfo.count.toString();
        restItemList = restItemList.filter(
          (searchSubject) => searchSubject !== itemInfo
        );
        return true;
      }
    );
    //新規アイテムの作成
    restItemList.forEach((restItem, index) => {
      if (this.headerMainObject === undefined) return;
      this.headerMainObject.items.push(
        this.makeHeaderItem(
          this.headerMainObject?.items.length + index,
          restItem,
          this.headerMainObject.itemContainer
        )
      );
    });

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
  }

  makeHeaderItem(
    index: number,
    oneItemInfo: { name: string; count: number },
    item: HTMLDivElement
  ) {
    //ヘッダーのアイテムのUIを新規作成する。
    const parent = document.createElement("div");
    const image = document.createElement("img");
    image.src = `/chara/fishing/header/item/items/${oneItemInfo.name}.png`;
    const itemNumberString = document.createElement("p");
    itemNumberString.innerHTML = String(index);
    parent.appendChild(image);
    parent.appendChild(itemNumberString);
    item.appendChild(parent);
    return {
      gameContainer: parent,
      itemNumberString: itemNumberString,
      itemName: oneItemInfo.name,
    };
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
