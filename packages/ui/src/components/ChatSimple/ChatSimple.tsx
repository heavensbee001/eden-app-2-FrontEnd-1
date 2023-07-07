/* eslint-disable @next/next/no-img-element */
import "./styles.css";

import { UserContext } from "@eden/package-context";
import { useContext, useEffect, useRef, useState } from "react";

// import { AiOutlineSend } from "react-icons/ai";
// import { CiLocationArrow1 } from "react-icons/ci";
import { Card } from "../..";

export interface IChatSimple {
  chatN?: any;
  handleSentMessage?: any;
  placeholder?: any;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const __PLACEHOLDER = (
  <div className="flex flex-col items-center">
    <div className="mb-6 rounded-xl bg-lime-50 px-2 py-1">
      <p className="text-center leading-tight">
        Welcome to Eden!
        <br />
        <span className="text-sm">What are you looking for?</span>
      </p>
    </div>
    <ul className="text-center text-sm text-slate-300">
      <li className="mb-4">
        • Eden can find an amazing talent
        <br />
        Tailored to your requirements
      </li>
      <li className="mb-4">
        • New people are joining Eden network
        <br />
        everyday You can save your search and we’ll notify you of a new match
      </li>
      <li className="mb-4">
        • Can analyze your requests, from the
        <br />
        Most sophisticated, to the most high level
      </li>
    </ul>
  </div>
);

export const ChatSimple = ({
  chatN,
  handleSentMessage,
  placeholder = __PLACEHOLDER,
}: IChatSimple) => {
  const { currentUser } = useContext(UserContext);

  const componentRef = useRef<any>(null);
  const Users: any = {
    "01": {
      name: "EdenAI",
      img: "https://pbs.twimg.com/profile_images/1595723986524045312/fqOO4ZI__400x400.jpg",
    },
    "02": {
      name: "User",
      img: currentUser?.discordAvatar,
    },
  };

  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    // Keep the scroll position at the bottom of the component
    componentRef.current.scrollTop = componentRef.current.scrollHeight;
    // console.log(
    //   "componentRef.current.scrollHeight = ",
    //   componentRef.current.scrollHeight
    // );
  });

  // console.log("chatN = ", chatN);

  useEffect(() => {
    const lastMessage = document.querySelector(`.chat-message:last-child`);

    if (lastMessage) {
      lastMessage.scrollIntoView({ behavior: "smooth", inline: "end" });
    }
  }, [chatN]);

  return (
    <>
      <div className="flex h-full flex-col justify-between 2xl:pb-0">
        <div className="h-[calc(100%-38px)] py-4 ">
          <Card border shadow className="h-full overflow-scroll bg-white ">
            <div
              ref={componentRef}
              // className="h-full overflow-y-auto bg-white p-4"
              className="scrollbar-thumb-blue scrollbar-thumb-rounded  scrollbar-track-blue-lighter scrollbar-hide scrolling-touch flex flex-col space-y-4 p-3"
            >
              {/* <div className="p:2 flex h-screen flex-1 flex-col justify-between sm:p-6"> */}
              {/* <p className="text-lg font-bold">Message Title</p> */}
              <div className="my-4 ">
                {chatN && chatN.length ? (
                  <>
                    {chatN.map((chat: any, index: any) => (
                      <div className="chat-message p-2" key={index}>
                        <div
                          className={classNames(
                            chat.user == "01" ? "" : "justify-end",
                            "flex items-start"
                          )}
                        >
                          <div
                            className={classNames(
                              chat.user == "01" ? "order-2" : "order-1",
                              "mx-2 flex max-w-[78%] flex-col items-start space-y-2 text-xs"
                            )}
                          >
                            <span
                              // className="inline-block rounded-lg rounded-bl-none bg-gray-300 px-4 py-2 text-gray-600"
                              className={classNames(
                                chat.user == "01"
                                  ? "rounded-tl-none border border-[#D1E4EE] bg-[#EDF2F7]"
                                  : "rounded-tr-none border border-[#BDECF6] bg-[#D9F5FD]",
                                "inline-block whitespace-pre-wrap rounded-lg px-4 py-2"
                              )}
                            >
                              {chat.message}
                            </span>
                          </div>
                          <img
                            src={Users[chat.user].img}
                            alt="My profile"
                            className="order-1 h-6 w-6 rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                    {chatN[chatN.length - 1].user == "02" ? (
                      <div className="chat-message flex items-center space-x-[5px] rounded-full pl-2">
                        <div
                          className="h-[6px] w-[6px] animate-bounce  rounded-full bg-gray-300"
                          style={{ animationDelay: "100ms" }}
                        ></div>
                        <div
                          className="h-[6px] w-[6px] animate-bounce rounded-full bg-gray-300"
                          style={{ animationDelay: "200ms" }}
                        ></div>
                        <div
                          className="h-[6px] w-[6px] animate-bounce  rounded-full bg-gray-300"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    ) : null}
                  </>
                ) : (
                  placeholder
                )}
              </div>
            </div>
          </Card>
        </div>
        <Card
          border
          shadow
          className="flex items-center justify-between bg-white px-3"
        >
          <textarea
            className="max-height: 200px; height: 24px; overflow-y: hidden; m-0 w-full resize-none border-0 bg-transparent  py-4 pl-3 pr-10 focus:outline-none  md:pl-0 md:pr-12"
            placeholder="Type your message here..."
            value={inputMessage}
            rows={inputMessage.length < 50 ? 1 : 4}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (inputMessage.length > 0 && e.code == "Enter") {
                handleSentMessage(inputMessage, "02");
                e.preventDefault();
                setInputMessage("");
              }
            }}
          />
          <div
            className="flex h-[38px] w-[38px] cursor-pointer items-center justify-center"
            onClick={() => {
              handleSentMessage(inputMessage, "02");

              setInputMessage("");
            }}
          >
            {inputMessage === "" ? (
              <div>
                <svg
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M3.3938 2.20468C3.70395 1.96828 4.12324 1.93374 4.4679 2.1162L21.4679 11.1162C21.7953 11.2895 22 11.6296 22 12C22 12.3704 21.7953 12.7105 21.4679 12.8838L4.4679 21.8838C4.12324 22.0662 3.70395 22.0317 3.3938 21.7953C3.08365 21.5589 2.93922 21.1637 3.02382 20.7831L4.97561 12L3.02382 3.21692C2.93922 2.83623 3.08365 2.44109 3.3938 2.20468ZM6.80218 13L5.44596 19.103L16.9739 13H6.80218ZM16.9739 11H6.80218L5.44596 4.89699L16.9739 11Z"
                    fill="#9CA3AF"
                  />
                </svg>
              </div>
            ) : (
              <div className="bg-cottonPink  rounded-lg  p-2">
                <svg
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M3.3938 2.20468C3.70395 1.96828 4.12324 1.93374 4.4679 2.1162L21.4679 11.1162C21.7953 11.2895 22 11.6296 22 12C22 12.3704 21.7953 12.7105 21.4679 12.8838L4.4679 21.8838C4.12324 22.0662 3.70395 22.0317 3.3938 21.7953C3.08365 21.5589 2.93922 21.1637 3.02382 20.7831L4.97561 12L3.02382 3.21692C2.93922 2.83623 3.08365 2.44109 3.3938 2.20468ZM6.80218 13L5.44596 19.103L16.9739 13H6.80218ZM16.9739 11H6.80218L5.44596 4.89699L16.9739 11Z"
                    fill="#00462C"
                  />
                </svg>
              </div>
            )}
          </div>
          {/* <button
            className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
            onClick={() => {
              handleSentMessage(inputMessage, "02");

              setInputMessage("");
            }}
          >
            Send
          </button> */}
        </Card>
      </div>
    </>
  );
};
