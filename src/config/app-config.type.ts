export type AppConfig = {
  nodeEnv: string;
  name: string;
  port: number;
  url: string;
  apiPrefix: string;
  corsOrigin: boolean | string | RegExp | (string | RegExp)[];
};
