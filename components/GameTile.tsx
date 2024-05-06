import styles from "@/styles/components/gameTile.module.css";
import gameInfo from "@/public/gameInfo.json";
import Image from "next/image";
import Link from "next/link";

type gameTilePropsType = {
  gameCode: string;
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
    <Link id={styles.tile} href={`/games/${thisGameInfo.gameCode}`}>
      <div id={styles.ImageArea}>
        <Image
          src={`/gamesImage/${thisGameInfo.gameCode}.svg`}
          alt={thisGameInfo.title}
          width={100}
          height={100}
          priority={true}
        />
      </div>
      <div id={styles.descriptionArea}>
        <h3>{thisGameInfo.title}</h3>
        <p>{thisGameInfo.description}</p>
      </div>
    </Link>
  );
}
