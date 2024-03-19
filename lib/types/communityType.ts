export type communityType = {
  admin: string;
  icon: string;
  name: string;
  description: string;
  createdAt: number;
  id: string;
  topic: string;
  people: string[];
  peopleNumber: number;
};

export const isCommunityType = (arg: any): arg is communityType => {
  return (
    arg !== undefined &&
    arg.admin !== undefined &&
    arg.name !== undefined &&
    arg.icon != undefined &&
    arg.description !== undefined &&
    arg.id !== undefined &&
    typeof arg.topic === "string" &&
    typeof arg.people === "object" &&
    typeof arg.peopleNumber === "number"
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

export type messageType = {
  createdAt: number;
  room: string;
  user: string;
  val: string;
};
export const isMessageType = (arg: any): arg is messageType => {
  return (
    arg !== undefined &&
    typeof arg.createdAt == "number" &&
    typeof arg.room == "string" &&
    typeof arg.user == "string" &&
    typeof arg.val == "string"
  );
};
