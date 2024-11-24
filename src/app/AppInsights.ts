import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { ReactPlugin } from "@microsoft/applicationinsights-react-js";
import { url } from "inspector";

const defaultBrowserHistory = {
  url: "/",
  location: { pathname: "" },
  listen: () => {},
};

let browserHistory = defaultBrowserHistory;
if (typeof window !== "undefined") {
  browserHistory = { ...browserHistory, ...window.history };
  browserHistory.location.pathname = browserHistory?.url;
}

const reactPlugin = new ReactPlugin();
const appInsights = new ApplicationInsights({
  config: {
    instrumentationKey: "fe1bb37c-9520-4a48-9759-ad26ea3f27be",
    maxBatchSizeInBytes: 10000,
    maxBatchInterval: 15000,
    extensions: [reactPlugin],
    extensionConfig: {
      [reactPlugin.identifier]: { history: browserHistory },
    },
  },
});
if (typeof window !== "undefined") {
  appInsights.loadAppInsights();
}

export { appInsights, reactPlugin };
