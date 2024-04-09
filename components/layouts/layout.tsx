import Footer from "@/components/Footer";
import Header from "@/components/header/Header";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div id="rootParent">
      <div id="noneFooterContent">
        <Header></Header>
        <div id="contentArea">{children}</div>
      </div>
      <Footer></Footer>
    </div>
  );
}
