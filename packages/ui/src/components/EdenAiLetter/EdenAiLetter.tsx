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

export const EdenAiLetter = ({
  isModalOpen,
  member,
  letterType,
}: IEdenAiLetter) => {
  const router = useRouter();
  const { positionID } = router.query;
  const [letterContent, setLetterContent] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = () => {
    const range = document.createRange();
    const selection = window.getSelection();

    const textToCopy = document.getElementById("text-to-copy");

    if (textToCopy) {
      range.selectNodeContents(textToCopy);
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand("copy");
        selection.removeAllRanges();
      }
    }

    setCopied(true);
  };

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
      <Modal open={isModalOpen}>
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
                <div className="flex  items-center gap-2">
                  <Button disabled onClick={handleCopyToClipboard}>
                    Copied Message To Clipboard
                  </Button>
                  <span className=" text-lg text-green-600">
                    <CheckCircleIcon className="h-8 w-8" aria-hidden="true" />
                  </span>
                </div>
              ) : (
                <Button
                  className="bg-cottonPink hover:bg-forestGreen hover:text-white"
                  onClick={handleCopyToClipboard}
                >
                  Copy Message To Clipboard
                </Button>
              ))}
          </div>
        </div>
      </Modal>
    </>
  );
};
