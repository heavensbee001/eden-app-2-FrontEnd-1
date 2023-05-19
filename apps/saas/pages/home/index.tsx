import { AppUserLayout, LeftToggleMenu, SEO } from "@eden/package-ui";
import Link from "next/link";

import type { NextPageWithLayout } from "../_app";

const HomePage: NextPageWithLayout = () => {
  return (
    <>
      <SEO />
      <div className="w-full p-8">
        <LeftToggleMenu defaultVisible={true}>
          <div className="px-4 py-2">
            <h2>Quick directory</h2>
            <ul className="list-disc">
              <li>
                <Link href={"/interview/644e052ca7177f51e7c27b77"}>
                  Interview
                </Link>
              </li>
              <li>
                <Link href={"/dashboard/644e052ca7177f51e7c27b77"}>
                  Company Dashboard
                </Link>
              </li>
              <li>
                <Link href={"/train-ai/644e052ca7177f51e7c27b77"}>
                  Company Train AI
                </Link>
              </li>
            </ul>
          </div>
        </LeftToggleMenu>
        <div className="mx-auto max-w-3xl">
          <h2>Home</h2>
          {/* <ul className="list-disc">
            <li>
              <Link href={"/interview/644e052ca7177f51e7c27b77"}>
                Interview
              </Link>
            </li>
            <li>
              <Link href={"/dashboard/644e052ca7177f51e7c27b77"}>
                Company Dashboard
              </Link>
            </li>
            <li>
              <Link href={"/train-ai/644e052ca7177f51e7c27b77"}>
                Company Train AI
              </Link>
            </li>
          </ul> */}
        </div>
      </div>
    </>
  );
};

HomePage.getLayout = (page) => <AppUserLayout>{page}</AppUserLayout>;

export default HomePage;

import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  const url = ctx.req.url?.replace("/", "");

  if (!session) {
    return {
      redirect: {
        destination: `/login?redirect=${url}`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
