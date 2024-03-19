export type communityType = {
  admin: string;
  icon: string;
  name: string;
  description: string;
  createdAt: number;
  id: string;
  topic: string;
  people: string[];
};

export const isCommunityType = (arg: any): arg is communityType => {
  return (
    arg.admin !== undefined &&
    arg.name !== undefined &&
    arg.icon != undefined &&
    arg.description !== undefined &&
    arg.id !== undefined &&
    typeof arg.topic === "string" &&
    typeof arg.people == "object"
  );
};

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
    typeof arg.createdAt === "number" &&
    typeof arg.email === "string" &&
    typeof arg.id === "string" &&
    typeof arg.name === "string" &&
    typeof arg.photoURL === "string" &&
    typeof arg.belongCommunity === "object"
  );
};

export type messageType = {
  createdAt: number;
  room: string;
  user: string;
  val: string;
};
const isMessageType = (val: any): val is messageType => {
  return (
    typeof val.createdAt == "number" &&
    typeof val.room == "string" &&
    typeof val.user == "string" &&
    typeof val.val == "string"
  );
};
