import { type DocumentActionComponent } from "sanity";
import { RocketIcon } from "@sanity/icons";

const DEPLOY_WORKFLOW_URL =
  "https://github.com/nihcarry/nicharalambous.com/actions/workflows/deploy.yml";

export const viewBuildStatusAction: DocumentActionComponent = () => {
  return {
    label: "View build status",
    icon: RocketIcon,
    title: "Open GitHub Actions deploy workflow",
    onHandle: () => {
      window.open(DEPLOY_WORKFLOW_URL, "_blank");
    },
  };
};
