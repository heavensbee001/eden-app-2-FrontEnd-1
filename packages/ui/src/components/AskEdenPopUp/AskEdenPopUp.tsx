import { gql, useQuery } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import { Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import { Fragment, useContext, useState } from "react";

import { classNames } from "../../../utils";
import {
  EdenIconExclamationAndQuestion,
  EdenIconQuestion,
} from "../../elements";
import { ChatMessage } from "../EdenAiChat";
import { AI_INTERVIEW_SERVICES, InterviewEdenAI } from "../InterviewEdenAI";

const FIND_POSITION = gql`
  query ($fields: findPositionInput) {
    findPosition(fields: $fields) {
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

type Question = {
  _id: string;
  content: string;
  bestAnswer: string;
};

interface MessageObject {
  message: string;
  sentMessage: boolean;
  user?: string;
}

export interface IAskEdenPopUpProps {
  memberID: string;
  service: AI_INTERVIEW_SERVICES;
  placeholder?: string;
  title?: string;
}

export const AskEdenPopUp = ({
  memberID,
  service,
  placeholder = "Ask me any question",
  title,
}: IAskEdenPopUpProps) => {
  const [open, setOpen] = useState(false);

  const [sentMessageToEdenAIobj, setSentMessageToEdenAIobj] =
    useState<MessageObject>({ message: "", sentMessage: false, user: "" });

  // --------- Position and User ------------
  const { currentUser } = useContext(UserContext);

  console.log("currentUser = ", currentUser?._id);

  const router = useRouter();
  const { positionID } = router.query;
  // --------- Position and User ------------

  const [questions, setQuestions] = useState<Question[]>([]);

  useQuery(FIND_POSITION, {
    variables: {
      fields: {
        _id: positionID,
      },
    },
    skip: positionID == "" || positionID == null,
    onCompleted: (data: any) => {
      let questionsChange = data.findPosition.questionsToAsk.map(
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

  const [conversationID, setConversationID] = useState<String>("");

  const [experienceTypeID] = useState<string>("");

  // eslint-disable-next-line no-unused-vars
  const [chatN, setChatN] = useState<ChatMessage>([]);

  return (
    <>
      <div className="fixed bottom-4 right-4 z-40">
        <div
          className={classNames(
            "relative drop-shadow-sm rounded-full cursor-pointer transition-all ease-in-out",
            title
              ? "h-[calc(3rem+4px)] overflow-hidden scrollbar-hide border-2 border-edenGreen-600 pl-4 flex items-center justify-between bg-white hover:bg-edenGreen-100"
              : "",
            open && title ? "max-w-[calc(3rem+4px)]" : "max-w-[50vw]"
          )}
          onClick={() => setOpen(!open)}
        >
          {title && (
            <span className="text-edenGreen-600 font-Moret mr-16">{title}</span>
          )}
          <div
            className={classNames(
              "w-12 h-12 bg-edenPink-400 rounded-full flex items-center justify-center cursor-pointer transition-all transform ease-in-out",
              open ? "-rotate-45" : "rotate-0",
              title ? "absolute right-0 float-right" : ""
            )}
          >
            {open ? (
              <EdenIconQuestion className="w-8 h-8" />
            ) : (
              <EdenIconExclamationAndQuestion className="w-8 h-8" />
            )}
          </div>
        </div>
        <Transition
          show={open}
          as={Fragment}
          enter="transition-w transition-h ease-in-out duration-300"
          enterFrom="w-0 h-0"
          enterTo="w-[30rem] h-[70vh]"
          leave="transition-w transition-h ease-in-out duration-300"
          leaveFrom="w-[30rem] h-[70vh]"
          leaveTo="w-0 h-0"
        >
          <div className="max-w-lg absolute right-0 bottom-14 overflow-hidden">
            <InterviewEdenAI
              key={experienceTypeID}
              aiReplyService={service}
              experienceTypeID={experienceTypeID}
              handleChangeChat={(_chat: any) => {
                setChatN(_chat);
              }}
              sentMessageToEdenAIobj={sentMessageToEdenAIobj}
              setSentMessageToEdenAIobj={setSentMessageToEdenAIobj}
              placeholder={
                <p className="bg-cottonPink text-edenGreen-600 rounded-lg p-1 text-center font-medium">
                  {placeholder}
                </p>
              }
              questions={questions}
              setQuestions={setQuestions}
              userID={memberID}
              positionID={positionID}
              conversationID={conversationID}
              setConversationID={setConversationID}
              // handleEnd={() => {
              //   if (handleEnd) handleEnd();
              // }}
            />
          </div>
        </Transition>
      </div>
      {open && (
        <div
          className="z-30 fixed w-screen h-screen top-0 left-0"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(false);
          }}
        ></div>
      )}
    </>
  );
};
