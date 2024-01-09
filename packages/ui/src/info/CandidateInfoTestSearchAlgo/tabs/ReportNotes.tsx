import {
  CandidateTypeSkillMatch,
  EdenIconExclamation,
  EdenTooltipAsk,
} from "@eden/package-ui";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";

import { classNames } from "../../../../utils";

type Grade = {
  letter: string;
  color: string;
};

interface Props {
  member?: CandidateTypeSkillMatch;
  candidate: any;
}

interface DatabaseItem {
  categoryName: string;
  title: string;
  score: number;
  reason: string;
  IDb: string;
}

type meetingNotesType = DatabaseItem[];

interface ReportNotesData {
  [key: string]: { notes: meetingNotesType; average: string };
}

export const ReportNotes: FC<Props> = ({ member, candidate }) => {
  const router = useRouter();
  const [reportNotesData, setReportNotesData] = useState<ReportNotesData>();

  useEffect(() => {
    if (candidate?.compareCandidatePosition?.reportPassFail) {
      const categories: ReportNotesData = {};

      candidate?.compareCandidatePosition?.reportPassFail.forEach(
        (item: DatabaseItem) => {
          if (!categories[item.categoryName]) {
            categories[item.categoryName] = { notes: [], average: "" };
          }

          categories[item.categoryName].notes.push(item);
        }
      );

      Object.entries(categories).forEach(([categoryName, items]) => {
        let total = 0;
        let totalN = 0;

        items.notes.map((it: any) => {
          if (it.score > 0) {
            total += parseInt(it.score);
            totalN += 1;
          }
        });

        let average = 0;
        let letter = "-";

        if (totalN > 0) {
          average = total / totalN;
          const LT = getGrade(average);

          letter = LT.letter;
        }

        categories[categoryName].average = letter;
      });

      // console.log("categories = " , categories)

      setReportNotesData(categories);
    }
    console.log("member?.letterAndColor = ", member?.letterAndColor);
  }, [candidate]);

  const getGrade = (percentage: number): Grade => {
    let grade: Grade = { letter: "", color: "" };

    if (percentage >= 7) {
      grade = { letter: "A", color: "text-utilityGreen" };
    } else if (percentage >= 5) {
      grade = { letter: "B", color: "text-utilityYellow" };
    } else if (percentage >= 3.5) {
      grade = { letter: "C", color: "text-utilityOrange" };
    } else {
      grade = { letter: "?", color: "text-utilityGray" };
    }

    return grade;
  };

  const getGradeFromLetter = (letter: string): Grade => {
    let grade: Grade = { letter: "", color: "" };

    if (letter === "A") {
      grade = { letter: "A", color: "text-utilityGreen" };
    } else if (letter === "B") {
      grade = { letter: "B", color: "text-utilityYellow" };
    } else if (letter === "C") {
      grade = { letter: "C", color: "text-utilityOrange" };
    } else {
      grade = { letter: "?", color: "text-utilityGray" };
    }

    return grade;
  };

  return (
    <>
      {member?.letterAndColor?.requirements?.letter && (
        <div className="bg-edenPink-100 mb-8 min-h-[3rem] rounded-md p-4">
          <div className="border-edenPink-300 float-right -mt-2 flex h-10 w-10 items-center justify-center rounded-full border-2 pb-[2px]">
            <span
              className={`${member?.letterAndColor?.requirements?.color} text-3xl`}
            >
              {`${member?.letterAndColor?.requirements?.letter}`}
            </span>
          </div>
          {candidate?.analysisCandidateEdenAI?.fitRequirements?.content && (
            <div className="">
              <div className="mb-3 flex items-center">
                <EdenIconExclamation className="mr-1 h-5 w-5  " />
                <h2 className="text-edenGreen-600 ">
                  Eden&apos;s{"  "}
                  <span className="font-Unica text-edenGray-900 text-md font-normal">
                    thoughts on fit
                  </span>
                </h2>
              </div>

              {candidate?.analysisCandidateEdenAI?.fitRequirements?.content}
            </div>
          )}
        </div>
      )}
      <div className="">
        {/* Render each category */}

        {reportNotesData &&
          Object.entries(reportNotesData).map(([categoryName, items]) => (
            <div className="mb-10" key={categoryName}>
              <div className="border-edenGreen-300 flex justify-between border-b px-4">
                <h3 className="text-edenGreen-500 mb-3">
                  {categoryName.substring(categoryName.indexOf(":") + 1).trim()}
                </h3>
                <div className="text-edenGray-700 flex items-center text-sm">
                  Average:
                  <div className="bg-edenPink-300 ml-2 flex h-6 w-6 items-center justify-center rounded-full pb-px">
                    <span
                      className={classNames(
                        getGradeFromLetter(
                          reportNotesData[categoryName].average
                        ).color,
                        "text-md"
                      )}
                    >
                      {reportNotesData[categoryName].average}
                    </span>
                  </div>
                </div>
              </div>

              <ul className="list-none space-y-1">
                {/* Render each item in the category */}

                {typeof items.notes !== "string"
                  ? items.notes.map((item) => {
                      const score = item.score || 0;

                      const { letter, color } = getGrade(score);

                      return (
                        <li
                          key={item.IDb}
                          className="border-edenGray-100 w-full rounded-md border-b px-4"
                        >
                          <div className="flex w-full columns-2 items-center justify-between py-4">
                            <p className="w-full pr-4 text-sm">
                              {item.title
                                .trim()
                                .split(" ")
                                .slice(0, 25)
                                .join(" ") +
                                (item.title.split(" ").length > 25
                                  ? "..."
                                  : "")}
                            </p>
                            <div className="border-edenGray-100 relative -my-4 flex h-8 w-12 items-center justify-center rounded-[0.25rem] border">
                              <span className={color}>{letter}</span>
                              <EdenTooltipAsk
                                item={item}
                                positionId={
                                  typeof router.query.positionID === "string"
                                    ? router.query.positionID
                                    : router.query.positionID![0] || ""
                                }
                                candidateId={member?.user?._id || ""}
                                letter={letter}
                              />
                            </div>
                          </div>
                        </li>
                      );
                    })
                  : null}
              </ul>
            </div>
          ))}
      </div>
    </>
  );
};
