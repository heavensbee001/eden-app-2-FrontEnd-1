import { gql, useQuery } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import { Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import { Fragment, useContext, useEffect, useState } from "react";

import { classNames } from "../../../utils";
import {
  EdenIconExclamationAndQuestion,
  EdenIconQuestion,
} from "../../elements";
import {
  AI_INTERVIEW_SERVICES,
  ChatMessage,
  InterviewEdenAI,
} from "../InterviewEdenAI";

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
  className?: string;
  forceOpen?: boolean;
  onClose?: () => void;
}

export const AskEdenPopUp = ({
  memberID,
  service,
  placeholder = "Ask me any question",
  title,
  className = "",
  forceOpen = false,
  onClose,
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

  useEffect(() => {
    if (forceOpen) {
      setOpen(true);
    }
  }, [forceOpen]);

  useEffect(() => {
    if (!open && onClose) {
      onClose!();
    }
  }, [open]);

  return (
    <>
      <div className={classNames("fixed bottom-4 right-4 z-40", className)}>
        <div
          className={classNames(
            "relative cursor-pointer rounded-full drop-shadow-sm transition-all ease-in-out",
            title
              ? "scrollbar-hide border-edenGreen-600 hover:bg-edenGreen-100 flex h-[calc(3rem+4px)] items-center justify-between overflow-hidden border-2 bg-white pl-4"
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
              "bg-edenPink-400 flex h-12 w-12 transform cursor-pointer items-center justify-center rounded-full transition-all ease-in-out",
              open ? "-rotate-45" : "rotate-0",
              title ? "absolute right-0 float-right" : ""
            )}
          >
            {open ? (
              <EdenIconQuestion className="h-8 w-8" />
            ) : (
              <EdenIconExclamationAndQuestion className="h-8 w-8" />
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
          <div className="absolute bottom-14 right-0 max-w-lg overflow-hidden">
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
          className="fixed left-0 top-0 z-30 h-screen w-screen"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(false);
          }}
        ></div>
      )}
    </>
  );
};
