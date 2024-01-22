import sprite, { spriteMain } from "../components/sprite";

//一人でプレイが選択された際の相手
//盤面の状況が、入力されると、取る手を出力する。
export default function bot(situation: {
  me: spriteMain[];
  you: spriteMain[];
}): {
  targetSprite: sprite;
  targetDir: [number, number];
} | null {
  //通常は、常に一番速いやつで王を狙う。王の状態が危険な場合は、王を退避させる。
  //退避させる基準（しきい値）
  const threshold = 100;
  //王に一番近くの敵の距離
  const youKingPosi = [situation.you[13].sprite.x, situation.you[13].sprite.y];
  const nearEnemyDistance = situation.me.reduce(
    (previousDistance, currentEnemy) => {
      const distance = Math.sqrt(
        (currentEnemy.sprite.x - youKingPosi[0]) ** 2 +
          (currentEnemy.sprite.y - youKingPosi[1]) ** 2
      );
      return previousDistance > distance ? distance : previousDistance;
    },
    400
  );
  if (
    nearEnemyDistance < threshold &&
    situation.you[13].sprite.destination[0] == 0 &&
    situation.you[13].sprite.destination[1] == 0
  ) {
    //退避
    const youKing = situation.you[13].sprite;
    //退避先
    const evacuationPoint = {
      x: 600,
      y: 450,
    };
    return {
      targetSprite: youKing,
      targetDir: [evacuationPoint.x, evacuationPoint.y],
    };
  } else {
    //一番速い味方
    const bestOfYou = situation.you.reduce((previousYou, currentYou) =>
      previousYou.sprite.magnitude > currentYou.sprite.magnitude &&
      !currentYou.sprite.isKing &&
      currentYou.sprite.destination[0] === 0 &&
      currentYou.sprite.destination[1] === 0 &&
      previousYou.sprite.active
        ? currentYou
        : previousYou
    );
    const meKing = situation.me[13];
    return {
      targetSprite: bestOfYou.sprite,
      targetDir: [meKing.sprite.x, meKing.sprite.y],
    };
  }
}
