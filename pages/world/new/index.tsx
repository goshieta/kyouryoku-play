import styles from "@/styles/world/new/top.module.css";
import Image from "next/image";
import Link from "next/link";

export default function NewWorld() {
  return (
    <div id={styles.top}>
      <h1>投稿する</h1>
      <div id={styles.selectType}>
        <Link href="./new/post">
          <Image
            src="/navigation/world/post.svg"
            width={100}
            height={100}
            alt="つぶやき"
          />
          <p>つぶやき</p>
        </Link>
        <Link href="./new/article">
          <Image
            src="/navigation/world/article.svg"
            width={100}
            height={100}
            alt="つぶやき"
          />
          <p>記事</p>
        </Link>
      </div>
      <div id={styles.needHelp}>
        <Link href="/additional/about">
          <span className="material-symbols-outlined">help</span>
          使い方が分からないときはこちら
        </Link>
      </div>
    </div>
  );
}
