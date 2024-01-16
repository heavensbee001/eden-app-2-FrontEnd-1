import { gql, useMutation } from "@apollo/client";
import { Maybe, Members } from "@eden/package-graphql/generated";
import { classNames } from "@eden/package-ui/utils";
import { useRouter } from "next/router";
// import dynamic from "next/dynamic";
import { useEffect } from "react";
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

function isValidURL(url: string) {
  // Regular expression for a simple URL validation
  const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;

  return urlRegex.test(url);
}

export const EdenAiLetter = ({
  isModalOpen,
  member,
  letterType,
  onClose,
  onSubmit,
}: IEdenAiLetter) => {
  const router = useRouter();

  const { positionID } = router.query;

  const { register, setValue, watch, getValues } = useForm<any>({
    defaultValues: {
      letter: "",
    },
  });

  const [rejectionLetter, { loading: rejectionLetterLoading }] = useMutation(
    REJECTION_LETTER,
    {
      onCompleted({ rejectionLetter }) {
        setValue("letter", rejectionLetter.generatedLetter);
      },
    }
  );

  const [secondInterviewLetter, { loading: secondInterviewLetterLoading }] =
    useMutation(SECOND_INTERVIEW_LETTER, {
      onCompleted({ secondInterviewLetter }) {
        setValue("letter", secondInterviewLetter.generatedLetter);
      },
    });

  const [sendTgMessage] = useMutation(UPDATE_QUERY_RESPONSE, {
    onCompleted({}) {
      onSubmit!();
      onClose!();
    },
  });

  const handleAccept = () => {
    if (getValues("letter")) {
      console.log("Accept");
      sendTgMessage({
        variables: {
          fields: {
            phase: "QUERY",
            senderID: positionID,
            senderType: "POSITION",
            responderID: member?._id,
            responderType: "USER",
            question: getValues("letter"),
            scheduleInterviewUrl: getValues("url"),
            category: "ACCEPT_CANDIDATE",
          },
        },
      });
    }
  };
  const handleReject = () => {
    console.log("Reject");
    if (getValues("letter")) {
      console.log("Accept");
      sendTgMessage({
        variables: {
          fields: {
            phase: "QUERY",
            senderID: positionID,
            senderType: "POSITION",
            responderID: member?._id,
            responderType: "USER",
            question: getValues("letter"),
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
  }, [isModalOpen, letterType, member, positionID]);

  const editInputClasses =
    "inline-block bg-transparent border-2 border-edenGray-300 px-4 py-2 rounded-md remove-arrow focus:outline-none mb-8";

  return (
    <>
      <Modal open={isModalOpen} onClose={onClose}>
        <div className="flex flex-col items-center justify-end gap-2 space-y-6 ">
          <div className="w-full font-medium">
            {letterType === "rejection" ? (
              <>
                <h2 className="text-edenGreen-600 text-xl font-bold">
                  Personalized Rejection Message
                </h2>
                <p className="text-sm font-medium text-gray-500">
                  {member &&
                    `Please review the following personalized message to gracefully reject ${member.discordName}.`}
                </p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold">Personalized Invite</h2>
                <p className="text-sm font-medium text-gray-500">
                  {member &&
                    `Please review the following personalized message to invite ${member.discordName} for a second interview.`}
                </p>
              </>
            )}
          </div>

          <form className="flex h-full w-4/5 flex-col items-center">
            {rejectionLetterLoading || secondInterviewLetterLoading ? (
              letterLoader
            ) : (
              <textarea
                {...register("letter")}
                rows={12}
                className={classNames(editInputClasses, "w-full text-sm")}
              />
            )}
            {letterType === "nextInterviewInvite" && (
              <div className="w-full">
                <label htmlFor="url">Invite url</label>
                <p className="text-edenGray-500 mb-4 text-xs">
                  We recommend you to use{" "}
                  <a
                    className="hover:text-edenGray-400 underline"
                    href="https://calendly.com"
                    about="__blank"
                  >
                    calendly
                  </a>
                </p>
                <input
                  type="url"
                  pattern=""
                  id="url"
                  placeholder="paste here your invite url"
                  {...register("url")}
                  className={classNames(editInputClasses, "w-full")}
                />
              </div>
            )}
          </form>

          <Button
            onClick={() => {
              if (letterType === "nextInterviewInvite") {
                handleAccept();
              } else if (letterType === "rejection") {
                handleReject();
              }
            }}
            disabled={
              letterType === "nextInterviewInvite"
                ? !watch("letter") || !watch("url") || !isValidURL(watch("url"))
                : !watch("letter")
            }
          >
            {letterType === "nextInterviewInvite"
              ? "Accept candidate"
              : "Reject candidate"}
          </Button>
        </div>
      </Modal>
    </>
  );
};

const letterLoader = (
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
);
