import { CandidateTypeSkillMatch, EdenTooltip } from "@eden/package-ui";
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

        items.notes.map((it: any) => {
          total += parseInt(it.score);
        });

        const average = total / items.notes.length;

        const { letter } = getGrade(average);

        categories[categoryName].average = letter;
      });

      setReportNotesData(categories);
    }
  }, [candidate]);

  const getGrade = (percentage: number): Grade => {
    let grade: Grade = { letter: "", color: "" };

    if (percentage >= 8.5) {
      grade = { letter: "A", color: "text-utilityGreen" };
    } else if (percentage >= 7) {
      grade = { letter: "B", color: "text-utilityYellow" };
    } else if (percentage >= 5) {
      grade = { letter: "C", color: "text-utilityOrange" };
    } else {
      grade = { letter: "D", color: "text-utilityRed" };
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
      grade = { letter: "D", color: "text-utilityRed" };
    }

    return grade;
  };

  return (
    <>
      {member?.letterAndColor?.totalMatchPerc?.letter && (
        <div className="p-4 bg-edenPink-100 rounded-md mb-8 min-h-[3rem]">
          <p
            className={`${member?.letterAndColor?.totalMatchPerc?.color} text-3xl font-bold float-right -mt-2`}
          >
            {`${member?.letterAndColor?.totalMatchPerc?.letter}`}
          </p>
          {candidate?.analysisCandidateEdenAI?.fitRequirements?.content && (
            <div className="">
              <h2 className="text-edenGreen-600 mb-3">
                Eden&apos;s thoughts on fit
              </h2>

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
              <div className="flex justify-between px-4 border-b border-edenGreen-300">
                <h3 className="mb-3 text-edenGreen-500">
                  {categoryName.substring(categoryName.indexOf(":") + 1).trim()}
                </h3>
                <span className="font-medium text-sm text-edenGray-700 mr-4">
                  Average:
                  <span
                    className={classNames(
                      getGradeFromLetter(reportNotesData[categoryName].average)
                        .color,
                      "font-bold ml-2 text-md"
                    )}
                  >
                    {reportNotesData[categoryName].average}
                  </span>
                </span>
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
                          className="w-full cursor-pointer px-4 rounded-md border-b border-edenGray-100"
                        >
                          <EdenTooltip
                            id={item.title.split(" ").join("")}
                            innerTsx={
                              <div className="w-60">
                                <span className="text-gray-600">
                                  {item.reason}
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
                            <div className="flex w-full py-4 columns-2 items-center justify-between">
                              <p className="text-sm pr-4 w-full">
                                {item.title
                                  .trim()
                                  .split(" ")
                                  .slice(0, 25)
                                  .join(" ") +
                                  (item.title.split(" ").length > 25
                                    ? "..."
                                    : "")}
                              </p>
                              <div className="w-12 -my-4 h-8 rounded-[0.25rem] flex items-center justify-center border border-edenGray-100">
                                <span className={color}>{letter}</span>
                              </div>
                            </div>
                          </EdenTooltip>
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
