import styles from "@/styles/world/new/post.module.css";

export default function newPost() {
  return (
    <div id={styles.post}>
      <h1>つぶやく</h1>
      <input type="text" placeholder="タグをスペース区切りで入力" />
      <textarea placeholder="内容を入力" />
    </div>
  );
}
