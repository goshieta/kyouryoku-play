interface Player {
  x: number;
  y: number;
  angle: number;
}

interface Ball {
  x: number;
  y: number;
}

//ボット。盤面の状況を入力すると、指示を返す
export default function bot(
  playerSituation: Player,
  ballSituation: Ball
): boolean {
  // Calculate angle between player and ball
  const dx = ballSituation.x - playerSituation.x;
  const dy = ballSituation.y - playerSituation.y;
  const angleToBallOrigin = Math.atan(dy / dx) * (180 / Math.PI);
  let angleToBall =
    Math.sign(dy) === 1
      ? xGetDegrees(180 - angleToBallOrigin)
      : xGetDegrees(360 - angleToBallOrigin);
  if (dx === 0 || dy === 0) {
    if (dx === 0) {
      if (dy < 0) angleToBall = 0;
      if (dy > 0) angleToBall = 180;
    }
    if (dy === 0) {
      if (dx < 0) angleToBall = 270;
      if (dx > 0) angleToBall = 90;
    }
  }

  // Check if difference between player angle and angle to ball is less than 10 degrees
  const angleDiff = Math.abs(angleToBall - xGetDegrees(playerSituation.angle));
  return angleDiff <= 10;
}

function xGetDegrees(nDegrees: number): number {
  nDegrees %= 360;
  if (nDegrees < 0) {
    nDegrees += 360;
  }
  return nDegrees;
}
