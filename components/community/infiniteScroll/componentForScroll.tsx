import { ReactElement, useCallback, useEffect, useRef, useState } from "react";

//チャットのために実装。上方向に無限スクロール。仮想スクロールも取り入れる。
export default function InfiniteScroll({
  data,
  moreLoad,
}: {
  data: ReactElement[];
  moreLoad: () => void;
}) {
  const forScrollToBottom = useRef<HTMLDivElement>(null);

  const [isBottom, setIsBottom] = useState<boolean | null>(null);

  const gotoBottom = useCallback(
    (behavior: ScrollBehavior) =>
      forScrollToBottom.current?.scrollIntoView({ behavior: behavior }),
    []
  );

  useEffect(() => {
    if (isBottom === null || isBottom) gotoBottom("smooth");
  });

  return (
    <div>
      {data}
      <div ref={forScrollToBottom}></div>
    </div>
  );
}
