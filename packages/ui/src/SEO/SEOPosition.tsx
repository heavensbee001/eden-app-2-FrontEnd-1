import Head from "next/head";
import React, { FC } from "react";

const DEFAULT_TITLE = process.env.NEXT_PUBLIC_ENV_BRANCH
  ? `Eden protocol - ${process.env.NEXT_PUBLIC_ENV_BRANCH}`
  : `Eden protocol`;
const DEFAULT_DESCRIPTION = `Together, let's build the perfect breeding ground for everyone to do work they love. Eden's talent coordination protocol is how.`;

const DEFAULT_IMAGE = `https://pbs.twimg.com/profile_images/1595723986524045312/fqOO4ZI__400x400.jpg`;

export interface SEOPositionProps {
  title?: string;
  position?: string;
  image?: string;
  description?: string;
  salaryMin?: string | number;
  salaryMax?: string | number;
  officePolicy?: string;
  location?: string;
}

export const SEOPosition: FC<SEOPositionProps> = ({
  title = "",
  position = "",
  description = "",
  image,
  salaryMin,
  salaryMax,
  officePolicy,
  location,
}) => {
  const appTitle = title + ` ` + DEFAULT_TITLE;
  const appDescription = description ? description : DEFAULT_DESCRIPTION;

  const imageSrc = image ? image : DEFAULT_IMAGE;

  // console.log("image", image);

  // const apiUrl = `/api/og/position?image=${imageSrc}&position=${position}`;
  let apiUrl = `/api/og/position?image=${imageSrc}`;

  if (position) {
    apiUrl = apiUrl + `&position=${position}`;
  }
  if (salaryMin) {
    apiUrl = apiUrl + `&salaryMin=${salaryMin}`;
  }
  if (salaryMax) {
    apiUrl = apiUrl + `&salaryMax=${salaryMax}`;
  }
  if (officePolicy) {
    apiUrl = apiUrl + `&officePolicy=${officePolicy}`;
  }
  if (location) {
    apiUrl = apiUrl + `&location=${location}`;
  }

  const ogImage = process.env.NEXT_PUBLIC_VERCEL_URL
    ? process.env.NEXT_PUBLIC_VERCEL_URL + apiUrl
    : "" + apiUrl;

  return (
    <Head>
      <meta property="og:site_name" content={`Eden protocol`} />
      <meta property="og:title" content={appTitle} />
      <meta property="og:description" content={appDescription} />
      <meta property="og:image" content={encodeURI(ogImage)} />
      <meta property="og:image:width" content="800" />
      <meta property="og:image:height" content="400" />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:site" content={`Eden protocol`} />
      <meta property="twitter:title" content={appTitle} />
      <meta property="twitter:description" content={appDescription} />
      <meta property="twitter:image:src" content={encodeURI(ogImage)} />
      <meta property="twitter:image:width" content="800" />
      <meta property="twitter:image:height" content="400" />
      <meta property="twitter:creator" content={`Eden protocol`} />
    </Head>
  );
};

export default SEOPosition;
