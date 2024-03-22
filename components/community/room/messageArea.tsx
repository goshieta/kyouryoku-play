import { useEffect, useRef } from "react";

//マインドマップ形式でメッセージを表示する
export default function MessageArea() {
  const belowCanvas = useRef<HTMLCanvasElement>(null);

  const setCanvasSize = () => {
    if (!belowCanvas.current) return;
    const screenXY = [window.innerWidth, window.innerHeight];
    belowCanvas.current.width = screenXY[0];
    belowCanvas.current.height = screenXY[1];
  };
  useEffect(() => {
    if (!belowCanvas.current) return;
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);
    return () => window.removeEventListener("resize", setCanvasSize);
  }, [belowCanvas]);

  return <canvas ref={belowCanvas}></canvas>;
}
