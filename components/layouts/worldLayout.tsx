import { ReactNode, createContext, useEffect, useMemo } from "react";
import Header from "../header/Header";
import styles from "@/styles/world/worldLayout.module.css";
import { useQueryState } from "next-usequerystate";
import Menu from "../top/menu";

export const CurrentTagContext = createContext<{
  currentTag: string | null;
  setCurrentTag: (val: string) => void;
} | null>(null);

export default function WorldLayout({ children }: { children: ReactNode }) {
  const [currentTag, setCurrentTag] = useQueryState("q");
  useEffect(() => {
    if (!currentTag) setCurrentTag("すべて");
  }, [currentTag]);
  const contextValue = useMemo(() => {
    return {
      currentTag: currentTag,
      setCurrentTag: setCurrentTag,
    };
  }, [currentTag]);

  return (
    <CurrentTagContext.Provider value={contextValue}>
      <div id="rootParent">
        <Menu />
        <div id={styles.noneMenuContent}>
          <Header />
          <div id={styles.children}>{children}</div>
        </div>
      </div>
    </CurrentTagContext.Provider>
  );
}
