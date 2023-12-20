export type settingType = {
  currentMapName: string;
  positionOfMap:
    | {
        x: number;
        y: number;
      }
    | "bus";
};
