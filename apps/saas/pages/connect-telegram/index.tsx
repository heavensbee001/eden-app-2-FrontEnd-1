import { UserContext } from "@eden/package-context";
import { AppUserLayout } from "@eden/package-ui";
import { IncomingMessage, ServerResponse } from "http";
import { getSession } from "next-auth/react";
import { useContext } from "react";

import ConnectTelegramContainer from "@/components/interview/ConnectTelegramContainer";

import type { NextPageWithLayout } from "../_app";

const ConnectTGPage: NextPageWithLayout = () => {
  const { currentUser } = useContext(UserContext);

  return (
    <>
      <ConnectTelegramContainer
        candidateTelegramID={currentUser?.conduct?.telegramChatID || undefined}
      />
    </>
  );
};

ConnectTGPage.getLayout = (page) => <AppUserLayout>{page}</AppUserLayout>;

export default ConnectTGPage;

export async function getServerSideProps(ctx: {
  req: IncomingMessage;
  res: ServerResponse;
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

  return {
    props: {},
  };
}
