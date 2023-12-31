import mixpanel from "mixpanel-browser";

const mixpanelConfig = () => {
  if (!process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) return;
  mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN as string, {
    debug: true,
    // eslint-disable-next-line camelcase
    track_pageview: true,
    persistence: "localStorage",
  });
};

export default mixpanelConfig;
