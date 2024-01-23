declare module "*/gameInfo.json" {
  type gameInfo = {
    title: string;
    catchCopy?: string;
    description?: string;
    gameCode: string;
    color: string;
  };

  const gameInfoJson: {
    [key: string]: gameInfo;
  };
  export = gameInfoJson;
}
