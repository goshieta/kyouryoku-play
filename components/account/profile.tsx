import styles from "@/styles/pages/account.module.css";
import Image from "next/image";
import { userType } from "@/lib/types/communityType";
import { useState, useRef, useEffect, useCallback } from "react";
import { uploadFile } from "@/lib/firebase/fireStorage";
import createUUID from "@/lib/uuid";
import useMessage from "../tips/useMessage";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

const updateAuthInfo: (
  newInfo: Partial<userType>,
  user: userType
) => void = async (newInfo, user) => {
  const promiseArr = [];
  promiseArr.push(updateDoc(doc(db, "users", user.id), newInfo));
  promiseArr.push(updateDoc(doc(db, "pubUsers", user.id), newInfo));
  await Promise.all(promiseArr);
};

export default function Profile({ authInfo }: { authInfo: userType }) {
  const [show, Message] = useMessage();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  // input要素への参照を作成
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];

        if (file.size > 100 * 1024) {
          show("error", "ファイルサイズは100KB以下にしてください。");
          return;
        }

        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (typeof window !== "undefined" && e.target?.result) {
            const img = new window.Image();
            img.src = e.target.result.toString();
            img.onload = () => {
              if (img.width > 100 || img.height > 100) {
                show("error", "画像は100x100以下のサイズにしてください。");
              } else {
                setSelectedImage(file);
                // ここでサーバーに送信する処理を呼び出す
                uploadImage(file);
              }
            };
          }
        };
        reader.readAsDataURL(file);
      }
    },
    [selectedImage]
  );

  const triggerFileInput = () => {
    // refを使用してファイル入力をトリガー
    fileInputRef.current?.click();
  };

  const uploadImage = useCallback(
    (imageFile: File) => {
      // サーバーに画像をアップロードする処理をここに実装
      uploadFile(`userIcons/${createUUID()}`, imageFile).then((url) => {
        updateAuthInfo({ photoURL: url }, authInfo);
        return false;
      });
    },
    [updateAuthInfo]
  );

  //名前関連
  const [name, setName] = useState(authInfo.name);
  const [isReadOnly, setIsReadOnly] = useState(true);
  const handleNameChange = () => {
    if (isReadOnly) setIsReadOnly(false);
    else {
      setIsReadOnly(true);
      updateAuthInfo({ name: name }, authInfo);
    }
  };
  useEffect(() => {
    setName(authInfo.name);
  }, [authInfo]);

  return (
    <div id={styles.accountInfo}>
      <Message />
      <div id={styles.ai_image_area}>
        <button id={styles.editPhoto} onClick={triggerFileInput}>
          <Image
            src={
              selectedImage
                ? URL.createObjectURL(selectedImage)
                : authInfo.photoURL
            }
            alt="プロフィール画像"
            width={100}
            height={100}
          ></Image>
          <div>
            <span className="material-symbols-outlined">edit</span>
            {/* refを追加 */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>
        </button>
      </div>
      <div id={styles.ai_desc_area}>
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            readOnly={isReadOnly}
          />
          <button onClick={handleNameChange}>
            {isReadOnly ? (
              <span className="material-symbols-outlined">edit</span>
            ) : (
              <span className="material-symbols-outlined">check</span>
            )}
          </button>
        </div>
        <p>{authInfo.email}</p>
      </div>
    </div>
  );
}
