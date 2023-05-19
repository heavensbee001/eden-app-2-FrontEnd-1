import { AppUserLayout } from "@eden/package-ui";

import type { NextPageWithLayout } from "../_app";

const ThanksPage: NextPageWithLayout = () => {
  return (
    <>
      <div className="w-full p-8 pt-40 text-center">
        <div className="mx-auto max-w-lg">
          <h2 className="mb-8 text-2xl font-medium">
            You have completed the interview!
          </h2>
          <p>
            Thank you for your time. Your candidature will be considered by the
            employer and we&apos;ll reach you back with the result.
          </p>
        </div>
      </div>
    </>
  );
};

ThanksPage.getLayout = (page) => <AppUserLayout>{page}</AppUserLayout>;

export default ThanksPage;

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
