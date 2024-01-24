import { AppProps } from "next/app";
import Head from "next/head";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import "@/styles/globals.css";
import Script from "next/script";

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <title>峡緑プレイ | KyouRyoku Play</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-CJT63ZRL0E"
      ></Script>
      <Script
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
        
          gtag('config', 'G-CJT63ZRL0E');
      `,
        }}
      ></Script>
    </Head>
    <div id="rootParent">
      <div id="noneFooterContent">
        <Header></Header>
        <div id="contentArea">
          <Component {...pageProps} />
        </div>
      </div>
      <Footer></Footer>
    </div>
  </>
);

export default App;
