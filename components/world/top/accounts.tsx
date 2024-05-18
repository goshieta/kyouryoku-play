import { db } from "@/lib/firebase/client";
import { isPubUserDataType, pubUserDataType } from "@/lib/types/communityType";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "@/styles/world/world.module.css";

export default function SearchAccounts({
  queryString,
}: {
  queryString: string;
}) {
  const [accounts, setAccounts] = useState<pubUserDataType[]>([]);

  useEffect(() => {
    getDocs(
      query(
        collection(db, "pubUsers"),
        where("name", "==", queryString),
        orderBy("createdAt", "asc")
      )
    ).then((docs) => {
      const newAccounts: pubUserDataType[] = [];
      docs.forEach((oneDoc) => {
        const data = oneDoc.data();
        if (isPubUserDataType(data)) {
          newAccounts.push(data);
        }
      });
      setAccounts(newAccounts);
    });
  }, [queryString]);

  return (
    <div>
      {accounts.map((onePubAccount) => (
        <OneAccount pubAccount={onePubAccount} key={onePubAccount.id} />
      ))}
    </div>
  );
}

function OneAccount({ pubAccount }: { pubAccount: pubUserDataType }) {
  return (
    <Link href={`/account/${pubAccount.id}`} className={styles.accounts}>
      <Image
        src={pubAccount.photoURL}
        width={70}
        height={70}
        alt="プロフィール画像"
      />
      <span>
        <h3>{pubAccount.name}</h3>
        <p>{pubAccount.description}</p>
      </span>
    </Link>
  );
}
