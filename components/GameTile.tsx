import styles from "@/styles/components/gameTile.module.css";
import Link from "next/link";
import gameInfo from "@/public/gameInfo.json";
import Image from "next/image";

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
      <div
        id={styles.top}
        className={props.size == "big" ? styles.bigTile : styles.smallTile}
      >
        <div id={styles.left}>
          <h2>{thisGameInfo.catchCopy}</h2>
          <h3>{thisGameInfo.title}</h3>
          <p>{thisGameInfo.description}</p>
          <Link href={`/games/${thisGameInfo.gameCode}`}>プレイ ＞</Link>
        </div>
        <div
          id={styles.right}
          className={props.size == "big" ? styles.big : ""}
        >
          <Image
            src={`/gamesImage/${thisGameInfo.gameCode}.svg`}
            alt={thisGameInfo.title}
            width={100}
            height={100}
          />
        </div>
      </div>
      <div
        id={styles.bottom}
        className={props.size == "big" ? styles.bigTile : styles.smallTile}
      >
        <Link href={`/games/${thisGameInfo.gameCode}`}>プレイ ＞</Link>
      </div>
    </div>
  );
}
