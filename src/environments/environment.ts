import { defaultEnvironment } from "./environment.default";

export const environment = {
  production: true,
  ...defaultEnvironment,
  appUrl: "https://todoist-angular.web.app/"
};
