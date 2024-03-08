import Filter from "@/components/community/filter";
import { useAuth } from "@/components/context/auth";
import styles from "@/styles/components/community.module.css";

//コミュニティグループの一覧画面
export default function CommunityAll() {
  return (
    <div id={styles.parent}>
      <div>
        <p>ID : {useAuth()?.id}</p>
        <p>名前 : {useAuth()?.name}</p>
        <p>メールアドレス : {useAuth()?.email}</p>
        <img src={useAuth()?.photoURL} alt="" />
      </div>
      <h1>コミュニティ</h1>
      <div id={styles.left}>
        <Filter></Filter>
      </div>
      <div id={styles.right}></div>
    </div>
  );
}
