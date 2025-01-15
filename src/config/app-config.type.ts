export type AppConfig = {
  nodeEnv: string;
  name: string;
  port: number;
  apiPrefix: string;
  corsOrigin: boolean | string | RegExp | (string | RegExp)[];
};
