import { gql, useMutation, useQuery } from "@apollo/client";
import { Members, SummaryQuestionType } from "@eden/package-graphql/generated";
import {
  BackgroundMatchChart,
  Card,
  PopoverScoreReason,
  TeamAttributeChart,
  TextHeading2,
  TextInputLabel,
  TextLabel1,
} from "@eden/package-ui";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { FC, useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";

const MEMBER_PIE_CHART_NODE_CATEGORY = gql`
  query ($fields: memberPieChartNodeCategoriesInput) {
    memberPieChartNodeCategories(fields: $fields) {
      categoryName
      percentage
    }
  }
`;

const MEMBER_RADIO_CHART_CHARACTER_ATTRIBUTES = gql`
  query ($fields: memberRadioChartCharacterAttributesInput) {
    memberRadioChartCharacterAttributes(fields: $fields) {
      attributeName
      score
      reason
    }
  }
`;

const dataRadarchart = [
  {
    memberInfo: {
      discordName: "Kwame",
      attributes: {
        Coordinator: 60,
        DirectorTP: 70,
        Helper: 70,
        Inspirer: 80,
        Motivator: 70,
        Observer: 90,
        Reformer: 50,
        Supporter: 40,
      },
    },
  },
];

ChartJS.register(ArcElement, Legend, Tooltip);

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

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const MatchTab: FC<Props> = ({ member, summaryQuestions }) => {
  // console.log("summaryQuestions = 22", summaryQuestions);

  const [dataBarChart, setDataBarChart] = useState<BarChartQuestions[]>([]);

  const [summaryQuestionSelected, setSummaryQuestionSelected] =
    useState<SummaryQuestionType>();

  console.log("member = ", member);

  interface ChartData {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
    }[];
  }

  const [pieChartData, setPieChartData] = useState<ChartData>({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
      },
    ],
  });

  const {} = useQuery(MEMBER_PIE_CHART_NODE_CATEGORY, {
    variables: {
      fields: {
        memberID: member?._id,
      },
    },
    skip: member?._id == undefined,
    onCompleted: (data) => {
      const labels = [];
      const dataPT = [];

      for (let i = 0; i < data.memberPieChartNodeCategories.length; i++) {
        const elementT = data.memberPieChartNodeCategories[i];

        labels.push(elementT.categoryName);

        dataPT.push(elementT.percentage);
      }

      setPieChartData({
        labels: labels,
        datasets: [
          {
            data: dataPT,
            backgroundColor: [
              "#F44336",
              "#E91E63",
              "#9C27B0",
              "#673AB7",
              "#3F51B5",
              "#2196F3",
              "#00BCD4",
              "#009688",
              "#4CAF50",
            ],
          },
        ],
      });
    },
  });

  type radiochartType = {
    memberInfo: {
      discordName: string;
      attributes: {
        [key: string]: number;
      };
    };
  };

  const [radioChart, setRadioChart] = useState<radiochartType[]>([]);

  const optionsRadar = {
    scales: {
      r: {
        suggestedMin: 30,
        suggestedMax: 100,
        ticks: {
          stepSize: 20, // Optional: Specify the step size between ticks
        },
      },
    },
  };

  const {} = useQuery(MEMBER_RADIO_CHART_CHARACTER_ATTRIBUTES, {
    variables: {
      fields: {
        memberID: member?._id,
      },
    },
    skip: member?._id == undefined,
    onCompleted: (data) => {
      interface attributesType {
        [key: string]: any;
      }
      const attributesT: attributesType = {};

      let averageScore = 0;
      let numT = 0;

      for (
        let i = 0;
        i < data.memberRadioChartCharacterAttributes.length;
        i++
      ) {
        const elementT: {
          attributeName: string;
          score: number;
          reason: string;
        } = data.memberRadioChartCharacterAttributes[i];

        if (elementT && elementT.attributeName) {
          let nameAtt = elementT.attributeName;

          // how to make maximum 11 letters on nameAtt
          if (nameAtt.length > 11) {
            nameAtt = nameAtt.substring(0, 11) + "...";
          }

          attributesT[nameAtt] = elementT.score;

          averageScore = averageScore + elementT.score;
          numT = numT + 1;
        }
      }

      averageScore = averageScore / numT;

      // male averageScore int
      averageScore = Math.round(averageScore);

      setRadioChart([
        {
          memberInfo: {
            discordName:
              member?.discordName + " - " + averageScore.toString() + "%" ?? "",
            attributes: attributesT,
          },
        },
      ]);

      console.log("CHANGE Radio Chart", [
        {
          memberInfo: {
            discordName: member?.discordName ?? "",
            attributes: attributesT,
          },
        },
      ]);
    },
  });

  console.log("radioChart = ", radioChart);

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

  const data = {
    labels: ["One", "Two", "Three"],
    datasets: [
      {
        data: [3, 6, 9],
        backgroundColor: ["aqua", "orangered", "purple"],
      },
    ],
  };

  const options = {
    scale: {
      ticks: {
        min: 0,
        max: 100,
      },
    },
  };

  return (
    <div className="relative pt-4">
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
        <div className="col-span-2">
          <p className="mb-2 text-center">
            <TextLabel1>PieChart</TextLabel1>
          </p>
          {/* <Pie data={data} options={options} /> */}
          <Pie data={pieChartData} />
        </div>
        {radioChart?.length > 0 && (
          <div className="col-span-2">
            <p className="mb-2 text-center">
              <TextLabel1>Radar Chart</TextLabel1>
            </p>
            {/* <Pie data={data} options={options} /> */}
            {/* <TeamAttributeChart members={dataRadarchart} /> */}
            <TeamAttributeChart members={radioChart} options={optionsRadar} />
          </div>
        )}
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
                className="z-20 h-full cursor-pointer rounded-md border shadow-sm transition ease-in-out hover:scale-[1.02] hover:bg-lime-50 hover:shadow-lime-200"
                onClick={() => setSummaryQuestionSelected(item)}
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
                        {!item.score ? (
                          <TextInputLabel className="mr-auto text-center text-xs text-black">
                            {item.answerContentSmall?.replace(".", "")}
                          </TextInputLabel>
                        ) : (
                          true
                        )}
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

      <Card
        border
        shadow
        className="my-4 max-h-fit overflow-scroll bg-white pb-4 "
      >
        <div className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrolling-touch flex flex-col space-y-4 p-3">
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
