import Image from "next/image";
import { pubUserDataType } from "@/lib/types/communityType";
import styles from "@/styles/account/profile.module.css";
import { useAuth } from "../context/auth";
import { useEffect, useRef, useState } from "react";
import createUUID from "@/lib/uuid";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export default function PubProfile({
  info,
}: {
  info: pubUserDataType | null | undefined;
}) {
  return (
    <>
      {info === null ? <div>読み込み中</div> : <></>}
      {info === undefined ? <div>存在しないユーザーです</div> : <></>}
      {info ? (
        <div id={styles.pubProfile}>
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
          <FollowArea targetUserId={info.id} />
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

function FollowArea({ targetUserId }: { targetUserId: string }) {
  const auth = useAuth();

  const [isFollow, setIsFollow] = useState<boolean | undefined>(undefined);
  useEffect(() => {
    setIsFollow(auth ? auth.following.includes(targetUserId) : false);
  }, [auth]);
  const currentId = useRef<string | undefined>(undefined);
  const buttonClicked = (newVal: boolean) => {
    setIsFollow(newVal);
    const myID = createUUID();
    currentId.current = myID;
    setTimeout(() => {
      if (myID !== currentId.current || !auth) return;
      if (newVal)
        updateDoc(doc(db, "users", auth.id), {
          following: arrayUnion(targetUserId),
        });
      else
        updateDoc(doc(db, "users", auth.id), {
          following: arrayRemove(targetUserId),
        });
    }, 700);
  };

  if (!auth || isFollow === undefined) return <></>;
  else
    return (
      <div id={styles.followArea}>
        {isFollow ? (
          <button
            id={styles.disFollowButton}
            onClick={() => buttonClicked(false)}
          >
            <span className="material-symbols-outlined">heart_minus</span>解除
          </button>
        ) : auth.following.length > 100 ? (
          <></>
        ) : (
          <button id={styles.followButton} onClick={() => buttonClicked(true)}>
            <span className="material-symbols-outlined">heart_plus</span>
            フォロー
          </button>
        )}
      </div>
    );
}
