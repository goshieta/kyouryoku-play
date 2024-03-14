import { AppProps } from "next/app";
import Head from "next/head";
import "@/styles/globals.css";
import "@/styles/globalicons.css";
import Script from "next/script";
import Auth from "@/components/context/auth";
import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";
import Layout from "@/components/layouts/layout";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);

  return (
    <Auth>
      <Head>
        <title>峡緑プレイ | KyouRyoku Play</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {getLayout(<Component {...pageProps} />)}
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-CJT63ZRL0E"
      ></Script>
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
        
          gtag('config', 'G-CJT63ZRL0E');
      `,
        }}
      ></Script>
    </Auth>
  );
};

export default App;
