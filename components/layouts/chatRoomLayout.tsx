import { ReactNode } from "react";

export default function ChatRoomLayhout({ children }: { children: ReactNode }) {
  return (
    <div id="rootParent">
      <div id="noneFooterContent">
        <div id="contentArea" style={{ padding: "0px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
