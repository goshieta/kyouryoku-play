import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/client";
import { isTagType, tagType } from "../types/communityType";
import createNGrams from "../tips/createNgram";

//タグのトレンド指標は、過去10回の投稿のタイムスタンプをもとにして計算する
//タグのトレンド指標は、投稿する時のみにしか更新されないため、最後に投稿されたタイムスタンプを保存することで、最終更新と現在時刻の乖離が激しい場合は省くことができる
export default async function tagPost(tags: string[]) {
  const tagsPromise = tags.map((oneTag) => {
    return new Promise<tagType | string>((resolve) => {
      getDoc(doc(db, "tags", oneTag))
        .then((data) => data.data())
        .then((data) => resolve(isTagType(data) ? data : oneTag));
    });
  });
  const haveGotTags = await Promise.all(tagsPromise);
  const serverTags = haveGotTags.filter(
    (oneTag) => typeof oneTag === "object"
  ) as tagType[];
  const onlyClientTags = haveGotTags.filter(
    (oneTag) => typeof oneTag === "string"
  ) as string[];

  const now = new Date();
  const nowTimeStamp = now.getTime();

  serverTags.forEach((oneTag) => {
    const newTimeStamp = oneTag.timestamp;
    if (newTimeStamp.length >= 10) newTimeStamp.shift();
    newTimeStamp.push(nowTimeStamp);
    const updateTagInfo = {
      timestamp: newTimeStamp,
      latestTimestamp: nowTimeStamp,
      trendIndex: calcTrendIndex(newTimeStamp),
    };
    updateDoc(doc(db, "tags", oneTag.name), updateTagInfo);
  });
  onlyClientTags.forEach((oneTagName) => {
    const newTag: tagType = {
      name: oneTagName,
      forSearch: createNGrams(oneTagName, 2),
      timestamp: [nowTimeStamp],
      latestTimestamp: nowTimeStamp,
      trendIndex: calcTrendIndex([nowTimeStamp]),
    };
    setDoc(doc(db, "tags", oneTagName), newTag);
  });
}

const calcTrendIndex = (timestamp: number[]) => {
  const decayRate = 0.001;
  const now = new Date();
  const nowTimeStamp = now.getTime();
  return timestamp.reduce(
    (previousValue, currentValue) =>
      previousValue + Math.exp(-decayRate * (nowTimeStamp - currentValue))
  );
};
