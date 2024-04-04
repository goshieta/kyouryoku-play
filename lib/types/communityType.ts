export type userType = {
  createdAt: number;
  email: string;
  id: string;
  name: string;
  photoURL: string;
  belongCommunity: string[];
};
export const isUserType = (arg: any): arg is userType => {
  return (
    arg !== undefined &&
    typeof arg.createdAt === "number" &&
    typeof arg.email === "string" &&
    typeof arg.id === "string" &&
    typeof arg.name === "string" &&
    typeof arg.photoURL === "string" &&
    typeof arg.belongCommunity === "object"
  );
};

export type pubUserDataType = {
  createdAt: number;
  id: string;
  name: string;
  photoURL: string;
};
export const isPubUserDataType = (arg: any): arg is pubUserDataType => {
  return (
    arg !== undefined &&
    typeof arg.createdAt === "number" &&
    typeof arg.id === "string" &&
    typeof arg.name === "string" &&
    typeof arg.photoURL === "string"
  );
};

export type oneArticleType = {
  createdAt: number;
  id: string;
  type: "article" | "game" | "quiz";
  title: string;
  tags: string[];
  description: string;
  body: string;
  user: string;
};
export const isOneArticleType = (arg: any): arg is oneArticleType => {
  return (
    arg !== undefined &&
    typeof arg.createdAt === "number" &&
    typeof arg.id === "string" &&
    (arg.type === "article" || arg.type === "game" || arg.type === "quiz") &&
    typeof arg.title === "string" &&
    typeof arg.tags === "object" &&
    typeof arg.description === "string" &&
    typeof arg.body === "string" &&
    typeof arg.user === "string"
  );
};
