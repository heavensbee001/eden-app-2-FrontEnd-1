import {
  AI_INTERVIEW_SERVICES,
  AppUserLayout,
  Card,
  ChatMessage,
  CVUploadGPT,
  InterviewEdenAI,
  SEO,
  Wizard,
  WizardStep,
} from "@eden/package-ui";

import type { NextPageWithLayout } from "../_app";

const HomePage: NextPageWithLayout = () => {
  const { currentUser } = useContext(UserContext);

  return (
    <>
      <SEO />
      <Card className="mx-auto mt-3 h-[88vh] w-full max-w-5xl bg-white" shadow>
        <div className="w-full p-8">
          <Wizard>
            <WizardStep label={"welcome"}>
              <h2>Welcome to Eden AI</h2>
              <p>You are selected to do an interview with Tesla</p>
            </WizardStep>
            <WizardStep label={"welcome"}>
              <h3>
                Your first interview with Tesla will be a discussion with EdenAI
              </h3>
              <p>You are selected to do an interview with Tesla</p>
            </WizardStep>
            <WizardStep label={"cv"}>
              <h3>Hey {currentUser?.discordName}!</h3>
              <p>Upload your CV here</p>
              {/* <p>--- ADD UPLOAD CV BUTTON --</p> */}
              <CVUploadGPT />
            </WizardStep>
            <WizardStep label={"chat"}>
              <div className="mx-auto h-[70vh] max-w-lg">
                <InterviewEdenAIContainer />
              </div>
            </WizardStep>
          </Wizard>
        </div>
      </Card>
    </>
  );
};

HomePage.getLayout = (page) => <AppUserLayout>{page}</AppUserLayout>;

export default HomePage;

import { gql, useMutation, useQuery } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import { IncomingMessage, ServerResponse } from "http";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";

export async function getServerSideProps(ctx: {
  req: IncomingMessage;
  res: ServerResponse;
}) {
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
}

// ------- Interview Chat --------

const FIND_COMPANY = gql`
  query ($fields: findCompanyInput) {
    findCompany(fields: $fields) {
      _id
      name
      questionsToAsk {
        bestAnswer
        question {
          _id
          content
        }
      }
    }
  }
`;

const ADD_CANDIDATE_TO_COMPANY = gql`
  mutation ($fields: addCandidatesCompanyInput) {
    addCandidatesCompany(fields: $fields) {
      _id
      name
      candidates {
        user {
          _id
          discordName
          discordAvatar
        }
        overallScore
      }
    }
  }
`;

// interface cardsDataType {
//   title: string;
//   trust: number;
//   time: number;
//   completed: boolean;
//   firstMessage: string;
//   experienceTypeID: string;
// }

type Question = {
  _id: number;
  content: string;
  bestAnswer: string;
};

interface MessageObject {
  message: string;
  sentMessage: boolean;
  user?: string;
}

const InterviewEdenAIContainer = () => {
  const [sentMessageToEdenAIobj, setSentMessageToEdenAIobj] =
    useState<MessageObject>({ message: "", sentMessage: false, user: "" });

  // --------- Company and User ------------
  const { currentUser } = useContext(UserContext);

  console.log("currentUser = ", currentUser?._id);

  const router = useRouter();
  const { companyID } = router.query;
  // --------- Company and User ------------

  const [questions, setQuestions] = useState<Question[]>([]);

  const {} = useQuery(FIND_COMPANY, {
    variables: {
      fields: {
        _id: companyID,
      },
    },
    skip: companyID == "" || companyID == null,
    onCompleted: (data) => {
      let questionsChange = data.findCompany.questionsToAsk.map(
        (question: any) => {
          return {
            _id: question?.question?._id,
            content: question?.question?.content,
            bestAnswer: question?.bestAnswer,
          };
        }
      );

      questionsChange = questionsChange.filter((question: any) => {
        return question._id != null;
      });

      setQuestions(questionsChange);
    },
  });

  // const {} = useMutation(ADD_CANDIDATE_TO_COMPANY, {
  //   variables: {
  //     fields: {
  //       _id: companyID,
  //       candidates: [
  //         {
  //           userID: currentUser?._id,
  //         },
  //       ],
  //     },
  //   },
  //   skip: companyID == "" || companyID == null || currentUser?._id != "",
  //   // onCompleted: (data) => {
  //   //   console.log("data = ", data);
  //   // },
  // });
  const [addCandidateToCompany] = useMutation(ADD_CANDIDATE_TO_COMPANY, {
    onCompleted: (data) => {
      console.log("data = ", data);
      setAddCandidateFlag(true);
    },
  });

  const [addCandidateFlag, setAddCandidateFlag] = useState<boolean>(false);

  useEffect(() => {
    if (
      addCandidateFlag == false &&
      currentUser?._id != undefined &&
      companyID != undefined
    ) {
      addCandidateToCompany({
        variables: {
          fields: {
            companyID: companyID,
            candidates: [
              {
                userID: currentUser?._id,
              },
            ],
          },
        },
      });
    }
  }, [companyID, currentUser?._id]);

  // console.log("companyID = ", companyID);

  const [experienceTypeID] = useState<string>("");

  const [chatN, setChatN] = useState<ChatMessage>([]);

  console.log("chatN = ", chatN);

  return (
    <div className="w-full">
      {/* <h1 className="mb-4 text-3xl font-bold">
        Help Eden with some questions to know you better
      </h1> */}
      <div className="h-[68vh]">
        {
          <InterviewEdenAI
            key={experienceTypeID}
            aiReplyService={AI_INTERVIEW_SERVICES.INTERVIEW_EDEN_AI}
            experienceTypeID={experienceTypeID}
            //   extraNodes={extraNodes}
            //   handleChangeNodes={(_nodeObj: any) => {
            //     // console.log("handleChangeNodes:", nodeObj);
            //     setNodeObj(_nodeObj);
            //   }}
            handleChangeChat={(_chat: any) => {
              // console.log("handleChangeChat:", _chat);
              setChatN(_chat);
            }}
            //   setShowPopupSalary={setShowPopup}
            //   setMode={setMode}
            sentMessageToEdenAIobj={sentMessageToEdenAIobj}
            setSentMessageToEdenAIobj={setSentMessageToEdenAIobj}
            placeholder={""}
            questions={questions}
            setQuestions={setQuestions}
            userID={currentUser?._id}
          />
        }
      </div>
    </div>
  );
};
