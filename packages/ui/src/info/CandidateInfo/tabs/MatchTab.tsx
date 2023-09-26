import { gql, useQuery } from "@apollo/client";
import { SummaryQuestionType } from "@eden/package-graphql/generated";
import {
  CandidateTypeSkillMatch,
  Card,
  EdenIconExclamation,
  EdenTooltip,
  Modal,
  // PopoverScoreReason,
  // TeamAttributeChart,
  // TextHeading2,
  // TextInputLabel,
} from "@eden/package-ui";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { FC, useEffect, useState } from "react";
import { GoGraph } from "react-icons/go";
import { TbViewfinderOff } from "react-icons/tb";

const MEMBER_PIE_CHART_NODE_CATEGORY = gql`
  query ($fields: memberPieChartNodeCategoriesInput) {
    memberPieChartNodeCategories(fields: $fields) {
      categoryName
      percentage
    }
  }
`;

const FIND_POSITION = gql`
  query ($fields: findPositionInput) {
    findPosition(fields: $fields) {
      _id
      candidates {
        user {
          _id
          discordName
        }
        keyAttributes {
          attribute
          reason
          score
        }
        futurePotential {
          attribute
          reason
          score
        }
      }
    }
  }
`;

// const MEMBER_RADIO_CHART_CHARACTER_ATTRIBUTES = gql`
//   query ($fields: memberRadioChartCharacterAttributesInput) {
//     memberRadioChartCharacterAttributes(fields: $fields) {
//       attributeName
//       score
//       reason
//     }
//   }
// `;

// const dataRadarchart = [
//   {
//     memberInfo: {
//       discordName: "Kwame",
//       attributes: {
//         Coordinator: 60,
//         DirectorTP: 70,
//         Helper: 70,
//         Inspirer: 80,
//         Motivator: 70,
//         Observer: 90,
//         Reformer: 50,
//         Supporter: 40,
//       },
//     },
//   },
// ];

ChartJS.register(ArcElement, Legend, Tooltip);

