import { gql, useQuery } from "@apollo/client";
import { AppUserLayoutNew, Button } from "@eden/package-ui";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";

import { NextPageWithLayout } from "../../_app";

const FIND_COMPANY_FROM_SLUG = gql`
  query ($fields: findCompanyFromSlugInput) {
    findCompanyFromSlug(fields: $fields) {
      _id
      name
      slug
      positions {
        _id
        name
        status
        talentList {
          _id
          name
        }
      }
    }
  }
`;

const HomePage: NextPageWithLayout = () => {
  const router = useRouter();
  const [companyLoading, setCompanyLoading] = useState(true);

  const { data: findCompanyData } = useQuery(FIND_COMPANY_FROM_SLUG, {
    variables: {
      fields: {
        slug: router.query.slug,
      },
    },
    onCompleted(_findCompanyData) {
      if (
        !_findCompanyData?.findCompanyFromSlug?.positions ||
        _findCompanyData?.findCompanyFromSlug?.positions?.length === 0
      ) {
        setCompanyLoading(false);
      }
    },
  });

  const handleExploreCommunities = () => {
    console.log("hey", companyLoading);
  };

  const handleSetupCustomFlow = () => {
    console.log("hey");
  };

  return (
    <div className="h-full">
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(h,o,t,j,a,r){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:${process.env.NEXT_PUBLIC_HOTJAR_ID},hjsv:6};
                  a=o.getElementsByTagName('head')[0];
                  r=o.createElement('script');r.async=1;
                  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                  a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `,
          }}
        />
      </Head>

      <div className="mx-auto h-full w-full rounded px-8">
        <div className="z-40 flex h-full w-full flex-row gap-2">
          <div className="relative h-full min-w-[330px]">
            <div className="border-edenGreen-400 relative mb-2 border-b pb-2 text-center">
              <h1 className="text-edenGreen-600">
                {"Communities you're subscribed to"}
              </h1>
            </div>

            <div className="scrollbar-hide h-[calc(100%-106px)] overflow-y-auto pt-4">
              <div className="flex flex-row rounded-lg px-2 py-4">
                <Image
                  width="56"
                  height="56"
                  src={findCompanyData?.findCompanyFromSlug?.imageUrl}
                  alt={`${findCompanyData?.findCompanyFromSlug?.name} image`}
                />
                <div className="flex flex-col">
                  <h1>{findCompanyData?.findCompanyFromSlug?.name}</h1>
                </div>
              </div>
            </div>
            <div className="bg-edenPink-500 absolute bottom-0 flex w-full justify-around px-6 py-2">
              <Button
                className="w-60 text-center"
                variant="primary"
                onClick={handleExploreCommunities}
              >
                Explore more communities
              </Button>
            </div>
          </div>
          <div className="min-w-1/2 bg-edenGreen-200 h-full flex-grow"></div>
          <div className="relative h-full min-w-[330px]">
            <div className="border-edenGreen-400 relative mb-2 border-b pb-2 text-center">
              <h1 className="text-edenGreen-600">
                {"AI-powered Engage Flows"}
              </h1>
            </div>

            <div className="scrollbar-hide max-h-[calc(100%-160px)] overflow-y-auto pt-4"></div>
            <div className="bg-edenGreen-600 absolute bottom-0 flex w-full justify-around px-6 py-2">
              <Button
                className="w-56 border-white text-center text-white"
                onClick={handleSetupCustomFlow}
              >
                Setup custome engage flow
              </Button>
            </div>
          </div>
        </div>
        <div className="text-edenGreen-600 fixed right-1/3 top-3 z-[200] flex flex-row">
          <svg
            width="30"
            height="29"
            viewBox="0 0 30 29"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M24.5859 15.0678C23.9327 19.8089 19.6431 23.4695 14.4486 23.4695C8.80175 23.4695 4.2251 19.1445 4.2251 13.8081C4.2251 8.87985 8.1304 4.81237 13.1765 4.22046"
              stroke="#00462C"
              stroke-width="1.77187"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M21.4062 18.5222L25.5658 22.4437"
              stroke="#00462C"
              stroke-width="1.77187"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M22.2306 3.71192L23.1646 5.48764C23.2121 5.57729 23.3021 5.63935 23.4067 5.6543L25.4974 5.93933C25.5814 5.94967 25.658 5.99219 25.7102 6.05541C25.8075 6.17609 25.793 6.34619 25.6761 6.44963L24.1607 7.83458C24.0841 7.90238 24.0489 8.00353 24.0695 8.10122L24.432 10.0551C24.4575 10.2171 24.3407 10.3689 24.1692 10.3953C24.0987 10.4056 24.0257 10.3941 23.9612 10.3642L22.0992 9.44248C22.0056 9.39422 21.8937 9.39422 21.8001 9.44248L19.9246 10.37C19.7665 10.4447 19.5756 10.3895 19.4892 10.2436C19.4576 10.185 19.4455 10.1183 19.4576 10.0539L19.8201 8.09892C19.8382 8.00123 19.8042 7.90238 19.7289 7.83227L18.2049 6.44849C18.0821 6.33125 18.0821 6.14161 18.2049 6.02438C18.256 5.9807 18.3192 5.95082 18.3874 5.93933L20.4792 5.65314C20.5839 5.63705 20.6739 5.57499 20.7212 5.48534L21.6541 3.71192C21.6919 3.63952 21.7575 3.5855 21.839 3.55906C21.9205 3.53377 22.008 3.54067 22.0846 3.5763C22.1479 3.60619 22.199 3.65331 22.2306 3.71192Z"
              stroke="#00462C"
              stroke-width="1.77187"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          All your opportunities
        </div>
      </div>
    </div>
  );
};

HomePage.getLayout = (page: any) => <AppUserLayoutNew>{page}</AppUserLayoutNew>;

export default HomePage;

import { IncomingMessage, ServerResponse } from "http";
import Head from "next/head";
import { getSession } from "next-auth/react";

export async function getServerSideProps(ctx: {
  req: IncomingMessage;
  res: ServerResponse;
  query: { slug: string };
}) {
  const session = await getSession(ctx);

  const url = ctx.req.url;

  if (!session) {
    return {
      redirect: {
        destination: `/?redirect=${url}`,
        permanent: false,
      },
    };
  }

  if (session.accessLevel === 5) {
    return {
      props: { key: url },
    };
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/company-auth`,
    {
      method: "POST",
      body: JSON.stringify({
        userID: session.user!.id,
        companySlug: ctx.query.slug,
      }),
      headers: { "Content-Type": "application/json" },
    }
  );

  console.log(res.status);

  if (res.status === 401) {
    return {
      redirect: {
        destination: `/request-access?company=${ctx.query.slug}`,
        permanent: false,
      },
    };
  }

  if (res.status === 404) {
    return {
      redirect: {
        destination: `/create-company`,
        permanent: false,
      },
    };
  }

  const _companyAuth = await res.json();

  if (
    res.status === 200 &&
    _companyAuth.company.type !== "COMMUNITY" &&
    (!_companyAuth.company.stripe ||
      !_companyAuth.company.stripe.product ||
      !_companyAuth.company.stripe.product.ID)
  ) {
    return {
      redirect: {
        destination: `/${_companyAuth.company.slug}/dashboard/subscription`,
        permanent: false,
      },
    };
  }

  return {
    props: { key: url },
  };
}
