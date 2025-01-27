import { gql, useQuery } from "@apollo/client";
import {
  Maybe,
  ScoreCardCategoryMemoryType,
  ScoreCardsPositionType,
} from "@eden/package-graphql/generated";
import {
  CandidateTypeSkillMatch,
  EdenIconExclamation,
  EdenTooltip,
  Loading,
} from "@eden/package-ui";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { BsFillStarFill } from "react-icons/bs";
import { FaThumbsUp } from "react-icons/fa";
import ReactTooltip from "react-tooltip";

import { classNames } from "../../../../utils";

const FIND_POSITION_CANDIDATE = gql`
  query FindPositionCandidate($fields: findPositionCandidateInput) {
    findPositionCandidate(fields: $fields) {
      user {
        _id
        discordName
      }
      scoreCardTotal {
        score
        scoreCardCalculated
      }
      scoreCardCategoryMemories {
        category
        score
        reason
        scoreCardsPosition {
          score
          reason
          card {
            _id
            content
            futurePotential
            keyPriority
          }
          scoreCardsCandidate {
            card {
              score {
                overall
              }
              _id
              content
            }
            scoreAlignment
          }
        }
      }
    }
  }
`;

type Props = {
  candidate?: CandidateTypeSkillMatch;
  scoreCardState: any;
};

