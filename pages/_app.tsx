import { AppProps } from 'next/app'
import Head from 'next/head'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import '@/styles/globals.css'

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <title>峡緑プレイ | KyouRyoku Play</title>
      <meta name='viewport' content='width=device-width, initial-scale=1' />
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
)

export default App