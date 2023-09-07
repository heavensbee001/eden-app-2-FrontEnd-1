import { gql, useMutation } from "@apollo/client";
import { FC, useState } from "react";
import { toast } from "react-toastify";

import { Button } from "../../elements/Button";
import { EdenIconExclamation } from "../../elements/EdenIcons/EdenIconExclamation";
import { Modal } from "../../elements/Modal";
import { EdenTooltip } from "../EdenTooltip";

export const UPDATE_QUERY_RESPONSE = gql`
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
      sentFlag
      question {
        content
      }
      answer {
        content
      }
    }
  }
`;

interface DatabaseItem {
  categoryName: string;
  title: string;
  score: number;
  reason: string;
  IDb: string;
}

export interface IEdenTooltipAskProps {
  item: DatabaseItem;
  positionId: string;
  candidateId: string;
  letter: string;
  color?: string;
}

export const EdenTooltipAsk: FC<IEdenTooltipAskProps> = ({
  item,
  positionId,
  candidateId,
  letter,
  // eslint-disable-next-line no-unused-vars
  color,
}: IEdenTooltipAskProps) => {
  const [updateQueryResponse, { loading: updateQueryResponseLoading }] =
    useMutation(UPDATE_QUERY_RESPONSE, {
      // eslint-disable-next-line no-unused-vars
      onCompleted({ updateQueryResponse }) {
        toast.success("Message sent successfully");
        setOpenModal(false);
      },
      // eslint-disable-next-line no-unused-vars
      onError(err) {
        toast.error("An error occurred while sending the message to candidate");
      },
    });

  const [openModal, setOpenModal] = useState<boolean>(false);
  const handleClick = () => {
    setOpenModal(true);
  };
  const handleSubmitQuestion = () => {
    updateQueryResponse({
      variables: {
        fields: {
          phase: "QUERY",
          sentFlag: false,
          senderID: positionId,
          senderType: "POSITION",
          responderID: candidateId,
          responderType: "USER",
          question: question,
        },
      },
    });
  };
  const [question, setQuestion] = useState("");

  return (
    <>
      <EdenTooltip
        id={item.title.split(" ").join("")}
        innerTsx={
          <div className="w-60">
            {letter === "?" || !item.reason ? (
              <div>
                <p className="text-gray-600 mb-4 text-sm leading-tight">
                  {
                    "The candidate hasn't provided information on this. Do you want me to reach out & find out for you?"
                  }
                </p>
                <Button
                  variant="secondary"
                  onClick={handleClick}
                  className="text-sm !py-1"
                >
                  Ask Candidate
                </Button>
              </div>
            ) : (
              <p className="text-gray-600 text-sm leading-tight">
                {item.reason}
              </p>
            )}
          </div>
        }
        place="top"
        effect="solid"
        backgroundColor="white"
        border
        borderColor="#e5e7eb"
        padding="0.5rem"
        {...(letter === "?" || !item.reason
          ? {
              delayHide: 300,
              clickable: true,
            }
          : {})}
      >
        <div className="bg-edenPink-200 cursor-pointer rounded-full p-1 w-5 h-5 absolute -right-2 -top-1">
          <EdenIconExclamation className="w-full h-full" />
        </div>
      </EdenTooltip>
      {openModal && (
        <Modal open={openModal} closeOnEsc onClose={() => setOpenModal(false)}>
          <p>{"The candidate hasn't provided information on this field:"}</p>
          <p className="font-bold mb-4">{item.title}</p>
          <p className="mb-4">What question do you want to ask?</p>
          <textarea
            name=""
            id=""
            rows={5}
            className={
              "w-full resize-none bg-transparent px-2 border-edenGray-200 border-box rounded-md border mb-4"
            }
            onChange={(e) => {
              setQuestion(e.currentTarget.value);
            }}
          />
          <Button
            variant="secondary"
            onClick={handleSubmitQuestion}
            className="mx-auto block"
            disabled={updateQueryResponseLoading || !question}
            loading={updateQueryResponseLoading}
          >
            Ask Candidate
          </Button>
        </Modal>
      )}
    </>
  );
};
