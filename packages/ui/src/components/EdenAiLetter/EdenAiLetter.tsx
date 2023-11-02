import { gql, useMutation } from "@apollo/client";
import { Maybe, Members } from "@eden/package-graphql/generated";
import { CheckCircleIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
// import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { Button, Modal } from "../../elements";

export interface IEdenAiLetter {
  isModalOpen: boolean;
  member: Maybe<Members>;
  letterType: "rejection" | "nextInterviewInvite" | undefined;
  onClose: () => void;
  onSubmit?: () => void;
}

export const REJECTION_LETTER = gql`
  mutation ($fields: rejectionLetterInput!) {
    rejectionLetter(fields: $fields) {
      generatedLetter
    }
  }
`;

export const SECOND_INTERVIEW_LETTER = gql`
  mutation ($fields: secondInterviewLetterInput!) {
    secondInterviewLetter(fields: $fields) {
      generatedLetter
    }
  }
`;

const UPDATE_QUERY_RESPONSE = gql`
  mutation UpdateQueryResponse($fields: updateQueryResponseInput) {
    updateQueryResponse(fields: $fields) {
      _id
      sender {
        positionID
        userID
      }
      responder {
        positionID
        userID
      }
      phase
      question {
        content
      }
      answer {
        content
      }
      category
    }
  }
`;

export const EdenAiLetter = ({
  isModalOpen,
  member,
  letterType,
  onClose,
  onSubmit,
}: IEdenAiLetter) => {
  const router = useRouter();
  const { positionID } = router.query;
  const [letterContent, setLetterContent] = useState("");
  const [copied, setCopied] = useState(false);

  const [rejectionLetter] = useMutation(REJECTION_LETTER, {
    onCompleted({ rejectionLetter }) {
      setLetterContent(rejectionLetter.generatedLetter);
    },
  });

  const [secondInterviewLetter] = useMutation(SECOND_INTERVIEW_LETTER, {
    onCompleted({ secondInterviewLetter }) {
      setLetterContent(secondInterviewLetter.generatedLetter);
    },
  });

  const [sendTgMessage] = useMutation(UPDATE_QUERY_RESPONSE, {
    onCompleted({}) {
      onSubmit!();
      onClose!();
    },
  });

  // const handleCopyToClipboard = () => {
  //   const range = document.createRange();
  //   const selection = window.getSelection();

  //   const textToCopy = document.getElementById("text-to-copy");

  //   if (textToCopy) {
  //     range.selectNodeContents(textToCopy);
  //     if (selection) {
  //       selection.removeAllRanges();
  //       selection.addRange(range);
  //       document.execCommand("copy");
  //       selection.removeAllRanges();
  //     }
  //   }

  //   setCopied(true);
  // };

  const handleAccept = () => {
    if (letterContent) {
      console.log("Accept");
      sendTgMessage({
        variables: {
          fields: {
            phase: "QUERY",
            senderID: positionID,
            senderType: "POSITION",
            responderID: member?._id,
            responderType: "USER",
            question: letterContent,
            category: "ACCEPT_CANDIDATE",
          },
        },
      });
    }
  };
  const handleReject = () => {
    console.log("Reject");
    if (letterContent) {
      console.log("Accept");
      sendTgMessage({
        variables: {
          fields: {
            phase: "QUERY",
            senderID: positionID,
            senderType: "POSITION",
            responderID: member?._id,
            responderType: "USER",
            question: letterContent,
            category: "REJECT_CANDIDATE",
          },
        },
      });
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      if (letterType === "rejection") {
        rejectionLetter({
          variables: {
            fields: {
              positionID: positionID,
              userID: member?._id,
            },
          },
        });
      } else if (letterType === "nextInterviewInvite") {
        secondInterviewLetter({
          variables: {
            fields: {
              positionID: positionID,
              userID: member?._id,
            },
          },
        });
      }
    }

    return () => {
      setLetterContent("");
      setCopied(false);
    };
  }, [isModalOpen, letterType, member, positionID]);

  return (
    <>
      <Modal open={isModalOpen} onClose={onClose}>
        <div className="flex flex-col items-center justify-end gap-10 space-y-6 ">
          <div className="w-full  font-medium">
            {letterType === "rejection" ? (
              <>
                <h2 className=" text-xl  font-bold">
                  Personalized Rejection Message
                </h2>
                <p className="text-sm font-medium text-gray-500">
                  {member &&
                    `Copy/Paste the following personalized message to gracefully reject ${member.discordName}.`}
                </p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold">Personalized Invite</h2>
                <p className="text-sm font-medium text-gray-500">
                  {member &&
                    `Copy/Paste the following personalized message to invite ${member.discordName} for a second interview.`}
                </p>
              </>
            )}
          </div>

          <div className="h-[86hv] border-2 bg-white p-4">
            {/* <TextArea
                  onChange={(e) => setLetterContent(e.target.value)}
                  className="whitespace-pre-line"
                >
                  {/* {letterContent}
                </TextArea> */}
            {letterContent ? (
              <div id="text-to-copy" className="h-fit w-fit ">
                <p className="whitespace-pre-line">{letterContent}</p>
              </div>
            ) : (
              <div className="flex h-96 w-96 animate-pulse space-x-4">
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-3 w-24 rounded bg-slate-200"></div>
                  <div className="h-3 rounded bg-slate-200"></div>
                  <div className="h-3 rounded bg-slate-200"></div>
                  <div className="h-3 rounded bg-slate-200"></div>
                  <div className="h-3 rounded bg-slate-200"></div>
                  <div className="h-3 rounded bg-slate-200"></div>
                  <div className="h-3 rounded bg-slate-200"></div>
                  <div className="h-3 rounded bg-slate-200"></div>
                  <div className="h-3 rounded bg-slate-200"></div>
                  <div className="h-3 rounded bg-slate-200"></div>
                  <div className="h-3 rounded bg-slate-200"></div>
                  <div className="h-3 rounded bg-slate-200"></div>
                </div>
              </div>
            )}
          </div>
          <div>
            {letterContent &&
              (copied ? (
                <div className="flex items-center gap-2">
                  <Button disabled>Copied Message To Clipboard</Button>
                  <span className=" text-lg text-green-600">
                    <CheckCircleIcon className="h-8 w-8" aria-hidden="true" />
                  </span>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    if (letterType === "nextInterviewInvite") {
                      handleAccept();
                    } else if (letterType === "rejection") {
                      handleReject();
                    }
                  }}
                  disabled={!letterContent}
                >
                  {letterType === "nextInterviewInvite"
                    ? "Accept candidate"
                    : "Reject candidate"}
                </Button>
              ))}
          </div>
        </div>
      </Modal>
    </>
  );
};
