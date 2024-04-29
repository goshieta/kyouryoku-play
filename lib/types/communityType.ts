export type userType = {
  createdAt: number;
  email: string;
  id: string;
  name: string;
  photoURL: string;
  belongCommunity: string[];
  description: string;
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
    typeof arg.description === "string"
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

export type oneArticleType = {
  createdAt: number;
  id: string;
  type: "article" | "reply" | "game" | "quiz";
  title: string;
  tags: string[];
  description: string;
  body: string;
  user: string;
  like: number;
  dislike: number;
  reply: number;
  //typeがreplyの時のみ存在
  target?: string;
  targetUser?: string;
  targetTitle?: string;
  targetBody?: string;
};
export const isOneArticleType = (arg: any): arg is oneArticleType => {
  return (
    arg !== undefined &&
    typeof arg.createdAt === "number" &&
    typeof arg.id === "string" &&
    (arg.type === "article" ||
      arg.type === "reply" ||
      arg.type === "game" ||
      arg.type === "quiz") &&
    typeof arg.title === "string" &&
    typeof arg.tags === "object" &&
    typeof arg.description === "string" &&
    typeof arg.body === "string" &&
    typeof arg.user === "string" &&
    typeof arg.like === "number" &&
    typeof arg.dislike === "number" &&
    typeof arg.reply === "number" &&
    //replyの時のみ
    (arg.type !== "reply" ||
      (typeof arg.target === "string" &&
        typeof arg.targetUser === "string" &&
        typeof arg.targetBody === "string" &&
        typeof arg.targetTitle === "string"))
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
