import { db } from "@/lib/firebase/client";
import {
  oneArticleCommonType,
  oneArticleType,
} from "@/lib/types/communityType";
import createUUID from "@/lib/uuid";
import { doc, setDoc } from "firebase/firestore";
import tagPost from "../tagPost";

//生のデータが送られてきて、もし不正なデータだった場合エラーを返す
export default async function sendMessage(
  type: "post" | "reply" | "article",
  data: {
    title?: string;
    tags: string[];
    body: string;
    //reply専用
    target?: string;
    targetUser?: string;
    targetTitle?: string;
    targetBody?: string;
  },
  setIsSending: (newVal: boolean) => void,
  userId: string
): Promise<{ code: string; body: string }[] | true> {
  setIsSending(true);
  const result = checkData(type, data);
  if (result == true) {
    //データを加工する処理
    const sendData: oneArticleType = makeData(type, data, userId);
    //データを送る処理
    await setDataOnServer(sendData);
    //結果を返す処理
    setIsSending(false);
    return true;
  } else {
    setIsSending(false);
    return result;
  }
}

function checkData(
  type: "post" | "reply" | "article",
  data: {
    title?: string;
    tags: string[];
    body: string;
  }
) {
  //エラーが出たら配列に格納し、resultをfalseにする
  let errorResult: { code: string; body: string }[] = [];
  let result = true;

  if (type === "post") {
    //タグを検査
    if (data.tags.length == 0) {
      result = false;
      errorResult.push({
        code: "tags",
        body: "タグが一つも入力されていません。",
      });
    }
    if (data.tags.length > 5) {
      result = false;
      errorResult.push({
        code: "tags",
        body: "五つよりも多くのタグを入力することはできません。",
      });
    }
    data.tags.map((oneTag) => {
      if (oneTag.length === 0) {
        result = false;
        errorResult.push({ code: "tags", body: `文字数が0のタグがあります。` });
      }
      if (oneTag.length > 10) {
        result = false;
        errorResult.push({
          code: "tags",
          body: `タグ「${oneTag}」の文字数が10文字よりも多いです。10文字以下にしてください。`,
        });
      }
    });
    //内容の検査
    if (data.body.length === 0) {
      result = false;
      errorResult.push({
        code: "body",
        body: "内容が何も入力されていません。",
      });
    }
    if (data.body.length > 200) {
      result = false;
      errorResult.push({
        code: "body",
        body: "200文字より多く入力しないでください。",
      });
    }
  } else {
    result = false;
  }

  return result ? result : errorResult;
}

function makeData(
  type: "post" | "reply" | "article",
  data: {
    title?: string;
    tags: string[];
    body: string;
    //reply専用
    target?: string;
    targetUser?: string;
    targetTitle?: string;
    targetBody?: string;
  },
  userId: string
) {
  const commonResult: oneArticleCommonType = {
    createdAt: new Date().getTime(),
    id: createUUID(),
    tags: data.tags,
    user: userId,
    like: 0,
    dislike: 0,
    reply: 0,
  };
  switch (type) {
    case "post":
      const postResult: oneArticleType = {
        ...commonResult,
        type: "post",
        body: data.body,
      };
      return postResult;
    case "article":
      const articleResult: oneArticleType = {
        ...commonResult,
        type: "article",
        title: data.title!,
        description: data.body.substring(0, 100),
        body: data.body,
      };
      return articleResult;
    case "reply":
      const replyResult: oneArticleType = {
        ...commonResult,
        type: "reply",
        body: data.body,
        target: data.target!,
        targetUser: data.targetUser!,
        targetTitle: data.targetTitle!,
        targetBody: data.targetBody!,
      };
      return replyResult;
  }
}

async function setDataOnServer(data: oneArticleType) {
  const threads = [setDoc(doc(db, "world", data.id), data), tagPost(data.tags)];
  await Promise.all(threads);
}
