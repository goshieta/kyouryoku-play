import styles from "@/styles/world/world.module.css";

export default function Quote({
  title,
  user,
  body,
  target,
}: {
  title: string;
  user: string;
  body: string;
  target: string;
}) {
  //リンクなども実装したい
  return (
    <div id={styles.quote}>
      <h4>{title}</h4>
      <p>{body}</p>
    </div>
  );
}
