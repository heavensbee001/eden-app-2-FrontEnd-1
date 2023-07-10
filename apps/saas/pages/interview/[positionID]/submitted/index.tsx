import {
  AI_INTERVIEW_SERVICES,
  AppUserLayout,
  InterviewEdenAI,
} from "@eden/package-ui";

import type { NextPageWithLayout } from "../../../_app";

const ThanksPage: NextPageWithLayout = () => {
  const { currentUser } = useContext(UserContext);
  const router = useRouter();

  return (
    <>
      <div className="w-full p-8 text-center">
        <div className="mx-auto max-w-lg">
          <h2 className="mb-8 text-2xl font-medium">
            You have completed the interview!
          </h2>
          <p>
            Thank you for your time. Your candidature will be considered by the
            employer and we&apos;ll reach you back with the result.
          </p>
        </div>
        <div className="mx-auto h-[50vh] max-w-lg flex-col xl:w-2/4 xl:items-stretch 2xl:pb-0">
          <InterviewEdenAI
            aiReplyService={
              AI_INTERVIEW_SERVICES.ASK_EDEN_USER_POSITION_AFTER_INTERVIEW
            }
            // experienceTypeID={experienceTypeID}
            // handleChangeChat={(_chat: any) => {
            //   setChatN(_chat);
            // }}
            // sentMessageToEdenAIobj={sentMessageToEdenAIobj}
            // setSentMessageToEdenAIobj={setSentMessageToEdenAIobj}
            placeholder={
              <p className="bg-cottonPink text-forestGreen rounded-lg p-1 text-center font-medium">
                Ask me anything about the role, company or culture
              </p>
            }
            // questions={questions}
            // setQuestions={setQuestions}
            userID={currentUser?._id}
            positionID={router.query.positionID}
            // conversationID={conversationID}
            // setConversationID={setConversationID}
            // handleEnd={() => {
            //   if (handleEnd) handleEnd();
            // }}
          />
        </div>
      </div>
    </>
  );
};

ThanksPage.getLayout = (page) => <AppUserLayout>{page}</AppUserLayout>;

export default ThanksPage;

import { UserContext } from "@eden/package-context";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { useContext } from "react";

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
