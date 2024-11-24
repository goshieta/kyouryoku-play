// ランクは10+10n（nはランクで整数）ポイントで一つ上がる。例えばランク1からランク2になるには20ポイント必要で、ランク3になるには30ポイント必要
// よって、ランク1〜nまでのポイント総和（必要なポイント数）は5n^2+5n-10ポイント {0,20,50,90,140...}
// この二次方程式を解いて、(-5+(225+20x)^1/2)/10の計算結果が算出されるランクとなる。（xはtotalPoints）

export default function calcLankFromPoints(
  totalPoints: number
): [rank: number, remainderPoint: number, thisRankRequirementPoint: number] {
  const rank = Math.floor((-5 + Math.sqrt(225 + 20 * totalPoints)) / 10);
  const remainderPoint = totalPoints - (5 * rank ** 2 + 5 * rank - 10);
  const thisRankRequirementPoint = 10 + 10 * rank;
  return [rank, remainderPoint, thisRankRequirementPoint] as [
    number,
    number,
    number
  ];
}
