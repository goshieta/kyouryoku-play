import imageUpload from "@/lib/tips/imageUpload";
import { pubUserDataType, userType } from "@/lib/types/communityType";
import createUUID from "@/lib/uuid";
import styles from "@/styles/account/signup.module.css";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import useMessage from "../tips/useMessage";
import Loading from "../tips/loading";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export default function SignUp({
  userInfo,
  setSignUp,
}: {
  userInfo: userType;
  setSignUp: (value: boolean) => void;
}) {
  const [newAccountInfo, setnewAccountInfo] = useState<userType>(userInfo);
  const [uploading, setUploading] = useState(false);
  const [alert, Message] = useMessage();

  const close = () => {
    const newPubUserInfo: pubUserDataType = {
      createdAt: newAccountInfo.createdAt,
      id: newAccountInfo.id,
      name: newAccountInfo.name,
      photoURL: newAccountInfo.photoURL,
      description: newAccountInfo.description,
    };
    setSignUp(false);
    updateDoc(doc(db, "users", newAccountInfo.id), newAccountInfo);
    updateDoc(doc(db, "pubUsers", newAccountInfo.id), newPubUserInfo);
  };

  const contents = [
    {
      body: (
        <div id={styles.accountName}>
          <h2>峡緑プレイへようこそ</h2>
          <p>アカウント名はこれでよろしいですか？</p>
          <input
            type="text"
            value={newAccountInfo.name}
            onChange={(e) =>
              setnewAccountInfo({ ...newAccountInfo, name: e.target.value })
            }
          />
        </div>
      ),
    },
    {
      body: (
        <div id={styles.accountDescription}>
          <p>アカウントの説明を追加しましょう。</p>
          <textarea
            value={newAccountInfo.description}
            onChange={(e) =>
              setnewAccountInfo({
                ...newAccountInfo,
                description: e.target.value,
              })
            }
          />
        </div>
      ),
    },
    {
      body: (
        <div id={styles.accountImage}>
          <p>
            アカウントの画像はこれでいいですか？（この画像は全世界に配信されます）
          </p>
          {!uploading ? (
            <Image
              src={newAccountInfo.photoURL}
              width={100}
              height={100}
              alt="アカウント画像の読み込みに失敗しました"
            />
          ) : (
            <Loading type="small" />
          )}
          <input
            type="file"
            onChange={async (e) => {
              setUploading(true);
              const url = await imageUpload(
                e,
                100,
                100,
                `userIcons/${createUUID()}`
              );
              if (url) {
                setnewAccountInfo({ ...newAccountInfo, photoURL: url });
              } else {
                alert("error", "ファイルのアップロードに失敗しました");
              }
              setUploading(false);
            }}
          />
        </div>
      ),
    },
    {
      body: (
        <div id={styles.allComplete}>
          <p>すべての設定が完了しました！</p>
          <p>使い方がわからない場合はヘルプなどを見てください</p>
          <Link href="/">ヘルプ</Link>
          <Link href="/">トップ</Link>
        </div>
      ),
    },
  ];
  const [currentContentsNumber, setCurrentContentsNumber] = useState(0);

  return (
    <>
      <Message />
      <div id={styles.shadow}>
        <div id={styles.parent}>
          <div id={styles.header}>
            <h2>初期設定</h2>
            <button onClick={close}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div id={styles.content}>{contents[currentContentsNumber].body}</div>
          <div id={styles.operation}>
            {currentContentsNumber != 0 && (
              <button
                onClick={() => {
                  setCurrentContentsNumber(currentContentsNumber - 1);
                }}
              >
                戻る
              </button>
            )}
            {currentContentsNumber != contents.length - 1 ? (
              <button
                onClick={() => {
                  setCurrentContentsNumber(currentContentsNumber + 1);
                }}
              >
                次へ
              </button>
            ) : (
              <button onClick={close}>終了</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
