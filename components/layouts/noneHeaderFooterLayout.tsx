import { ReactNode } from "react";
import styles from "@/styles/world/worldLayout.module.css";
import Menu from "../top/menu";

export default function NoneHeaderFooterLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div id="rootParent">
      <Menu />
      <div id={styles.noneMenuContent}>
        <div id={styles.children}>{children}</div>
      </div>
    </div>
  );
}
