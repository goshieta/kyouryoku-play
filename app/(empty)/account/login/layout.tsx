import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "ログイン - 峡緑プレイ",
};

export default function loginLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
