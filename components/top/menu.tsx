import Link from "next/link";
import styles from "@/styles/page.module.css";
import { useRouter } from "next/router";

export default function Menu() {
  const menuList = [
    { href: "/", icon: "home", title: "トップ" },
    { href: "/world", icon: "globe_asia", title: "ワールド" },
    { href: "/games", icon: "sports_esports", title: "ゲーム" },
    { href: "/additional/about", icon: "help", title: "ヘルプ" },
  ];

  const root = useRouter();

  return (
    <div id={styles.menu}>
      {menuList.map((oneElem) => (
        <Link
          href={oneElem.href}
          key={oneElem.title}
          className={root.asPath === oneElem.href ? styles.active_link : ""}
        >
          <span className="material-symbols-outlined">{oneElem.icon}</span>
          {oneElem.title}
        </Link>
      ))}
    </div>
  );
}
