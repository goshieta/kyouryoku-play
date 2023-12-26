export type settingType = {
  currentMapName: string;
  positionOfMap:
    | {
        x: number;
        y: number;
      }
    | "bus";
  playerState: {
    items: {
      name: string;
      count: number;
    }[];
    health: number;
    hunger: number;
  };
};
