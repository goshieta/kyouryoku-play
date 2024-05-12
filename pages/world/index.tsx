import Articles from "@/components/world/top/articles";
import {
  JSXElementConstructor,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from "react";
import WorldLayout, {
  CurrentTagContext,
} from "@/components/layouts/worldLayout";
import Head from "next/head";
import WorldMenu from "@/components/world/top/worldMenu";
import styles from "@/styles/world/world.module.css";
import { QueryFieldFilterConstraint } from "firebase/firestore";

export default function World() {
  const currentTag = useContext(CurrentTagContext);
  const [customQuery, setCustomQuery] = useState<
    QueryFieldFilterConstraint[] | undefined
  >(undefined);

  return (
    <div id={styles.parent}>
      <Head>
        <title>{`${
          !currentTag?.currentTag ? "すべて" : currentTag?.currentTag
        }の投稿 - 峡緑プレイ`}</title>
      </Head>
      <WorldMenu currentTag={currentTag} setCustomQuery={setCustomQuery} />
      <Articles customQuery={customQuery} />
    </div>
  );
}

World.getLayout = (
  page: ReactElement<any, string | JSXElementConstructor<any>>
) => {
  return <WorldLayout>{page}</WorldLayout>;
};
