import GamePageTemp from "@/components/GamePageTemp";
import Image from "next/image";

export default function westeastbuttle() {
  return (
    <GamePageTemp
      title="東西大決戦"
      scenes={["load", "title", "game", "score"]}
      fileName="westeastbuttle"
      width={800}
      height={600}
      otherGames={["flash", "numguess", "othello", "flyfly"]}
      additionalConfig={{
        physics: {
          default: "arcade",
          arcade: {
            gravity: {},
          },
        },
        dom: {
          createContainer: true,
        },
      }}
    >
      <h2>遊び方</h2>
      <p>
        このゲームはゲーム画面に現れる矢印をクリックして操作することで遊びます。敵の王を倒すことができると勝ちです。
      </p>
      <p>
        ゲームは先手（青）と後手（赤）に分かれてします。プレイヤーは自分の色の矢印を自分のターンに好きなところに動かすことができます。すべての矢印にはその矢印の体力があり、敵の矢印と触れると体力が少なくなっていきます。0になるとその矢印は消滅します。また体力が小さい矢印のほうがより速く動くことができます。
      </p>
      <p>
        このゲームにはアイテムが5秒に一回ランダムに出現します。アイテムは矢印が触れることでその矢印のものになります。またアイテムによって効果がついた場合、その矢印にはその効果を表すマークが出ます。以下はアイテムの表です。
      </p>
      <table>
        <thead>
          <tr>
            <th>画像</th>
            <th>効果</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Image
                src="/chara/westeastbuttle/items/recovery.png"
                alt="回復"
                width={30}
                height={30}
              />
            </td>
            <td>体力が50回復します。</td>
          </tr>
          <tr>
            <td>
              <Image
                src="/chara/westeastbuttle/items/speedup.png"
                alt="速度上昇"
                width={30}
                height={30}
              />
            </td>
            <td>速度が速くなります。</td>
          </tr>
          <tr>
            <td>
              <Image
                src="/chara/westeastbuttle/items/protect.png"
                alt="盾"
                width={30}
                height={30}
              />
            </td>
            <td>体力が減るスピードが遅くなります。</td>
          </tr>
          <tr>
            <td>
              <Image
                src="/chara/westeastbuttle/items/stalker.png"
                alt="ストーカー"
                width={30}
                height={30}
              />
            </td>
            <td>操作ができなくなり、常に敵の王を追跡するようになります。</td>
          </tr>
        </tbody>
      </table>
    </GamePageTemp>
  );
}
