import {
  communityType,
  pubUserDataType,
  userType,
} from "@/lib/types/communityType";
import { db } from "@/lib/firebase/client";
import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

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

export const deleteUserOfCommunity = async (
  userData: pubUserDataType,
  operationUserData: userType,
  communityData: communityType
) => {
  //コミュニティの情報とユーザーの情報両方を更新したい
  //もし他人により操作が行われているのであればブロック操作であると解釈する
  //対象ユーザーがコミュニティの管理者だった場合コミュニティごと削除する
  if (userData.id === communityData.admin) {
    //コミュニティを削除する
    await deleteDoc(doc(db, "community", communityData.id));
    await updateDoc(doc(db, "users", operationUserData.id), {
      belongCommunity: arrayRemove(communityData.id),
    });
  } else if (userData.id !== operationUserData.id) {
    //ブロック操作
    //コミュニティの名簿から対象ユーザーを削除し、ブラックリストに追加する。
    await updateDoc(doc(db, "community", communityData.id), {
      people: arrayRemove(userData.id),
      blackList: arrayUnion(userData.id),
      peopleNumber: communityData.peopleNumber - 1,
    });
  } else {
    //通常の削除操作
    //コミュニティの名簿と自分の所属しているコミュニティ配列から削除する
    await updateDoc(doc(db, "users", userData.id), {
      belongCommunity: arrayRemove(communityData.id),
    });
    await updateDoc(doc(db, "community", communityData.id), {
      people: arrayRemove(userData.id),
      peopleNumber: communityData.peopleNumber - 1,
    });
  }
};
