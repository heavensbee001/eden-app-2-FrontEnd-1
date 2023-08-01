/* eslint-disable @next/next/no-img-element */
import "./styles.css";

import { UserContext } from "@eden/package-context";
import { useContext, useEffect, useRef, useState } from "react";

// import { AiOutlineSend } from "react-icons/ai";
// import { CiLocationArrow1 } from "react-icons/ci";
// import { Card } from "../..";

export interface IChatSimple {
  chatN?: any;
  handleSentMessage?: any;
  placeholder?: any;
  headerText?: string;
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
        everyday You can save your search and we&apos;ll notify you of a new
        match
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
  headerText,
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

  // console.log("chatN = ", chatN.date);

  useEffect(() => {
    const lastMessage = document.querySelector(`.chat-message:last-child`);

    if (lastMessage) {
      lastMessage.scrollIntoView({ behavior: "smooth", inline: "end" });
    }
  }, [chatN]);

  // const currentTime = () => {
  //   // Get current date
  //   const now: Date = new Date();

  //   // Get hours
  //   let hours: number = now.getHours();

  //   // Create a string for the period of the day
  //   const period: string = hours >= 12 ? "PM" : "AM";

  //   // Convert hours to 12-hour format
  //   hours = hours % 12;
  //   // The hour '0' should be '12'
  //   hours = hours ? hours : 12;

  //   // Get minutes
  //   const minutes: number = now.getMinutes();

  //   // Pad minutes with a zero (if less than 10)
  //   const minutesFormatted: string =
  //     minutes < 10 ? "0" + minutes.toString() : minutes.toString();

  //   // Create the time string
  //   const time: string =
  //     hours.toString() + ":" + minutesFormatted + " " + period;

  //   return time;
  // };

  return (
    <>
      <div className="flex h-full flex-col justify-between">
        <div className="h-full">
          <div className="border h-full border-edenGray-100 bg-white overflow-hidden rounded-md">
            {headerText && (
              <section className="h-[2.75rem] flex items-center border-b border-edenGray-100">
                <h3 className="text-center w-full text-edenGreen-600">
                  {headerText}
                </h3>
              </section>
            )}
            <section
              className={classNames(
                "scrollbar-hide overflow-y-scroll border-b border-edenGray-100 transition-height ease-in-out",
                headerText
                  ? inputMessage.length < 50
                    ? "h-[calc(100%-7.75rem)]"
                    : "h-[calc(100%-12.75rem)]"
                  : inputMessage.length < 50
                  ? "h-[calc(100%-5rem)]"
                  : "h-[calc(100%-10rem)]"
              )}
            >
              <div
                ref={componentRef}
                // className="h-full overflow-y-auto bg-white p-4"
                className="scrollbar-thumb-blue h-full scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-hide scrolling-touch flex flex-col px-6 py-4"
              >
                {/* <div className="p:2 flex h-screen flex-1 flex-col justify-between sm:p-6"> */}
                {/* <p className="text-lg font-bold">Message Title</p> */}
                <div className="">
                  {chatN && chatN.length ? (
                    <>
                      {chatN.map((chat: any, index: any) => (
                        <div className="chat-message mb-4" key={index}>
                          <div
                            className={classNames(
                              chat.user === "01" ? "" : "justify-end",
                              "flex items-start"
                            )}
                          >
                            <div
                              className={classNames(
                                chat.user === "01" ? "order-2" : "order-1",
                                "mx-2 flex max-w-[78%] flex-col items-start space-y-2 text-xs"
                              )}
                            >
                              <div className="relative">
                                <div>
                                  {chat.user !== "01" && (
                                    <>
                                      <span className="text-xs text-edenGray-700 font-semibold float-right">
                                        {currentUser?.discordName}
                                      </span>
                                    </>
                                  )}

                                  {chat.user !== "02" && (
                                    <>
                                      <span className="font-Moret text-edenGreen-600 text-sm font-semibold">
                                        Eden
                                      </span>
                                    </>
                                  )}
                                </div>

                                <span
                                  className={classNames(
                                    chat.user === "01"
                                      ? "bg-edenPink-300"
                                      : "bg-edenGray-100",
                                    "inline-block whitespace-pre-wrap rounded-lg p-4 text-xs"
                                  )}
                                >
                                  {chat.message}
                                </span>
                                <div
                                  className={classNames(
                                    "h-4 w-4 absolute bottom-2 -rotate-45 rounded-sm",
                                    chat.user === "01"
                                      ? "bg-edenPink-300 -left-[0.3rem]"
                                      : "bg-edenGray-100 -right-[0.3rem]"
                                  )}
                                ></div>
                              </div>
                            </div>
                            {/* <img
                            src={Users[chat.user].img}
                            alt="My profile"
                            className="order-1 h-8 w-8 rounded-full"
                          /> */}
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
            </section>
            <section
              className={classNames(
                "flex w-full items-center justify-between px-3 gap-3 transition-height ease-in-out",
                inputMessage.length < 50 ? "h-20" : "h-40"
              )}
            >
              <textarea
                className={classNames(
                  "rounded-md border transition-height ease-in-out border-edenGray-500 max-height: 200px; height: 24px; overflow-y: hidden; w-11/12 resize-none bg-transparent py-4 px-4 focus:outline-none",
                  inputMessage.length < 50 ? "h-[3.6rem]" : "h-[8.6rem]"
                )}
                placeholder="Type your message here..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (inputMessage.length > 0 && e.code == "Enter") {
                    handleSentMessage(inputMessage, "02");
                    e.preventDefault();
                    setInputMessage("");
                  }
                }}
              />
              <button
                className={classNames(
                  "flex h-[38px] w-[38px] items-center justify-center border border-edenGray-100 rounded-full overflow-hidden",
                  inputMessage ? "cursor-pointer" : "bg-edenGray-100"
                )}
                disabled={!inputMessage}
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
                  <div className="">
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
              </button>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};
