import Head from 'next/head'
import styles from '../styles/page.module.css'
import OneBlock from '@/components/OneBlock'

export default function Home() {
  return (
    <div>
      <Head>
        <title>峡緑プレイ | KyouRyoku Play</title>
        <meta name="description" content="世界で最もパワフルなーゲームアプリ" />
      </Head>
      <OneBlock backColor="#dca8ff" title="ゲームの秘密基地、ここから始まる冒険" link="/recommend">
      </OneBlock>
      <OneBlock backColor="#87c9ff" title="ゲーム一覧" link="/game">
      </OneBlock>
      <OneBlock backColor="#87ffd5" title="古典的なゲーム" link="/classic">
      </OneBlock>
      <OneBlock backColor="#ffe387" title="独自ゲーム" link="/new">
      </OneBlock>
    </div>
  )
}
