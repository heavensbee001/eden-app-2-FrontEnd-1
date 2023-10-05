"use client";

import { gql, useMutation, useSubscription } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import { Button, EdenAiProcessingModal } from "@eden/package-ui";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { BiChevronRight } from "react-icons/bi";
import { BsLightningFill } from "react-icons/bs";
import { toast } from "react-toastify";

export const INITIATE_CONNECTION_TG = gql`
  mutation ($fields: initiateConnectionTelegramInput) {
    initiateConnectionTelegram(fields: $fields) {
      done
      _id
      name
      telegram
      telegramChatID
      authTelegramCode
    }
  }
`;

export const MEMBER_DATA_CONNECTED_TG = gql`
  subscription ($fields: memberDataConnectedTGInput) {
    memberDataConnectedTG(fields: $fields) {
      _id
      conduct {
        telegram
        telegramChatID
        telegramConnectionCode
      }
    }
  }
`;

interface IConnectTelegramContainerProps {
  candidateTelegramID: string | undefined;
}

const ConnectTelegramContainer = ({
  candidateTelegramID = undefined,
}: IConnectTelegramContainerProps) => {
  const { currentUser } = useContext(UserContext);
  const userID = currentUser?._id;
  const router = useRouter();
  const { positionID } = router.query;

  const [submitting, setSubmitting] = useState(false);

  const [telegramAuthCode, setTelegramAuthCode] = useState<String>("");
  const [flagFinishTGconnection, setFlagFinishTGconnection] =
    useState<Boolean>(false);

  const [initiateConnectionTelegram, {}] = useMutation(INITIATE_CONNECTION_TG, {
    onCompleted({ initiateConnectionTelegram }) {
      console.log("data tl= ", initiateConnectionTelegram);

      if (initiateConnectionTelegram.authTelegramCode) {
        setTelegramAuthCode(initiateConnectionTelegram.authTelegramCode);
      }
    },
  });

  useSubscription(MEMBER_DATA_CONNECTED_TG, {
    variables: {
      fields: {},
    },
    onData: ({ data }) => {
      if (data?.data?.memberDataConnectedTG) {
        if (data?.data?.memberDataConnectedTG?._id == userID) {
          setFlagFinishTGconnection(true);
        }
      }
    },
  });

  const handleTelegramClick = () => {
    initiateConnectionTelegram({
      variables: {
        fields: {
          memberID: userID,
        },
      },
    });
  };

  return (
    <div className="mx-auto w-full max-w-2xl pt-10">
      {!telegramAuthCode && (
        <>
          <div className="text-center">
            {" "}
            <div
              className={
                "text-edenGreen-600 bg-edenPink-100 mx-auto mb-2 flex h-20 w-20 items-center justify-center rounded-full"
              }
            >
              <BsLightningFill size={"2rem"} />
            </div>
            <h1 className="text-edenGreen-600">Radical!</h1>
            <p className="mb-6">
              {"We're all set!"}
              {/* {"We're all set! expect to hear from us by x days"} */}
            </p>
          </div>
          {!candidateTelegramID ? (
            <p className="mb-4 text-center">
              {
                "We are only missing your Telegram account so we can communicate you any updates"
              }
            </p>
          ) : (
            <p className="mb-4 text-center">
              {"We'll reach you via Telegram if there are any updates"}
            </p>
          )}
        </>
      )}
      {/* To be removed */}
      {flagFinishTGconnection == false && !!candidateTelegramID && (
        <>
          {!telegramAuthCode ? (
            <Button
              variant="secondary"
              className="fixed bottom-4 right-4 z-40 mx-auto block opacity-0 hover:opacity-10"
              onClick={handleTelegramClick}
            >
              Connect Telegram
            </Button>
          ) : (
            telegramAuthCode && (
              <>
                <p className="mb-6 text-center">
                  Open EdenAI bot on Telegram and click{" "}
                  <span className="text-edenGreen-500 font-bold">/start</span>
                </p>
                <p className="mb-8 text-center">
                  <Link
                    target="_blank"
                    href={`https://t.me/${process.env.NEXT_PUBLIC_EDEN_TG_BOT}`}
                    className="inline text-center"
                  >
                    <Button variant="primary">
                      Go to Telegram
                      <BiChevronRight size="1.4rem" className="ml-2 inline" />
                    </Button>
                  </Link>
                </p>
                <p className="text-edenGray-500 text-center">
                  Your activation code is:
                </p>
                <div className="flex items-center justify-center">
                  <h2 className="text-edenGreen-600 text-center text-[5rem] tracking-widest">
                    {telegramAuthCode}
                  </h2>

                  <div>Hi!</div>

                  <Button
                    variant="primary"
                    className=" h-fit  w-fit border-none font-medium text-black "
                    onClick={() => {
                      navigator.clipboard.writeText(
                        telegramAuthCode.toString()
                      );
                      toast.success("Telegram Code copied to clipboard");
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      width={45}
                      height={45}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z"
                      />
                    </svg>
                  </Button>
                </div>
              </>
            )
          )}
        </>
      )}
      {/* ---------- */}
      {flagFinishTGconnection == false && !candidateTelegramID && (
        <>
          {!telegramAuthCode ? (
            <Button
              variant="secondary"
              className="mx-auto block"
              onClick={handleTelegramClick}
            >
              Connect Telegram
            </Button>
          ) : (
            telegramAuthCode && (
              <>
                <p className="mb-6 text-center">
                  Open EdenAI bot on Telegram and click{" "}
                  <span className="text-edenGreen-500 font-bold">/start</span>
                </p>
                <p className="mb-8 text-center">
                  <Link
                    target="_blank"
                    href={`https://t.me/${process.env.NEXT_PUBLIC_EDEN_TG_BOT}`}
                    className="inline text-center"
                  >
                    <Button variant="primary">
                      Go to Telegram
                      <BiChevronRight size="1.4rem" className="ml-2 inline" />
                    </Button>
                  </Link>
                </p>

                <p className="text-edenGray-500 text-center">
                  Your activation code is:
                </p>
                <div className="flex items-center justify-center">
                  <h2 className="text-edenGreen-600 text-center text-[5rem] tracking-widest">
                    {telegramAuthCode}
                  </h2>

                  <Button
                    variant="primary"
                    className=" h-fit  w-fit border-none font-medium text-black "
                    onClick={() => {
                      navigator.clipboard.writeText(
                        telegramAuthCode.toString()
                      );
                      toast.success("Telegram Code copied to clipboard");
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      width={45}
                      height={45}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z"
                      />
                    </svg>
                  </Button>
                </div>
              </>
            )
          )}
        </>
      )}

      {flagFinishTGconnection == true && (
        <p className="mb-4 text-center">Telegram Connected</p>
      )}

      <div className="absolute bottom-4 left-0 z-20 flex w-full justify-center">
        <Button
          className=""
          variant="secondary"
          onClick={() => {
            setSubmitting(true);
            router.push(`/interview/${positionID}/submitted`);
          }}
          disabled={!candidateTelegramID}
        >
          Submit
        </Button>
      </div>
      <div className="absolute bottom-4 z-20 mx-auto w-full max-w-2xl text-center">
        {submitting && (
          <EdenAiProcessingModal title="Submitting" open={submitting} />
        )}
      </div>
    </div>
  );
};

export default ConnectTelegramContainer;
