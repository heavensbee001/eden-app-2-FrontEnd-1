import { Members, SummaryQuestionType } from "@eden/package-graphql/generated";
import {
  BackgroundMatchChart,
  PopoverScoreReason,
  TextHeading2,
  TextInputLabel,
  TextLabel1,
} from "@eden/package-ui";
import { FC, useEffect, useState } from "react";

// const exampleData = [
//   {
//     questionID: "1242",
//     questionContent: "Experience",
//     userPercentage: 75,
//     averagePercentage: 55,
//   },
//   {
//     questionID: "9521",
//     questionContent: "WFH or Office",
//     userPercentage: 35,
//     averagePercentage: 45,
//   },
//   {
//     questionID: "2222",
//     questionContent: "Skill",
//     userPercentage: 85,
//     averagePercentage: 75,
//   },
//   {
//     questionID: "1211",
//     questionContent: "Industry exp",
//     userPercentage: 90,
//     averagePercentage: 40,
//   },
// ];

type Props = {
  member?: Members;
  summaryQuestions?: SummaryQuestionType[];
};

type BarChartQuestions = {
  questionID: string;
  questionContent: string;
  userPercentage: number;
  averagePercentage: number;
};

export const MatchTab: FC<Props> = ({ member, summaryQuestions }) => {
  // console.log("summaryQuestions = 22", summaryQuestions);

  const [dataBarChart, setDataBarChart] = useState<BarChartQuestions[]>([]);

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
      <div className="mb-8 grid grid-cols-4">
        <div className="col-span-1"></div>
        <div className="col-span-2">
          <p className="mb-2 text-center">
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
        <div className="col-span-1"></div>
      </div>
      <p className="mb-2 text-center">
        <TextLabel1>Expertise</TextLabel1>
      </p>
      <div
        className={`mx-auto mb-2 grid grid-cols-3 gap-4`}
        // className={`mx-auto grid grid-cols-${
        //   summaryQuestions?.length === 1 ? 3 : summaryQuestions?.length
        // } gap-4`}
      >
        {summaryQuestions
          ? summaryQuestions.map((item, index) => (
              <div
                key={index}
                className="z-20 h-full rounded-md border shadow-sm transition ease-in-out hover:scale-[1.02] hover:bg-lime-50 hover:shadow-lime-200"
              >
                <PopoverScoreReason question={item}>
                  <div className="px-4 pb-4 pt-2">
                    <div className="mx-auto mb-2 flex h-10 items-center justify-center">
                      <p className="text-center">
                        <TextLabel1 className="text-black">
                          {item.questionContentSmall?.replace(".", "")}
                        </TextLabel1>
                      </p>
                    </div>
                    <div className="">
                      <div className="flex h-full items-center justify-center">
                        <TextInputLabel className="mr-auto text-xs text-black">
                          {item.answerContentSmall?.replace(".", "")}
                        </TextInputLabel>
                        {item.score ? (
                          <div className="ml-1 font-black">
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
              </div>
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
    </div>
  );
};
