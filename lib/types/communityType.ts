export type userType = {
  createdAt: number;
  email: string;
  id: string;
  name: string;
  photoURL: string;
  belongCommunity: string[];
  description: string;
  following: string[];
};
export const isUserType = (arg: any): arg is userType => {
  return (
    arg !== undefined &&
    typeof arg.createdAt === "number" &&
    typeof arg.email === "string" &&
    typeof arg.id === "string" &&
    typeof arg.name === "string" &&
    typeof arg.photoURL === "string" &&
    typeof arg.belongCommunity === "object" &&
    typeof arg.description === "string" &&
    Array.isArray(arg.following) &&
    arg.following.every((type: any) => typeof type === "string")
  );
};

export type pubUserDataType = {
  createdAt: number;
  id: string;
  name: string;
  photoURL: string;
  description: string;
};
export const isPubUserDataType = (arg: any): arg is pubUserDataType => {
  return (
    arg !== undefined &&
    typeof arg.createdAt === "number" &&
    typeof arg.id === "string" &&
    typeof arg.name === "string" &&
    typeof arg.photoURL === "string" &&
    typeof arg.description === "string"
  );
};
export type oneArticleCommonType = {
  createdAt: number;
  id: string;
  tags: string[];
  user: string;
  like: number;
  dislike: number;
  reply: number;
};
export type oneArticleType =
  | (oneArticleCommonType & { type: "post"; body: string })
  | (oneArticleCommonType & {
      type: "article";
      title: string;
      description: string;
      body: string;
    })
  | (oneArticleCommonType & {
      type: "reply";
      body: string;
      target: string;
      targetUser: string;
      targetTitle: string;
      targetBody: string;
    });
export const isOneArticleType = (arg: any): arg is oneArticleType => {
  const commonElementCheck =
    arg !== undefined &&
    typeof arg.createdAt === "number" &&
    typeof arg.id === "string" &&
    (arg.type === "post" || arg.type === "article" || arg.type === "reply") &&
    Array.isArray(arg.tags) &&
    typeof arg.user === "string" &&
    typeof arg.like === "number" &&
    typeof arg.dislike === "number" &&
    typeof arg.reply === "number";

  const postElementCheck = arg.type === "post" && typeof arg.body === "string";
  const articleElementCheck =
    arg.type === "article" &&
    typeof arg.title === "string" &&
    typeof arg.description === "string" &&
    typeof arg.body === "string";
  const replyElementCheck =
    arg.type === "reply" &&
    typeof arg.body === "string" &&
    typeof arg.target === "string" &&
    typeof arg.targetUser === "string" &&
    typeof arg.targetTitle === "string" &&
    typeof arg.targetBody === "string";

  return (
    commonElementCheck &&
    (postElementCheck || articleElementCheck || replyElementCheck)
  );
};

export type reactionType = {
  id: string;
  user: string;
  target: string;
  type: "like" | "dislike";
};
export const isReactionType = (arg: any): arg is reactionType => {
  return (
    arg &&
    typeof arg.id === "string" &&
    typeof arg.user === "string" &&
    typeof arg.target === "string" &&
    (arg.type === "like" || arg.type === "dislike")
  );
};

export type tagType = {
  name: string;
  forSearch: {
    [key: string]: boolean;
  };
  timestamp: number[];
  latestTimestamp: number;
  trendIndex: number;
};
export const isTagType = (arg: any): arg is tagType => {
  return (
    arg &&
    typeof arg.name === "string" &&
    typeof arg.forSearch === "object" &&
    Array.isArray(arg.timestamp) &&
    arg.timestamp.every((type: any) => typeof type === "number") &&
    typeof arg.latestTimestamp === "number" &&
    typeof arg.trendIndex === "number"
  );
};
