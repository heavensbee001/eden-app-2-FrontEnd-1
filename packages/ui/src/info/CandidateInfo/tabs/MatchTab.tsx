import { Members, SummaryQuestionType } from "@eden/package-graphql/generated";
import {
  BackgroundMatchChart,
  Card,
  PopoverScoreReason,
  TextHeading2,
  TextInputLabel,
  TextLabel1,
} from "@eden/package-ui";
import { FC, useEffect, useState } from "react";

type SummaryQuestion = SummaryQuestionType & {
  subConversationAnswer: {
    content: string;
    role: string;
    _typename: string;
  }[];
};

type Props = {
  member?: Members;
  summaryQuestions?: SummaryQuestion[];
};

type BarChartQuestions = {
  questionID: string;
  questionContent: string;
  userPercentage: number;
  averagePercentage: number;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const MatchTab: FC<Props> = ({ member, summaryQuestions }) => {
  console.log("summaryQuestions = 22", summaryQuestions);

  const [dataBarChart, setDataBarChart] = useState<BarChartQuestions[]>([]);

  const [summaryQuestionSelected, setSummaryQuestionSelected] = useState<
    SummaryQuestion[]
  >([]);

  useEffect(() => {
    const dataBarChartPr: BarChartQuestions[] = [];

    summaryQuestions?.forEach((question: any) => {
      console.log("question = ", question);

      if (question?.score) {
        dataBarChartPr.push({
          questionID: question?.questionID,
          questionContent: question?.questionContentSmall,
          userPercentage: question?.score * 10,
          averagePercentage: 50, // change later to the average of users
        });
      }
    });

    setDataBarChart(dataBarChartPr);
  }, [summaryQuestions]);

  return (
    <div className="pt-4">
      <div className="grid grid-cols-2">
        <div className="col-span-1">
          <p className="text-center">
            <TextLabel1>Background match</TextLabel1>
          </p>
          {/* <BackgroundMatchChart
            memberName={member?.discordName ?? ""}
            backgroundMatchData={exampleData}
          /> */}
          {dataBarChart.length > 0 && (
            <BackgroundMatchChart
              memberName={member?.discordName ?? ""}
              backgroundMatchData={dataBarChart}
            />
          )}
        </div>
      </div>
      <p className="text-soilHeading3 font-poppins mb-2 mt-6 text-center font-black text-gray-400">
        EXPERTISE
      </p>
      <div
        className={`mx-auto my-4 grid grid-cols-${
          summaryQuestions?.length === 1 ? 3 : summaryQuestions?.length
        } gap-4`}
      >
        {summaryQuestions
          ? summaryQuestions.map((item: any, index: number) => (
              <PopoverScoreReason size="lg" key={index} question={item}>
                <div
                  className="hover:bg-blue-200 cursor-pointer"
                  onClick={() => setSummaryQuestionSelected(item)}
                >
                  <div className="w- mx-auto flex h-16 items-center justify-center">
                    <p className="text-center">
                      <TextLabel1 className="text-black">
                        {item.questionContentSmall?.replace(".", "")}
                      </TextLabel1>
                    </p>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center justify-center">
                      <TextInputLabel className="text-xs text-black">
                        {item.answerContentSmall?.replace(".", "")}
                      </TextInputLabel>
                      {item.score ? (
                        <div className="font-black">
                          <TextHeading2
                            className={`${
                              index % 2
                                ? "text-soilPurple"
                                : index % 3
                                ? "text-soilOrange"
                                : "text-soilTurquoise"
                            }`}
                          >
                            {item.score * 10}%
                          </TextHeading2>
                        </div>
                      ) : //  : (
                      //   <TextInputLabel className="text-xs text-black">
                      //     {item.answerContentSmall.replace(".", "")}
                      //   </TextInputLabel>
                      // )
                      null}
                    </div>
                  </div>
                </div>
              </PopoverScoreReason>
            ))
          : null}
      </div>
      {/* <p className="text-soilHeading3 font-poppins mb-6 text-center font-black text-gray-400">
        CULTURE FIT
      </p>
      <div
        className={`mx-auto grid grid-cols-${
          summaryQuestions?.length || 4
        } gap-4`}
      >
        {summaryQuestions
          ? summaryQuestions?.map((item, index) => (
              <PopoverScoreReason size="lg" key={index} question={item}>
                <div className="hover:bg-blue-200">
                  <div className="mx-auto flex h-16 w-auto items-center justify-center">
                    <p className="text-center">
                      <TextLabel1 className="text-black">
                        {item.questionContentSmall.replace(".", "")}
                      </TextLabel1>
                    </p>
                  </div>
                  <div className="mx-auto flex items-center justify-center">
                    <p className="text-center">
                      <TextLabel1 className="text-soilPurple">
                        {item.answerContentSmall.replace(".", "")}
                      </TextLabel1>
                    </p>
                  </div>
                </div>
              </PopoverScoreReason>
            ))
          : null}
      </div> */}

      <Card border shadow className="h-6/10 mt-4 overflow-scroll bg-white">
        <div className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-hide scrolling-touch flex flex-col space-y-4 p-3">
          <div className="my-4">
            {summaryQuestionSelected &&
            summaryQuestionSelected.subConversationAnswer
              ? summaryQuestionSelected.subConversationAnswer.map(
                  (conversation: any, index: number) => (
                    <>
                      <div className="chat-message p-2" key={index}>
                        <div
                          className={classNames(
                            conversation.role == "assistant"
                              ? ""
                              : "justify-end",
                            "flex items-start"
                          )}
                        >
                          <div
                            className={classNames(
                              conversation.role == "assistant"
                                ? "order-2"
                                : "order-1",
                              "mx-2 flex max-w-[78%] flex-col items-start space-y-2 text-xs"
                            )}
                          >
                            <span
                              // className="inline-block rounded-lg rounded-bl-none bg-gray-300 px-4 py-2 text-gray-600"
                              className={classNames(
                                conversation.role == "assistant"
                                  ? "rounded-tl-none border border-[#D1E4EE] bg-[#EDF2F7]"
                                  : "rounded-tr-none border border-[#BDECF6] bg-[#D9F5FD]",
                                "inline-block whitespace-pre-wrap rounded-lg px-4 py-2"
                              )}
                            >
                              {conversation.content}
                            </span>
                          </div>
                          {/* <img
                          src={Users[chat.user].img}
                          alt="My profile"
                          className="order-1 h-6 w-6 rounded-full"
                        /> */}
                        </div>
                      </div>
                      <hr
                        style={{
                          border: "1",
                          borderTop: "medium double #CCC",
                          height: "1px",
                          overflow: "visible",
                          padding: "0",
                          color: "#CCC",
                          textAlign: "center",
                          marginTop: "10px",
                          marginBottom: "56px",
                        }}
                      />
                    </>
                  )
                )
              : null}
          </div>
        </div>
      </Card>
    </div>
  );
};
