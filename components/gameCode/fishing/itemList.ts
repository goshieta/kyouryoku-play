type itemType = {
  name: string;
  number: number;
};
type itemListType = itemType[];

//オーバーロード
export default function putItemList(): itemListType;
export default function putItemList(name: string): itemType | undefined;

export default function putItemList(
  name?: string
): itemListType | itemType | undefined {
  const itemList: itemListType = [
    {
      name: "coin",
      number: 0,
    },
    {
      name: "rowFluit",
      number: 1,
    },
    {
      name: "treeFluit",
      number: 2,
    },
    {
      name: "aoiisome",
      number: 3,
    },
    {
      name: "redIsome",
      number: 4,
    },
    {
      name: "chirori",
      number: 5,
    },
    {
      name: "stoneLugworm",
      number: 6,
    },
  ];

  if (name === undefined) return itemList;
  else return itemList.find((oneItem) => oneItem.name === name);
}
