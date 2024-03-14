import { ReactNode } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function ChatRoomLayhout({ children }: { children: ReactNode }) {
  return (
    <div id="rootParent">
      <div id="noneFooterContent">
        <Header></Header>
        <div id="contentArea">{children}</div>
      </div>
    </div>
  );
}
