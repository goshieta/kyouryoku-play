import { accountDataType } from "@/app/lib/types/accountType";
import styles from "./style.module.css";
import { useState } from "react";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { db, storage } from "@/app/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function Setting({ uData }: { uData: accountDataType }) {
  const [newUData, setNewUData] = useState(uData);
  const [base64Image, setBase64Image] = useState<string | null>(null);

  const handleInputFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    //ファイルサイズを10MBまでに制限
    if (file.size > ((10 * 1000) ^ 2)) {
      throw Error("ファイルサイズが大きすぎます。10MB以下にしてください。");
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setBase64Image(result); // 新しい画像を設定
      }
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async (base64Image: string) => {
    const storageRef = ref(storage, `userIcons/${uData.id}`);
    await uploadString(storageRef, base64Image, "data_url");
    return await getDownloadURL(storageRef);
  };

  const applySetting = async () => {
    const finalNewUData = newUData;
    if (base64Image) {
      try {
        const imgURL = await uploadImage(base64Image);
        newUData.profileImageUrl = imgURL;
      } catch (error) {
        throw Error("プロフィール画像のアップロードに失敗しました。");
      }
    }
    try {
      await setDoc(doc(db, "users", uData.id), finalNewUData);
    } catch {
      throw Error("ユーザー情報の更新に失敗しました。");
    }
    console.log("succeed!");
  };

  return (
    <>
      <table id={styles.setting_area}>
        <tbody>
          <tr>
            <th>
              <img
                src={base64Image ?? newUData.profileImageUrl}
                alt={`${newUData.name}の画像`}
                id={styles.account_img}
                width={100}
                height={100}
              />
            </th>
            <td id={styles.select_img_area}>
              <label htmlFor={styles.select_plofile_img}>
                プロフィール画像
              </label>
              <input
                type="file"
                id={styles.select_plofile_img}
                onChange={handleInputFile}
                accept="image/jpeg, image/png"
              />
            </td>
          </tr>
          <tr>
            <th>
              <p>アカウント名</p>
            </th>
            <td>
              <input
                type="text"
                value={newUData.name}
                onChange={(e) =>
                  setNewUData({ ...newUData, name: e.target.value })
                }
                placeholder="アカウント名を入力"
              />
            </td>
          </tr>
          <tr>
            <th>
              <p>アカウントの説明</p>
            </th>
            <td>
              <textarea
                value={newUData.description}
                onChange={(e) =>
                  setNewUData({ ...newUData, description: e.target.value })
                }
                placeholder="アカウントの説明を入力"
              />
            </td>
          </tr>
          <tr>
            <th></th>
            <td></td>
          </tr>
        </tbody>
      </table>
      <div id={styles.apply_area}>
        <button>
          <span className="material-symbols-outlined">cancel</span>キャンセル
        </button>
        <button onClick={applySetting}>
          <span className="material-symbols-outlined">check_circle</span>適用
        </button>
      </div>
    </>
  );
}
