import styles from "@/styles/components/oneBlock.module.css"
import { ReactNode } from "react"

type propsType={
  backColor:string,
  title:string,
  link:string,
  children:ReactNode
}

export default function OneBlock(props:propsType){
  return (
    <div>
      <div id={styles.inBlock} style={{backgroundColor:props.backColor}}>
          <div id={styles.titleArea}>
              <h2>{ props.title }</h2>
              <a href={props.link}>一覧を見る &gt;</a>
          </div>
          {props.children}
        </div>
    </div>
  )
}