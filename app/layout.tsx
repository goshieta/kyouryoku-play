import Footer from "@/app/component/common/Footer";
import Header from "@/app/component/common/header/Header";
import "@/app/style/globals.css";
import { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: "峡緑プレイ | KyouRyoku Play",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <div id="rootParent">
          <div id="noneFooterContent">
            <Header></Header>
            <div id="contentArea">{children}</div>
          </div>
          <Footer></Footer>
        </div>
      </body>
      <GoogleAnalytics gaId="G-QD7XXSJW1P" />
    </html>
  );
}
