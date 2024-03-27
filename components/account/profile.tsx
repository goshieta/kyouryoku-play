import styles from "@/styles/pages/account.module.css";
import Image from "next/image";
import { userType } from "@/lib/types/communityType";
import { useState, useRef } from "react";

export default function Profile({ authInfo }: { authInfo: userType }) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  // input要素への参照を作成
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size > 100 * 1024) {
        alert("ファイルサイズは100KB以下にしてください。");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (typeof window !== "undefined" && e.target?.result) {
          const img = new window.Image();
          img.src = e.target.result.toString();
          img.onload = () => {
            if (img.width > 100 || img.height > 100) {
              alert("画像は100x100以下のサイズにしてください。");
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
  };

  const triggerFileInput = () => {
    // refを使用してファイル入力をトリガー
    fileInputRef.current?.click();
  };

  const uploadImage = (imageFile: File) => {
    // サーバーに画像をアップロードする処理をここに実装
    console.log("サーバーにアップロードする画像:", imageFile);
    // 実際のアップロード処理は省略
  };

  return (
    <div id={styles.accountInfo}>
      <div id={styles.ai_image_area}>
        <button id={styles.editPhoto} onClick={triggerFileInput}>
          <Image
            src={authInfo.photoURL}
            alt="プロフィール画像"
            width={100}
            height={100}
          ></Image>
          <div>
            <span className="material-symbols-outlined">edit</span>
            {/* refを追加 */}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
          </div>
        </button>
      </div>
      <div id={styles.ai_desc_area}>
        <div>
          <h3>{authInfo.name}</h3>
          <button>
            <span className="material-symbols-outlined">edit</span>
          </button>
        </div>
        <p>{authInfo.email}</p>
      </div>
    </div>
  );
}
