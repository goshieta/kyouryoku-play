export default function othello(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (ctx == null) return;

  firstRender(canvas, ctx);
}

function firstRender(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  //背景
  ctx.fillStyle = "green";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //ボタンのテキスト
  ctx.font = "bold 24px Zen Kaku Gothic New";
  ctx.fillStyle = "white";
  ctx.fillText(
    "Player VS Player",
    (500 - ctx.measureText("Player VS Player").width) / 2,
    200
  );
  ctx.fillText(
    "Player VS Bot",
    (500 - ctx.measureText("Player VS Bot").width) / 2,
    400
  );
}
