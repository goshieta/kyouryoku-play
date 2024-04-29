import Post from "@/components/account/post";
import PubProfile from "@/components/account/pubProfile";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function AccountInfo() {
  const router = useRouter();
  const [id, setid] = useState<string | null | undefined>(null);

  useEffect(() => {
    const id = router.query.accountID;
    if (typeof id === "string") setid(id);
    else if (typeof id === "object") setid(id[0]);
    else setid(id);
  }, [router]);

  return (
    <div>
      <div>
        <PubProfile id={id} />
        <Post />
      </div>
    </div>
  );
}
