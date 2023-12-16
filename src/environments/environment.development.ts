import { defaultEnvironment } from "./environment.default";

export const environment = {
  production: false,
  ...defaultEnvironment,
  appUrl: "http://localhost:4200/"
};
