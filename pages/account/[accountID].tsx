import Post from "@/components/account/post";
import PubProfile from "@/components/account/pubProfile";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { isPubUserDataType, pubUserDataType } from "@/lib/types/communityType";
import { db } from "@/lib/firebase/client";
import { collection, doc, getDoc } from "firebase/firestore";

export default function AccountInfo() {
  const router = useRouter();
  const [id, setid] = useState<string | null | undefined>(null);

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

  useEffect(() => {
    const id = router.query.accountID;
    if (typeof id === "string") setid(id);
    else if (typeof id === "object") setid(id[0]);
    else setid(id);
  }, [router]);

  return (
    <div>
      <div>
        <PubProfile info={info} />
        <Post id={id} info={info} />
      </div>
    </div>
  );
}
