import { useRouter } from "next/router";
import gameList from "@/gameCode/list.json";

function extractLastPath(url: string) {
  // クエリパラメータを取り除く
  const pathWithoutQuery = url.replace(/\?.*$/, "");

  // パスを '/' で分割し、最後の要素を取得
  const pathSegments = pathWithoutQuery.split("/");
  const lastPath = pathSegments[pathSegments.length - 1];

  return lastPath;
}

//JSONデータに対して型を強制させる
type gameListType = {
  [key: string]:
    | {
        width: number;
        height: number;
      }
    | undefined;
};
const typedGameList: gameListType = gameList;

export default function Game() {
  const router = useRouter();
  const name = extractLastPath(router.asPath);
  if (name === "[game]") return <></>;

  //ゲームリストを参照し、存在するならばゲームを定義するクラスをインポートする
  const gameObjSetting = typedGameList[name];
  if (gameObjSetting == undefined)
    return (
      <>
        <p>
          指定されたゲーム「{name}」は存在しません。URLを間違えていませんか？
        </p>
      </>
    );

  return (
    <>
      <p>{name}へようこそ！これはゲーム画面です</p>
    </>
  );
}
