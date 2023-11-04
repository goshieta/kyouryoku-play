import styles from "@/styles/components/gameTile.module.css";

type gameTilePropsType = {
  themeColor: string;
  gameTitle: string;
  size: "big" | "small";
  gamePhrase?: string;
  gameDesc?: string;
  link: string;
  imgLink?: string;
};

export default function GameTile(props: gameTilePropsType) {
  return (
    <div
      id={styles.tile}
      style={{
        backgroundColor: props.themeColor,
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
          {props.size == "big" ? <h2>{props.gamePhrase}</h2> : <></>}
          <h3>{props.gameTitle}</h3>
          {props.size == "big" ? <p>{props.gameDesc}</p> : <></>}
          {props.size == "small" ? <a href={props.link}>プレイ ＞</a> : <></>}
        </div>
        <div
          id={styles.right}
          className={props.size == "big" ? styles.big : ""}
        >
          {props.imgLink != undefined ? (
            <img
              src={props.imgLink}
              alt={props.gameTitle}
              width={150}
              height={150}
            />
          ) : (
            <div></div>
          )}
        </div>
      </div>
      {props.size == "big" ? (
        <div id={styles.bottom}>
          <a href={props.link}>プレイ ＞</a>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
