import CommunityCard from "@/components/community/communityCard";
import styles from "@/styles/components/community.module.css";
import { useEffect, useState } from "react";
import { communityType } from "@/lib/types/communityType";
import { useAuth } from "@/components/context/auth";
import { useRouter } from "next/router";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import createUUID from "@/lib/uuid";

export default function New() {
  const authInfo = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authInfo) {
      router.push("/");
    }
  }, []);

  const [newCom, setNewCom] = useState<communityType>({
    admin: authInfo ? authInfo.id : "unknown",
    icon: "",
    name: "",
    description: "",
    createdAt: new Date().getTime(),
    id: createUUID(),
    topic: "",
    people: authInfo ? [authInfo.id] : [],
  });
  type errorInfoType = {
    icon: string[];
    name: string[];
    description: string[];
    topic: string[];
  };
  const [errorInfo, setErrorInfo] = useState<errorInfoType>({
    icon: [],
    name: [],
    description: [],
    topic: [],
  });

  const checkErrorInfo = (val: any): val is errorInfoType => {
    return (
      val.icon !== undefined &&
      val.name !== undefined &&
      val.description !== undefined &&
      val.topic !== undefined
    );
  };

  const checkError = (): boolean => {
    //コミュニティのデータ形式が正しいか確かめる。正規表現で。
    const checkArr: { [key: string]: { regEx: RegExp; error: string }[] } = {
      icon: [
        { regEx: /^$/u, error: "文字を入力してください。" },
        { regEx: /.{2,}/u, error: "1文字より多く入力しないでください。" },
      ],
      name: [
        { regEx: /^$/u, error: "文字を入力してください。" },
        { regEx: /.{11,}/u, error: "10文字より多く入力しないでください。" },
      ],
      description: [
        { regEx: /^$/u, error: "文字を入力してください。" },
        { regEx: /.{41,}/u, error: "40文字より多く入力しないでください。" },
      ],
      topic: [
        { regEx: /^$/u, error: "文字を入力してください。" },
        { regEx: /.{21,}/u, error: "20文字より多く入力しないでください。" },
      ],
    };
    const newErrorInfo: { [key: string]: string[] } = {
      icon: [],
      name: [],
      description: [],
      topic: [],
    };
    Object.keys(checkArr).forEach((oneItem) => {
      const regArray = checkArr[oneItem];
      const copyNewCom: { [key: string]: string | number | string[] } = newCom;
      regArray.forEach((oneReg) => {
        const data = copyNewCom[oneItem];
        if (typeof data !== "string") return;
        if (oneReg.regEx.test(data)) {
          newErrorInfo[oneItem].push(oneReg.error);
        }
      });
    });
    if (checkErrorInfo(newErrorInfo)) {
      setErrorInfo(newErrorInfo);
    }
    return (
      newErrorInfo.icon.length === 0 &&
      newErrorInfo.name.length === 0 &&
      newErrorInfo.description.length === 0 &&
      newErrorInfo.topic.length === 0
    );
  };

  const createCommunity = async () => {
    if (!checkError()) return;
    //コミュニティを登録する。
    await setDoc(doc(db, "community", newCom.id), newCom);
    router.back();
  };

  return (
    <div id={styles.new_community}>
      <h1>コミュニティを作成</h1>
      <div id={styles.nc_preview}>
        <CommunityCard communityInfo={newCom} preview={true}></CommunityCard>
      </div>
      <div id={styles.nc_form}>
        <div id={styles.ncf_text}>
          <div>
            <label>シンボルの文字&nbsp;:</label>
            <input
              type="text"
              value={newCom.icon}
              onChange={(e) => setNewCom({ ...newCom, icon: e.target.value })}
            ></input>
          </div>
          <div
            className={styles.error}
            style={{ display: errorInfo.icon.length == 0 ? "none" : "block" }}
          >
            {errorInfo.icon.map((oneError, index) => (
              <p key={`error_icon_${oneError}_${index}`}>{oneError}</p>
            ))}
          </div>
          <div>
            <label>名前&nbsp;:</label>
            <input
              type="text"
              value={newCom.name}
              onChange={(e) => setNewCom({ ...newCom, name: e.target.value })}
            ></input>
          </div>
          <div
            className={styles.error}
            style={{ display: errorInfo.name.length == 0 ? "none" : "block" }}
          >
            {errorInfo.name.map((oneError, index) => (
              <p key={`error_name_${oneError}_${index}`}>{oneError}</p>
            ))}
          </div>
          <div>
            <label>説明&nbsp;:</label>
            <input
              type="text"
              value={newCom.description}
              onChange={(e) =>
                setNewCom({ ...newCom, description: e.target.value })
              }
            ></input>
          </div>
          <div
            className={styles.error}
            style={{
              display: errorInfo.description.length == 0 ? "none" : "block",
            }}
          >
            {errorInfo.description.map((oneError, index) => (
              <p key={`error_description_${oneError}_${index}`}>{oneError}</p>
            ))}
          </div>
          <div>
            <label>最初のトピック&nbsp;:</label>
            <input
              type="text"
              value={newCom.topic}
              onChange={(e) => setNewCom({ ...newCom, topic: e.target.value })}
            ></input>
          </div>
          <div
            className={styles.error}
            style={{
              display: errorInfo.topic.length == 0 ? "none" : "block",
            }}
          >
            {errorInfo.topic.map((oneError, index) => (
              <p key={`error_description_${oneError}_${index}`}>{oneError}</p>
            ))}
          </div>
        </div>
        <button onClick={createCommunity}>作成</button>
      </div>
    </div>
  );
}
