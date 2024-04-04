import Articles from "@/components/world/top/articles";
import Query from "@/components/world/top/query";
import { useState } from "react";
import styles from "@/styles/world/world.module.css";
import { useRouter } from "next/router";

export default function World() {
  const [currentTag, setCurrentTag] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div>
      <button onClick={() => router.push("/world/new")}>投稿を作成</button>
      <Query currentTag={currentTag} setCurrentTag={setCurrentTag} />
      <Articles query={currentTag} />
    </div>
  );
}
