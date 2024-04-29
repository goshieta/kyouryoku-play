import Image from "next/image";
import { useState, useEffect } from "react";
import { isPubUserDataType, pubUserDataType } from "@/lib/types/communityType";
import { db } from "@/lib/firebase/client";
import { collection, doc, getDoc } from "firebase/firestore";

export default function PubProfile({ id }: { id: string | null | undefined }) {
  const [info, setInfo] = useState<pubUserDataType | null | undefined>(null);
  useEffect(() => {
    if (!id) return;
    getDoc(doc(collection(db, "pubUsers"), id))
      .then((data) => data.data())
      .then((data) => {
        if (isPubUserDataType(data)) setInfo(data);
        else setInfo(undefined);
      });
  }, [id]);

  return (
    <>
      {info === null ? <div>読み込み中</div> : <></>}
      {info === undefined ? <div>存在しないユーザーです</div> : <></>}
      {info ? (
        <div>
          <Image
            src={info.photoURL}
            alt={`${info.name}の写真`}
            width={70}
            height={70}
          />
          <div>
            <h1>{info.name}</h1>
            <p>{info.description}</p>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
