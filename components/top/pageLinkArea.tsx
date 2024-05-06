import styles from "@/styles/page.module.css";
import Image from "next/image";
import Link from "next/link";

export default function PageLinkArea() {
  const links = [
    { name: "アカウント", href: "/account", imgName: "person" },
    { name: "ゲーム", href: "/games", imgName: "sports_esports" },
    { name: "ワールド", href: "/world", imgName: "globe_asia", special: true },
    { name: "ヘルプ", href: "/additional/about", imgName: "help" },
    { name: "レポート", href: "/additional/report", imgName: "report" },
  ];
  return (
    <div id={styles.summaryPageLink}>
      {links.map((oneLink) => (
        <Link
          href={oneLink.href}
          id={styles.onePageLink}
          className={oneLink.special ? styles.specialLink : ""}
          key={oneLink.name}
        >
          <span className="material-symbols-outlined">{oneLink.imgName}</span>
          <p>{oneLink.name}</p>
        </Link>
      ))}
    </div>
  );
}