export const ScorecardTabNew: FC<Props> = ({ candidate, scoreCardState }) => {
  const router = useRouter();
  const { positionID } = router.query;

  const { setScoreCardLoading } = scoreCardState;
  const {
    data: findPositionCandidateData,
    loading: findPositionCandidateDataLoading,
  } = useQuery(FIND_POSITION_CANDIDATE, {
    variables: {
      fields: {
        positionID: positionID,
        userID: candidate?.user?._id,
      },
    },
    onCompleted: () => {
      setScoreCardLoading(false);
    },
    skip: !positionID,
  });

  useEffect(() => {
    setScoreCardLoading(true);
  }, []);

  const [expandID, setExpandID] = useState<null | string>(null);

  return (
    <>
      {candidate?.analysisCandidateEdenAI?.background?.content && (
        <div className="rounded-lg bg-white p-4 content-none">
          <div className="mb-3 flex items-center">
            <div className="bg-edenPink-300 mr-1 flex h-8 w-8 items-center justify-center rounded-full align-baseline">
              <EdenIconExclamation className="h-5 w-5" />
            </div>

            <h2 className="text-edenGreen-600">{"Eden's thoughts on fit"}</h2>
          </div>
          <div className="text-md font-normal leading-[22.4px] tracking-[-1.9%]">
            {candidate?.analysisCandidateEdenAI?.background?.content}
          </div>
        </div>
      )}
      {findPositionCandidateDataLoading && <Loading title="Loading scores" />}
      {findPositionCandidateData?.findPositionCandidate &&
      !!findPositionCandidateData?.findPositionCandidate
        .scoreCardCategoryMemories.length ? (
        <div className="mt-3 px-0 pt-4">
          <h2 className="text-edenGreen-600 mb-6">Checks and balances</h2>
          {findPositionCandidateData?.findPositionCandidate.scoreCardCategoryMemories.map(
            (_category: Maybe<ScoreCardCategoryMemoryType>, index: number) => (
              <div className="mb-10" key={index}>
                <div className="border-edenGreen-300 flex justify-between border-b px-4">
                  <h3 className="text-edenGreen-500 font-Moret mb-3">
                    {_category!.category?.replace("_", " ")}
                  </h3>
                  <div className="text-edenGray-700 flex items-center text-sm">
                    Average:
                    <div className="bg-edenPink-300 -mr-2 ml-2 flex h-6 w-8 items-center justify-center rounded-md pb-px">
                      <span
                        className={classNames(
                          getGrade(_category!.score! * 100).color,
                          "text-md"
                        )}
                      >
                        {getGrade(_category!.score! * 100).letter}
                      </span>
                    </div>
                  </div>
                </div>

                <ul className="list-none space-y-1">
                  {_category?.scoreCardsPosition!.map(
                    (item: Maybe<ScoreCardsPositionType>, index: number) => {
                      const score =
                        item!.score || item!.score === 0
                          ? item!.score * 100
                          : null;

                      const { letter, color } = getGrade(score);

                      return (
                        <li
                          key={index}
                          className="border-edenGray-100 w-full border-b px-4"
                        >
                          <div className="relative flex w-full columns-2 items-center justify-between py-4">
                            <div className="absolute -left-6 top-5 cursor-pointer">
                              {expandID ===
                              _category!.category?.replace("_", " ")! +
                                index ? (
                                <ChevronUpIcon
                                  width={16}
                                  className=""
                                  onClick={() => {
                                    setExpandID(null);
                                  }}
                                />
                              ) : (
                                <ChevronDownIcon
                                  width={16}
                                  className=""
                                  onClick={() => {
                                    setExpandID(
                                      _category!.category?.replace("_", " ")! +
                                        index
                                    );
                                  }}
                                />
                              )}
                            </div>
                            <div className="flex">
                              <p className="w-full pr-4 text-sm">
                                {item?.card?.content!.trim()}
                              </p>
                              {item &&
                                item?.card &&
                                item?.card.futurePotential == true && (
                                  <>
                                    <div
                                      data-tip={"Show Future Potential"}
                                      data-for={`badgeTip-potential-${item.card._id}`}
                                      className={`mr-4 mt-0.5 inline-block cursor-default rounded-sm text-sm last:mb-0 last:mr-0`}
                                    >
                                      <FaThumbsUp color="#FF9843" />
                                    </div>
                                    <ReactTooltip
                                      id={`badgeTip-potential-${item.card._id}`}
                                      place="top"
                                      effect="solid"
                                    >
                                      {
                                        "The candidate has future potential in the company"
                                      }
                                    </ReactTooltip>
                                  </>
                                )}
                              {item &&
                                item?.card &&
                                item?.card.keyPriority == true && (
                                  <>
                                    <div
                                      data-tip={"Key Priority"}
                                      data-for={`badgeTip-priority-${item.card._id}`}
                                      className={`mr-4 mt-0.5 inline-block cursor-default rounded-sm text-sm last:mb-0 last:mr-0`}
                                    >
                                      <BsFillStarFill color="#FF9843" />
                                    </div>
                                    <ReactTooltip
                                      id={`badgeTip-priority-${item.card._id}`}
                                      place="top"
                                      effect="solid"
                                    >
                                      {
                                        "The most relevant point based on the alignment with Hiring Manager"
                                      }
                                    </ReactTooltip>
                                  </>
                                )}
                            </div>
                            <div className="border-edenGray-100 relative -my-4 flex h-8 w-12 items-center justify-center rounded-[0.25rem] border">
                              <span className={color}>{letter}</span>
                              <EdenTooltip
                                id={
                                  _category!.category?.replace("_", " ")! +
                                  index
                                }
                                innerTsx={
                                  <div className="w-60">
                                    {letter === "?" ? (
                                      <div>
                                        <p className="mb-4 text-sm leading-tight text-gray-600">
                                          {
                                            "The candidate hasn't provided information on this. Do you want me to reach out & find out for you?"
                                          }
                                        </p>
                                      </div>
                                    ) : (
                                      <p className="text-sm leading-tight text-gray-600">
                                        {item?.reason}
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
                              >
                                <div className="bg-edenPink-200 absolute -right-2 -top-1 h-5 w-5 cursor-pointer rounded-full p-1">
                                  <EdenIconExclamation className="h-full w-full" />
                                </div>
                              </EdenTooltip>
                            </div>
                          </div>
                          {expandID ===
                            _category!.category?.replace("_", " ")! + index && (
                            <div>
                              {item?.scoreCardsCandidate?.map(
                                (_card, _index) => {
                                  // const { color, letter } = getGrade(
                                  //   !!_card?.card?.score?.overall ||
                                  //     _card?.card?.score?.overall === 0
                                  //     ? _card?.card?.score?.overall * 100
                                  //     : null
                                  // );
                                  const { color } = getGrade(
                                    !!_card?.scoreAlignment ||
                                      _card?.scoreAlignment === 0
                                      ? _card?.scoreAlignment * 100
                                      : null
                                  );

                                  return (
                                    <div
                                      key={_index}
                                      className="border-edenGray-100 relative mb-4 flex w-[95%] w-full items-center justify-between rounded-md border p-2"
                                    >
                                      <p className="text-edenGray-700 text-xs">
                                        {_card?.card?.content}
                                      </p>
                                      <div className="border-edenGray-100 relative ml-4 flex h-6 w-8 items-center justify-center rounded-[0.25rem] border">
                                        <span className={color}>
                                          {_card?.scoreAlignment != null
                                            ? _card.scoreAlignment * 10
                                            : ""}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          )}
                        </li>
                      );
                    }
                  )}
                </ul>
              </div>
            )
          )}
        </div>
      ) : null}
    </>
  );
};

type Grade = {
  letter: string;
  color: string;
};

const getGrade = (percentage: number | null | undefined): Grade => {
  let grade: Grade = { letter: "", color: "" };

  if (!percentage && percentage !== 0) {
    grade = { letter: "?", color: "text-edenGray-500" };
    return grade;
  }

  if (percentage >= 90) {
    grade = { letter: "A+", color: "text-utilityGreen" };
  } else if (percentage >= 80) {
    grade = { letter: "A", color: "text-utilityGreen" };
  } else if (percentage >= 70) {
    grade = { letter: "B+", color: "text-utilityYellow" };
  } else if (percentage >= 60) {
    grade = { letter: "B", color: "text-utilityYellow" };
  } else if (percentage >= 50) {
    grade = { letter: "C+", color: "text-utilityOrange" };
  } else if (percentage >= 40) {
    grade = { letter: "C", color: "text-utilityOrange" };
  } else {
    grade = { letter: "D", color: "text-utilityRed" };
  }

  return grade;
};