type Props = {
  member?: CandidateTypeSkillMatch;
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
  // eslint-disable-next-line no-unused-vars
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

  // eslint-disable-next-line no-unused-vars
  const [pieChartData, setPieChartData] = useState<ChartData>({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
      },
    ],
  });

  // eslint-disable-next-line no-unused-vars
  const { loading: loadingPieNodeCategory } = useQuery(
    MEMBER_PIE_CHART_NODE_CATEGORY,
    {
      variables: {
        fields: {
          memberID: member?.user?._id,
        },
      },
      skip: member?.user?._id == undefined,
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
                "#FFD4B2",
                "#FFF6BD",
                "#CEEDC7",
                "#86C8BC",
                "#FD8A8A",
                "#F1F7B5",
                "#A8D1D1",
                "#9EA1D4",
              ],
            },
          ],
        });
      },
    }
  );

  const {} = useQuery(FIND_POSITION, {
    variables: {
      fields: {
        _id: "650a0e8547550dabc2e42d24",
      },
    },
    onCompleted: (data) => {
      console.log("data from find pos: ", data);
    },
  });

  // type radiochartType = {
  //   memberInfo: {
  //     discordName: string;
  //     attributes: {
  //       [key: string]: number;
  //     };
  //   };
  // };

  // const [radioChart, setRadioChart] = useState<radiochartType[]>([]);

  // const optionsRadar = {
  //   plugins: {
  //     legend: {
  //       position: "bottom",
  //     },
  //   },
  //   scales: {
  //     r: {
  //       suggestedMin: 30,
  //       suggestedMax: 100,
  //       ticks: {
  //         stepSize: 20, // Optional: Specify the step size between ticks
  //       },
  //     },
  //   },
  // };

  // const { loading: radioChartLoading } = useQuery(
  //   MEMBER_RADIO_CHART_CHARACTER_ATTRIBUTES,
  //   {
  //     variables: {
  //       fields: {
  //         memberID: member?.user?._id,
  //       },
  //     },
  //     skip: member?.user?._id == undefined,
  //     onCompleted: (data) => {
  //       interface attributesType {
  //         [key: string]: any;
  //       }
  //       const attributesT: attributesType = {};

  //       let averageScore = 0;
  //       let numT = 0;

  //       for (
  //         let i = 0;
  //         i < data.memberRadioChartCharacterAttributes.length;
  //         i++
  //       ) {
  //         const elementT: {
  //           attributeName: string;
  //           score: number;
  //           reason: string;
  //         } = data.memberRadioChartCharacterAttributes[i];

  //         if (elementT && elementT.attributeName) {
  //           const nameAtt = elementT.attributeName;

  //           // how to make maximum 11 letters on nameAtt
  //           // if (nameAtt.length > 11) {
  //           //   nameAtt = nameAtt.substring(0, 11) + "...";
  //           // }

  //           attributesT[nameAtt] = elementT.score;

  //           averageScore = averageScore + elementT.score;
  //           numT = numT + 1;
  //         }
  //       }

  //       averageScore = averageScore / numT;

  //       // male averageScore int
  //       averageScore = Math.round(averageScore);

  //       setRadioChart([
  //         {
  //           memberInfo: {
  //             discordName:
  //               member?.user?.discordName +
  //                 " - " +
  //                 averageScore.toString() +
  //                 "%" ?? "",
  //             attributes: attributesT,
  //           },
  //         },
  //       ]);

  //       console.log("CHANGE Radio Chart", [
  //         {
  //           memberInfo: {
  //             discordName: member?.user?.discordName ?? "",
  //             attributes: attributesT,
  //           },
  //         },
  //       ]);
  //     },
  //   }
  // );

  // console.log("radioChart = ", radioChart);

  useEffect(() => {
    const dataBarChartPr: BarChartQuestions[] = [];
    const dataBarChartMaxLength: number = 6;

    summaryQuestions?.forEach((question: any) => {
      console.log("question = ", question);

      if (question?.score && dataBarChartPr.length < dataBarChartMaxLength) {
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

  // const data = {
  //   labels: ["One", "Two", "Three"],
  //   datasets: [
  //     {
  //       data: [3, 6, 9],
  //       backgroundColor: ["aqua", "orangered", "purple"],
  //     },
  //   ],
  // };

  // const options = {
  //   scale: {
  //     ticks: {
  //       min: 0,
  //       max: 100,
  //     },
  //   },
  // };

  console.log("summaryQuestions", summaryQuestions);

  return (
    // <div className="relative pb-4 pt-12">
    //   <div className={`mx-auto mb-2`}>

    <div className="">
      {/* <div className="mb-10">
        <div className="mb-4 px-4">
          <h3 className="text-edenGreen-600">
            Seed Questions that were asked on the Interview 🙋
          </h3>
        </div>
        <p className="text-edenGray-500 px-4 text-sm">
          Here you can find the questions that were asked on the interview
          together with the score, reason and actual answer if you click the
          cards
        </p>
      </div> */}

      <div className="flex flex-col items-start">
        <h3>Strong Experience in Angular and React</h3>
        <span>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Architecto
          nemo nulla aut provident neque earum sequi culpa! Nulla delectus nam
          soluta! Veritatis similique quia corporis laudantium accusantium.
          Optio, numquam blanditiis.
        </span>
      </div>

      <div className="flex flex-col">
        <div className="border-edenGreen-300 mt-4 flex justify-between border-t">
          <h2 className="text-edenGreen-500 mb-3 ml-1">Potential</h2>
        </div>

        <div className="ml-1 space-y-2">
          <div className="relative flex items-center space-x-2">
            <h3>Proficient in other front-end frameworks</h3>
            <div className="relative h-[5px] w-52 rounded-lg bg-gray-600">
              <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-blue-500"></div>
            </div>
          </div>
          <div className="relative flex items-center space-x-2">
            <h3>Proficient in other front-end frameworks</h3>
            <div className="relative h-[5px] w-52 rounded-lg bg-gray-600">
              <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-blue-500"></div>
            </div>
          </div>
          <div className="relative flex items-center space-x-2">
            <h3>Proficient in other front-end frameworks</h3>
            <div className="relative h-[5px] w-52 rounded-lg bg-gray-600">
              <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-blue-500"></div>
            </div>
          </div>
          <div className="relative flex items-center space-x-2">
            <h3>Proficient in other front-end frameworks</h3>
            <div className="relative h-[5px] w-52 rounded-lg bg-gray-600">
              <div className="absolute left-1/4 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-blue-500"></div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="border-edenGreen-300 mt-4 flex justify-between border-t">
          <h2 className="text-edenGreen-500 mb-3 ml-1">Noteworthy</h2>
        </div>
        <div></div>
      </div>

      {/* <div className="flex items-center">
        <span className="text-xl font-bold text-gray-800">Hello</span>
        <span className="text-lg italic text-blue-500"> World!</span>
      </div> */}

      <div>
        <ul className="list-none space-y-1">
          {summaryQuestions
            ? summaryQuestions.map((item, index) => (
                <li
                  key={index}
                  className="border-edenGray-100 w-full cursor-pointer rounded-md border-b px-4"
                  onClick={() => {
                    setSummaryQuestionSelected(item);
                    if (document) {
                      setTimeout(() => {
                        document
                          .getElementById("summary-question-chat")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }, 200);
                    }
                  }}
                >
                  <div className="">
                    <div className="flex w-full py-4">
                      <p className="w-3/4 text-sm text-gray-900">
                        {item.questionContentSmall?.replace(".", "") ||
                          item.questionContent?.replace(".", "")}
                      </p>
                      <div className="ml-auto flex items-center p-2">
                        {/* <div className="hidden text-[#12A321] text-[#8CE136] text-[#E40000] text-[#FF6847] text-[#FFCF25]"></div> */}
                        <div className="hidden text-[#00462C] text-[#19563F] text-[#7FA294] text-[#B2C7BF] text-[#F5C7DE]"></div>
                        {item.score ? (
                          <div className="border-edenGray-100 relative -my-4 flex h-8 items-center justify-center rounded-[0.25rem] border px-4">
                            <p
                              className={classNames(
                                "text-2xs font-bold leading-tight",
                                `text-${getPercentageColor(item.score * 10)}`
                              )}
                            >
                              {getPercentageText(item.score * 10)}
                            </p>
                            {item.reason && (
                              <EdenTooltip
                                id={index.toString()}
                                innerTsx={
                                  <div className="w-60">
                                    <span className="text-gray-600">
                                      {item?.answerContent}
                                    </span>
                                  </div>
                                }
                                place="top"
                                effect="solid"
                                backgroundColor="white"
                                border
                                borderColor="#e5e7eb"
                                padding="0.5rem"
                              >
                                <div className="bg-edenPink-200 absolute -right-2 -top-1 h-5 w-5 rounded-full p-1">
                                  <EdenIconExclamation className="h-full w-full" />
                                </div>
                              </EdenTooltip>
                            )}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <Modal
                    open={
                      summaryQuestionSelected?.questionID === item.questionID
                    }
                    onClose={() => {
                      setSummaryQuestionSelected(undefined);
                    }}
                    closeOnEsc
                  >
                    <h3 className="mb-4 text-xl font-medium">Candidate chat</h3>
                    {summaryQuestionSelected &&
                    summaryQuestionSelected.subConversationAnswer ? (
                      <Card
                        border
                        shadow
                        className="mx-auto my-4 max-h-fit max-w-lg overflow-scroll !border-gray-200 bg-white pb-4"
                      >
                        <div
                          id="summary-question-chat"
                          className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrolling-touch flex flex-col space-y-4 p-3"
                        >
                          <div className="">
                            {summaryQuestionSelected.subConversationAnswer.map(
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
                                      <img
                                        src={
                                          conversation.role == "assistant"
                                            ? "https://pbs.twimg.com/profile_images/1595723986524045312/fqOO4ZI__400x400.jpg"
                                            : member?.user?.discordAvatar || ""
                                        }
                                        className="order-1 h-6 w-6 rounded-full"
                                      />
                                    </div>
                                  </div>
                                </>
                              )
                            )}
                          </div>
                        </div>
                      </Card>
                    ) : null}
                  </Modal>
                </li>
              ))
            : null}
        </ul>
      </div>

      {/* <div className="mb-8 grid grid-cols-12 border-[1px] bg-white pt-2"> */}
      {/* <div className="col-span-2"></div>
        <div className="col-span-8">
          <p className="mb-4 text-center">
            <TextLabel1>Background match</TextLabel1>
          </p>
          {dataBarChart.length > 0 ? (
            <div className="h-[300px]">
              <BackgroundMatchChart
                memberName={member?.user?.discordName ?? ""}
                backgroundMatchData={dataBarChart}
              />
            </div>
          ) : (
            <LoadingGraphData />
          )}
        </div> */}
      {/* <div className="col-span-2"></div>
        <div className="col-span-6 mb-4">
          <p className="mb-2 text-center">
            <TextLabel1>PieChart</TextLabel1>
          </p>
          {!!loadingPieNodeCategory ? (
            <LoadingGraphData />
          ) : pieChartData.datasets[0]?.data.length > 0 ? (
            <Pie
              data={pieChartData}
              options={{
                layout: {
                  padding: 12,
                },
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              }}
            />
          ) : (
            <NoGraphData />
          )}
        </div> */}
      {/* <div className="col-span-6 mb-4">
          <p className="mb-2 text-center">
            <TextLabel1>Radar Chart</TextLabel1>
          </p>
          {radioChartLoading ? (
            <LoadingGraphData />
          ) : (
            <>
              {radioChart?.length > 0 ? (
                <div className="-mt-8">
                  <TeamAttributeChart
                    members={radioChart}
                    options={optionsRadar}
                  />
                </div>
              ) : (
                <NoGraphData />
              )}
            </>
          )}
        </div> */}
      {/* </div> */}
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

const getPercentageColor = (percentage: number) => {
  let color = "";

  // if (percentage >= 90) {
  //   color = "[#12A321]";
  // } else if (percentage >= 70) {
  //   color = "[#8CE136]";
  // } else if (percentage >= 50) {
  //   color = "[#FFCF25]";
  // } else if (percentage >= 40) {
  //   color = "[#FF6847]";
  // } else {
  //   color = "[#00462C]";
  // }

  if (percentage >= 90) {
    color = "[#00462C]";
  } else if (percentage >= 70) {
    color = "[#19563F]";
  } else if (percentage >= 50) {
    color = "[#7FA294]";
  } else if (percentage >= 40) {
    color = "[#F5C7DE]";
  } else {
    color = "edenGray-500";
  }
  return color;
};

const getPercentageText = (percentage: number) => {
  let text = "";

  if (percentage >= 90) {
    text = "Must Read";
  } else if (percentage >= 70) {
    text = "Captivating";
  } else if (percentage >= 50) {
    text = "Interesting";
  } else if (percentage >= 40) {
    text = "Decent";
  } else {
    text = "Not Interesting";
  }

  return text.toUpperCase();
};

export const LoadingGraphData: FC = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center py-8">
      <GoGraph size={80} color="#e3e3e3" className="" />
      <p className="z-10 text-center text-gray-400">Loading data...</p>
    </div>
  );
};

export const NoGraphData: FC = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center py-8">
      <TbViewfinderOff size={50} color="#e3e3e3" className="" />
      <p className="z-10 text-center text-gray-400">No data found</p>
    </div>
  );
};
