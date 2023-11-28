import { gql, useMutation } from "@apollo/client";
import { Maybe, Members } from "@eden/package-graphql/generated";
import { classNames } from "@eden/package-ui/utils";
import { CheckCircleIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
// import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

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
  const [editLetter, setEditLetter] = useState(false);
  // const [editClickCount, setEditClickCount] = useState(0);

  const { register, handleSubmit, setValue } = useForm<any>({
    defaultValues: {
      letter: letterContent || "",
    },
  });
  const [rejectionLetter] = useMutation(REJECTION_LETTER, {
    onCompleted({ rejectionLetter }) {
      setValue("letter", rejectionLetter.generatedLetter);
      setLetterContent(rejectionLetter.generatedLetter);
    },
  });

  const [secondInterviewLetter] = useMutation(SECOND_INTERVIEW_LETTER, {
    onCompleted({ secondInterviewLetter }) {
      setValue("letter", secondInterviewLetter.generatedLetter);
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
  const editInputClasses =
    "inline-block bg-transparent -my-[2px] -mx-2 h-fit w-[40rem] border-2 border-utilityOrange px-1 rounded-md outline-utilityYellow remove-arrow focus:outline-none whitespace-pre-line";

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

  const onSubmitLetter = (data: any) => {
    console.log("submiting =========");
    setLetterContent(data.letter);
    console.log("letter content", letterContent);
    setEditLetter(false);
  };

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

          <div className="w- h-[86hv] border-2 bg-white px-4 pb-4 pt-2">
            {letterContent ? (
              <div>
                <div id="text-to-copy" className="h-fit w-full ">
                  <div className="relative "></div>
                  {editLetter ? (
                    <form
                      className="flex h-full w-full flex-col items-center"
                      onSubmit={handleSubmit(onSubmitLetter)}
                    >
                      <>
                        <textarea
                          {...register("letter")}
                          className={classNames(editInputClasses)}
                          rows={12}
                        />
                        <Button
                          variant="secondary"
                          className="mt-4"
                          type="submit"
                        >
                          Done Editing
                        </Button>
                      </>
                    </form>
                  ) : (
                    <span className="whitespace-pre-line">
                      <div className="flex justify-end">
                        {!editLetter && (
                          <div
                            className="shadow-md hover:cursor-pointer"
                            onClick={() => {
                              setEditLetter(true);
                            }}
                          >
                            <svg
                              width="21"
                              height="21"
                              viewBox="0 0 21 21"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                className="fill-edenGreen-600 hover:fill-edenGreen-500"
                                d="M9.492 0.0364C9.906 0.0364 10.242 0.3724 10.242 0.7864C10.242 1.2004 9.906 1.5364 9.492 1.5364H5.753C3.169 1.5364 1.5 3.3064 1.5 6.0454V14.3594C1.5 17.0984 3.169 18.8684 5.753 18.8684H14.577C17.161 18.8684 18.831 17.0984 18.831 14.3594V10.3314C18.831 9.9174 19.167 9.5814 19.581 9.5814C19.995 9.5814 20.331 9.9174 20.331 10.3314V14.3594C20.331 17.9534 18.018 20.3684 14.577 20.3684H5.753C2.312 20.3684 0 17.9534 0 14.3594V6.0454C0 2.4514 2.312 0.0364 5.753 0.0364H9.492ZM18.2016 0.915L19.4186 2.132C20.0116 2.724 20.3376 3.511 20.3366 4.349C20.3366 5.187 20.0106 5.973 19.4186 6.564L11.9096 14.073C11.3586 14.624 10.6246 14.928 9.8446 14.928H6.0986C5.8966 14.928 5.7026 14.846 5.5616 14.701C5.4206 14.557 5.3436 14.362 5.3486 14.159L5.4426 10.38C5.4616 9.628 5.7646 8.921 6.2966 8.388L13.7706 0.915C14.9926 -0.305 16.9796 -0.305 18.2016 0.915ZM13.155 3.651L7.3576 9.449C7.0986 9.708 6.9516 10.052 6.9426 10.417L6.8676 13.428H9.8446C10.2246 13.428 10.5806 13.281 10.8496 13.012L16.682 7.178L13.155 3.651ZM14.8306 1.976L14.215 2.59L17.742 6.118L18.3586 5.503C18.6666 5.195 18.8366 4.785 18.8366 4.349C18.8366 3.912 18.6666 3.501 18.3586 3.193L17.1416 1.976C16.5046 1.341 15.4686 1.341 14.8306 1.976Z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      {letterContent}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex h-96 w-96 animate-pulse space-x-4">
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-3 w-24 rounded bg-slate-200"></div>
                  <div className="h-3 rounded bg-slate-200 "></div>
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
