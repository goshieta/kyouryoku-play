import { accountDataType } from "@/app/lib/types/accountType";
import styles from "./style.module.css";
import { useState } from "react";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { db, storage } from "@/app/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import useMessage from "@/app/lib/tips/useMessage/useMessage";
import { useRouter } from "next/navigation";

export default function Setting({ uData }: { uData: accountDataType }) {
  const [newUData, setNewUData] = useState(uData);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const { message, Element } = useMessage();
  const router = useRouter();

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
    const result = await message({
      message: "この情報は全世界に公開されます。よろしいですか？",
      button: [
        { value: "yes", name: "はい", icon: "check_circle" },
        { value: "no", name: "いいえ", icon: "cancel" },
      ],
    });
    if (result === "no") return;
    const finalNewUData = newUData;
    if (base64Image) {
      try {
        const imgURL = await uploadImage(base64Image);
        newUData.profileImageUrl = imgURL;
      } catch (error) {
        await message({
          message: "エラー：プロフィール画像の更新に失敗しました。",
          button: [{ name: "閉じる", value: "close" }],
        });
        return;
      }
    }
    try {
      await setDoc(doc(db, "users", uData.id), finalNewUData);
    } catch {
      await message({
        message: "エラー：ユーザー情報の更新に失敗しました。",
        button: [{ name: "閉じる", value: "close" }],
      });
      return;
    }
    console.log("succeed!");
  };

  const handleCancel = async () => {
    const result = await message({
      message: "キャンセルすると変更が失われます。本当にキャンセルしますか？",
      button: [
        { name: "はい", value: "yes", icon: "delete" },
        { name: "いいえ", value: "no", icon: "edit" },
      ],
    });
    if (result === "no") return;
    router.push("/account");
  };

  return (
    <>
      {Element}
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
        <button onClick={handleCancel}>
          <span className="material-symbols-outlined">cancel</span>キャンセル
        </button>
        <button onClick={applySetting}>
          <span className="material-symbols-outlined">check_circle</span>適用
        </button>
      </div>
    </>
  );
}
