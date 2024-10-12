import Footer from "@/app/component/common/Footer";
import Header from "@/app/component/common/Header";
import "@/app/style/globals.css";
import { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: "峡緑プレイ | KyouRyoku Play",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <div id="rootParent">
        <div id="noneFooterContent">
          <Header></Header>
          <div id="contentArea">{children}</div>
        </div>
        <Footer></Footer>
      </div>
      <GoogleAnalytics gaId="G-CJT63ZRL0E" />
    </html>
  );
}
