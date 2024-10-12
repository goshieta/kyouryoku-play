import styles from "@/app/style/page/game.module.css";

export default function GameScreen({
  id,
  width,
  height,
}: {
  id: string;
  width: number;
  height: number;
}) {
  return (
    <div id={styles.game_screen}>
      <iframe
        src={`/api/games/${id}/index.html`}
        loading="lazy"
        width={width}
        height={height}
        id={styles.screen_iframe}
      ></iframe>
    </div>
  );
}
