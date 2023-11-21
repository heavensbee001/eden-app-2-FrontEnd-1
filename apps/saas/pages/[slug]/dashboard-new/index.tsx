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
      imageUrl
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
          <div className="bg-edenPink-100 relative h-full min-w-[330px]">
            <div className="border-edenGreen-400 relative mb-2 border-b pb-2 text-center">
              <h1 className="text-edenGreen-600">
                {"Communities you're subscribed to"}
              </h1>
            </div>

            <div className="scrollbar-hide h-[calc(100%-106px)] overflow-y-auto pt-4">
              <div className="bg-edenPink-300 flex flex-row items-center rounded-lg px-2 py-4">
                <Image
                  width="56"
                  height="56"
                  src={findCompanyData?.findCompanyFromSlug?.imageUrl}
                  alt={`${findCompanyData?.findCompanyFromSlug?.name} image`}
                />
                <div className="ml-4 flex flex-col">
                  <h1 className="text-edenGreen-600">
                    {findCompanyData?.findCompanyFromSlug?.name}
                  </h1>
                  <p>5000+ active web3 developers.</p>
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
          <div className="bg-edenPink-100 relative h-full min-w-[330px]">
            <div className="border-edenGreen-400 relative mb-2 border-b pb-2 text-center">
              <h1 className="text-edenGreen-600">
                {"AI-powered Engage Flows"}
              </h1>
            </div>

            <div className="scrollbar-hide max-h-[calc(100%-160px)] overflow-y-auto pt-2">
              <div className="bg-edenPink-300 m-4 flex flex-row items-center rounded-md py-2">
                <div className="border-edenGreen-300 flex h-11 w-14 items-center justify-center border-r">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M1.40537 6.06455C2.33543 5.06666 3.65893 4.50976 5.21796 4.50976H14.2811C15.8435 4.50976 17.1675 5.06635 18.0973 6.06481C19.0214 7.05723 19.5 8.4252 19.5 9.9563V13.7453C19.5 15.2759 19.0213 16.6437 18.0971 17.636C17.1672 18.6343 15.8429 19.1908 14.2801 19.1908H5.21796C3.65557 19.1908 2.33171 18.6342 1.40222 17.6359C0.47837 16.6435 0 15.2758 0 13.7453V9.9563C0 8.4245 0.48076 7.05659 1.40537 6.06455ZM2.50267 7.08726C1.87993 7.7554 1.5 8.7358 1.5 9.9563V13.7453C1.5 14.9661 1.8785 15.9461 2.50007 16.6137C3.11601 17.2753 4.02614 17.6908 5.21796 17.6908H14.2801C15.4725 17.6908 16.3832 17.2753 16.9994 16.6136C17.6213 15.946 18 14.966 18 13.7453V9.9563C18 8.735 17.6213 7.7548 16.9995 7.08701C16.3833 6.42528 15.4729 6.00976 14.2811 6.00976H5.21796C4.03042 6.00976 3.11994 6.42498 2.50267 7.08726Z"
                      fill="#00462C"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M10.3104 0.27669C10.5718 0.59799 10.5232 1.07038 10.2019 1.33179L4.48117 5.98624C4.15987 6.24765 3.68748 6.1991 3.42607 5.8778C3.16465 5.5565 3.2132 5.08411 3.5345 4.8227L9.2553 0.16825C9.5766 -0.0931598 10.0489 -0.0446099 10.3104 0.27669Z"
                      fill="#00462C"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M14.6914 11.3203C15.1056 11.3203 15.4414 11.6561 15.4414 12.0703V14.5443C15.4414 14.9585 15.1056 15.2943 14.6914 15.2943C14.2772 15.2943 13.9414 14.9585 13.9414 14.5443V12.0703C13.9414 11.6561 14.2772 11.3203 14.6914 11.3203Z"
                      fill="#00462C"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M11.7852 11.3203C12.1994 11.3203 12.5352 11.6561 12.5352 12.0703V14.5443C12.5352 14.9585 12.1994 15.2943 11.7852 15.2943C11.3709 15.2943 11.0352 14.9585 11.0352 14.5443V12.0703C11.0352 11.6561 11.3709 11.3203 11.7852 11.3203Z"
                      fill="#00462C"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M4.05859 13.3071C4.05859 12.0899 5.04532 11.1016 6.26412 11.1016C7.48293 11.1016 8.4697 12.0899 8.4697 13.3071C8.4697 14.5256 7.48261 15.5126 6.26412 15.5126C5.04564 15.5126 4.05859 14.5256 4.05859 13.3071ZM6.26412 12.6016C5.87439 12.6016 5.55859 12.9177 5.55859 13.3071C5.55859 13.6971 5.87407 14.0126 6.26412 14.0126C6.65418 14.0126 6.96965 13.6971 6.96965 13.3071C6.96965 12.9177 6.65386 12.6016 6.26412 12.6016Z"
                      fill="#00462C"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M3.62695 9.0332C3.62695 8.619 3.96274 8.2832 4.37695 8.2832H15.1232C15.5374 8.2832 15.8732 8.619 15.8732 9.0332C15.8732 9.4474 15.5374 9.7832 15.1232 9.7832H4.37695C3.96274 9.7832 3.62695 9.4474 3.62695 9.0332Z"
                      fill="#00462C"
                    />
                  </svg>
                </div>
                <div className="flex flex-col px-3">
                  <h1 className="text-edenGreen-600">Talent radio</h1>
                  <p className="text-edenGray-500">
                    Fav profile based recruitment
                  </p>
                </div>
              </div>
              <div className="bg-edenPink-300 m-4 flex flex-row items-center rounded-md py-2">
                <div className="border-edenGreen-300 flex h-11 w-14 items-center justify-center border-r">
                  <svg
                    width="37"
                    height="37"
                    viewBox="0 0 37 37"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M27.223 25.2281C28.262 24.4814 28.7235 23.3892 29.0797 22.2286C29.3202 21.4479 29.3884 16.9983 29.4048 15.3079C29.4167 14.1384 30.3679 13.2004 31.5375 13.2004C32.6981 13.2004 33.6464 14.1295 33.6687 15.2916C33.731 18.5463 34.0842 22.3724 33.0558 25.5159C32.1682 28.226 30.3784 30.5903 27.9354 32.0788"
                      stroke="#00462C"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M22.3624 32.2318C22.3474 30.3617 22.4069 25.8915 22.6739 24.4356C23.1192 21.9868 25.494 18.6949 29.3082 19.7783"
                      stroke="#00462C"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M12.5827 25.2281C11.5438 24.4814 11.0822 23.3892 10.726 22.2286C10.4856 21.4479 10.4173 16.9983 10.401 15.3079C10.3891 14.1384 9.43775 13.2004 8.26824 13.2004C7.10763 13.2004 6.15926 14.1295 6.137 15.2916C6.07467 18.5463 5.72144 22.3724 6.74995 25.5159C7.63747 28.226 9.42736 30.5903 11.8703 32.0788"
                      stroke="#00462C"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M17.4469 32.2318C17.4618 30.3617 17.4023 25.8915 17.1353 24.4356C16.6901 21.9868 14.3154 18.6949 10.5011 19.7783"
                      stroke="#00462C"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      opacity="0.4"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M21.2106 14.6228H18.5954C18.1843 14.6228 17.8503 14.2889 17.8503 13.8763V11.7525H15.7221C15.311 11.7525 14.9771 11.4185 14.9771 11.0059V8.38492C14.9771 7.97381 15.311 7.63839 15.7221 7.63839H17.8503V5.51605C17.8503 5.10347 18.1843 4.76953 18.5954 4.76953H21.2106C21.6231 4.76953 21.957 5.10347 21.957 5.51605V7.63839H24.0838C24.4965 7.63839 24.8304 7.97381 24.8304 8.38492V11.0059C24.8304 11.4185 24.4965 11.7525 24.0838 11.7525H21.957V13.8763C21.957 14.2889 21.6231 14.6228 21.2106 14.6228Z"
                      stroke="#00462C"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <div className="flex flex-col px-3">
                  <h1 className="text-edenGreen-600">Smart referrals</h1>
                  <p className="text-edenGray-500">
                    Ask the right people for referrals
                  </p>
                </div>
              </div>
              <div className="bg-edenPink-300 m-4 flex flex-row items-center rounded-md py-2">
                <div className="border-edenGreen-300 flex h-11 w-14 items-center justify-center border-r">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.6392 20.9996L8.4647 20.1113C7.99184 19.9186 7.45964 19.9342 6.99943 20.1541L6.22789 20.5228C5.41742 20.911 4.4795 20.3195 4.48047 19.4205L4.4902 6.98325C4.4902 4.52364 5.85817 3 8.31292 3H15.721C18.1825 3 19.5203 4.52364 19.5203 6.98325V11.274"
                      stroke="#00462C"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M17.1047 14.8594V20.9997M17.1047 14.8594L14.6895 17.2849M17.1047 14.8594L19.5201 17.2849"
                      stroke="#00462C"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M14.1075 9.04297H9.13867M12.4506 12.9025H9.13867"
                      stroke="#00462C"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <div className="flex flex-col px-3">
                  <h1 className="text-edenGreen-600">Passive Talent Pitch</h1>
                  <p className="text-edenGray-500">
                    Reach talent that is not actively looking
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-edenGreen-600 absolute bottom-0 flex w-full justify-around px-6 py-2">
              <Button
                className="w-56 border-white text-center text-white"
                onClick={handleSetupCustomFlow}
              >
                Setup custom engage flow
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
