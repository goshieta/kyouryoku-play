import Footer from "@/components/Footer";
import Header from "@/components/header/Header";
import { ReactNode } from "react";
import Menu from "../top/menu";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div id="rootParent">
      <div id="includeMenu">
        <Menu />
        <div id="noneFooterContent">
          <Header></Header>
          <div id="contentArea">{children}</div>
          <Footer></Footer>
        </div>
      </div>
    </div>
  );
}
