import styles from "@/styles/components/gameTile.module.css";
import Link from "next/link";
import gameInfo from "@/public/gameInfo.json";

type gameTilePropsType = {
  gameCode: string;
  size: "big" | "small";
};

export default function GameTile(props: gameTilePropsType) {
  type TypeGameInfo = {
    title: string;
    catchCopy?: string;
    description?: string;
    gameCode: string;
    color: string;
  };

  const onTypeGameInfo: {
    [key: string]: TypeGameInfo;
  } = gameInfo;

  const thisGameInfo = onTypeGameInfo[props.gameCode];

  return (
    <div
      id={styles.tile}
      className={styles[`tile_${props.size}`]}
      style={{
        ...(props.size == "big"
          ? {
              gridColumnStart: 1,
              gridColumnEnd: 3,
            }
          : {}),
      }}
    >
      <div id={styles.top}>
        <div id={styles.left}>
          {props.size == "big" ? <h2>{thisGameInfo.catchCopy}</h2> : <></>}
          <h3>{thisGameInfo.title}</h3>
          {props.size == "big" ? <p>{thisGameInfo.description}</p> : <></>}
          {props.size == "small" ? (
            <Link href={`/games/${thisGameInfo.gameCode}`}>プレイ ＞</Link>
          ) : (
            <></>
          )}
        </div>
        <div
          id={styles.right}
          className={props.size == "big" ? styles.big : ""}
        >
          <img
            src={`/gamesImage/${thisGameInfo.gameCode}.svg`}
            alt={thisGameInfo.title}
            width={100}
            height={100}
          />
        </div>
      </div>
      {props.size == "big" ? (
        <div id={styles.bottom}>
          <Link href={`/games/${thisGameInfo.gameCode}`}>プレイ ＞</Link>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
