import Footer from "@/app/component/common/Footer";
import Header from "@/app/component/common/header/Header";
import "@/app/style/globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "峡緑プレイ | KyouRyoku Play",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div id="rootParent">{children}</div>;
}
