import { header } from "../header";

export default class itemsManage {
  items: {
    gameContainer: HTMLDivElement;
    itemNumberString: HTMLParagraphElement;
    itemName: string;
  }[];
  itemContainer: HTMLDivElement;

  headerClass: header;

  constructor(dom: HTMLDivElement, propHeader: header) {
    this.headerClass = propHeader;

    const itemGameObj = this.headerClass.setting.playerState.items.map(
      (oneItem, index) => {
        return this.makeHeaderItem(index, oneItem, dom);
      }
    );
    this.items = itemGameObj;
    this.itemContainer = dom;
  }

  update() {
    //アイテムを更新
    let restItemList = this.headerClass.setting.playerState.items;
    this.items = this.items.filter((oneItem, index) => {
      const itemInfo = restItemList.find(
        (oneItemInfo) => oneItemInfo.name === oneItem.itemName
      );
      if (itemInfo === undefined) {
        oneItem.gameContainer.remove();
        return false;
      }
      oneItem.itemNumberString.innerHTML = itemInfo.count.toString();
      restItemList = restItemList.filter(
        (searchSubject) => searchSubject !== itemInfo
      );
      return true;
    });
    //新規アイテムの作成
    restItemList.forEach((restItem, index) => {
      this.items.push(
        this.makeHeaderItem(
          this.items.length + index,
          restItem,
          this.itemContainer
        )
      );
    });
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

    //アイテムがクリックされたとき特定のイベントが発動する
    /*parent.addEventListener("click", async () => {
      type eventEventFunction = (
        setting: settingType,
        thisItemInfo: { name: string; count: number },
        itemHundle: (name: string, size: number) => void,
        specialItems:
          | {
              itemName: string;
              canSetItem: string[];
              currentItem: null | string;
              setEvent: (newSet: string) => void;
            }[]
          | undefined
      ) => void;
      //イベントは、3種類ある
      //1. すべてのアイテムに対して発動されるイベント
      const allItemEvent: {
        eventName: string;
        event: eventEventFunction;
      }[] = [
        {
          eventName: "捨てる",
          event(setting, thisItemInfo, itemHundle) {
            itemHundle(thisItemInfo.name, -1);
          },
        },
        {
          eventName: "何もしない",
          event() {},
        },
      ];
      const allItemEventName = allItemEvent.map((oneEve) => oneEve.eventName);
      //2. 特定のアイテムの固有のイベント
      const thisItmeInfo = putItemList(oneItemInfo.name);
      const thisItemEvent = thisItmeInfo
        ? thisItmeInfo.eventList
          ? thisItmeInfo.eventList
          : []
        : [];
      const thisItemEventName = thisItemEvent
        ? thisItemEvent.map((oneEve) => oneEve.eventName)
        : [];
      //3. スペシャルアイテムの設定イベント
      const allSpecialItemEvent = this.specialItems?.filter(
        (oneItem) => !oneItem.canSetItem.indexOf(oneItemInfo.name)
      );
      const specialItemEvent: {
        eventName: string;
        event: eventEventFunction;
      }[] = allSpecialItemEvent
        ? allSpecialItemEvent.map((oneEve) => {
            return {
              eventName: oneEve.itemName,
              event: (setting, thisItemInfo, itemHundle, specialItems) => {
                oneEve.currentItem = oneItemInfo.name;
                oneEve.setEvent(oneItemInfo.name);
              },
            };
          })
        : [];
      const specialItemEventName = specialItemEvent.map(
        (oneEve) => oneEve.eventName
      );

      const events = allItemEvent
        .concat(thisItemEvent)
        .concat(specialItemEvent);

      //ダイアログ見せちゃう
      const result = await this.showRichDialog(
        events.map((oneEve) => oneEve.eventName),
        this.getEventStopper(),
        this.setEventStopper,
        `このアイテムに対して何をしますか？`,
        `/chara/fishing/header/item/items/${oneItemInfo.name}.png`
      );
      events
        .find((oneEve) => oneEve.eventName === result)
        ?.event(
          this.setting,
          oneItemInfo,
          this.itemHundle.bind(this),
          this.specialItems
        );
    });*/

    return {
      gameContainer: parent,
      itemNumberString: itemNumberString,
      itemName: oneItemInfo.name,
    };
  }

  itemHundle(name: string, size: number) {
    //アイテムに関する操作を提供する
    //nameにアイテムの名前、sizeに増減の数を記述する
    const item = this.headerClass.setting.playerState.items.find(
      (oneItem) => oneItem.name === name
    );
    if (item === undefined) {
      if (size >= 0)
        this.headerClass.setting.playerState.items.push({
          name: name,
          count: size,
        });
      return;
    }
    item.count += size;
    if (item.count <= 0) {
      this.headerClass.setting.playerState.items =
        this.headerClass.setting.playerState.items.filter(
          (searchSubject) => searchSubject !== item
        );
    }
  }
}
