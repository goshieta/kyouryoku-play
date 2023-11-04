import styles from "@/styles/components/gameTile.module.css";

type gameTilePropsType = {
  themeColor: String;
  gameTitle: String;
  gamePhrase?: String;
  gameDesc?: String;
  link: String;
  imgLink?: String;
};

export default function GameTile(props: gameTilePropsType) {
  return <div id={styles.tile}></div>;
}
