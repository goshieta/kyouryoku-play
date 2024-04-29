import { db } from "@/lib/firebase/client";
import { isPubUserDataType, pubUserDataType } from "@/lib/types/communityType";
import { collection, doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function AccountInfo() {
  const router = useRouter();
  const [id, setid] = useState<string | null | undefined>(null);
  const [info, setInfo] = useState<pubUserDataType | null | undefined>(null);

  useEffect(() => {
    const id = router.query.accountID;
    if (typeof id === "string") setid(id);
    else if (typeof id === "object") setid(id[0]);
    else setid(id);
  }, [router]);

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
    <div>
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
          <h1>{info.name}</h1>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
