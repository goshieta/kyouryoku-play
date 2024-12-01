import { auth } from "@/app/lib/firebase";
import { useEffect, useState, useRef } from "react";
import { accountDataType } from "@/app/lib/types/accountType";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function useUser() {
  const [uid, setUid] = useState<string | null | undefined>(null);
  const [userData, setUserData] = useState<null | undefined | accountDataType>(
    null
  );

  useEffect(() => {
    const Unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      } else {
        setUid(undefined);
      }
    });

    return Unsubscribe;
  }, []);

  useEffect(() => {
    if (typeof uid === "string") {
      const userDocRef = doc(db, "users", uid);
      const unsub = onSnapshot(userDocRef, (userdoc) => {
        const data = userdoc.data() as accountDataType | undefined;
        setUserData(data);
      });
      return unsub;
    } else {
      setUserData(uid);
    }
  }, [uid]);

  return [uid, userData] as [
    string | null | undefined,
    null | undefined | accountDataType
  ];
}
