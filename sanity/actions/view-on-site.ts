import { type DocumentActionComponent } from "sanity";
import { EarthGlobeIcon } from "@sanity/icons";

const SITE_URL = "https://nicharalambous.com";

const SLUG_ROUTES: Record<string, string> = {
  post: "/blog",
  keynote: "/keynotes",
  topicHub: "/topics",
  book: "/books",
  mediaAppearance: "/media",
  business: "/businesses",
};

const SINGLETON_ROUTES: Record<string, string> = {
  speaker: "/speaker",
};

export const viewOnSiteAction: DocumentActionComponent = (props) => {
  const { type, published } = props;

  const singletonPath = SINGLETON_ROUTES[type];
  if (singletonPath) {
    return {
      label: "View on site",
      icon: EarthGlobeIcon,
      onHandle: () => {
        window.open(`${SITE_URL}${singletonPath}`, "_blank");
      },
    };
  }

  const basePath = SLUG_ROUTES[type];
  if (!basePath) return null;

  const slug = (published as Record<string, unknown> | null)?.slug as
    | { current?: string }
    | string
    | undefined;
  const slugValue = typeof slug === "string" ? slug : slug?.current;

  const disabled = !published || !slugValue;

  return {
    label: "View on site",
    icon: EarthGlobeIcon,
    disabled,
    title: disabled
      ? "Publish the document and add a slug first"
      : `Open ${SITE_URL}${basePath}/${slugValue}`,
    onHandle: () => {
      if (slugValue) {
        window.open(`${SITE_URL}${basePath}/${slugValue}`, "_blank");
      }
    },
  };
};
