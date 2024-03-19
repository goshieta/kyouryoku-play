import { communityType, userType } from "@/lib/types/communityType";
import { db } from "@/lib/firebase/client";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";

export const addUserInComunity = async (
  userData: userType,
  communityData: communityType
): Promise<{ state: boolean; error?: string }> => {
  //コミュニティの情報とユーザーの情報両方にコミュニティに所属していることを登録する
  //既に参加していないかチェックする
  //この場合、コミュニティのデータに登録されているかのみを確認するため、ユーザーのデータに登録されているがコミュニティのデータに存在している場合、処理は継続される。
  const isBelonged = communityData.people.includes(userData.id);
  if (isBelonged)
    return { state: false, error: "すでに所属しているコミュニティです" };

  //コミュニティの情報に登録
  //データを更新する
  const communityRef = doc(db, "community", communityData.id);
  await updateDoc(communityRef, {
    people: arrayUnion(userData.id),
    peopleNumber: communityData.peopleNumber + 1,
  });
  //ユーザーの情報に登録
  const userRef = doc(db, "users", userData.id);
  await updateDoc(userRef, { belongCommunity: arrayUnion(communityData.id) });
  return { state: true };
};
