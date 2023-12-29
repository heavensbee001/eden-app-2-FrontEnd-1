"use client";

import { UserContext } from "@eden/package-context";
import mixpanel from "mixpanel-browser";
import React from "react";

interface MixpanelProps {}

const Mixpanel = ({}: MixpanelProps) => {
  const { currentUser } = React.useContext(UserContext);

  mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN as string, {
    debug: true,
    // eslint-disable-next-line camelcase
    track_pageview: true,
    persistence: "localStorage",
  });

  mixpanel.identify(currentUser?._id!);

  return null;
};

export default Mixpanel;
