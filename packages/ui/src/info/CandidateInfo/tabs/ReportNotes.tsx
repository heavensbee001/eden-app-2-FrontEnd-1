import { CandidateTypeSkillMatch, EdenTooltip } from "@eden/package-ui";
import { FC, useEffect, useState } from "react";

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
      grade = { letter: "A", color: "text-green-500" };
    } else if (percentage >= 7) {
      grade = { letter: "B", color: "text-green-200" };
    } else if (percentage >= 5) {
      grade = { letter: "C", color: "text-orange-300" };
    } else {
      grade = { letter: "D", color: "text-red-300" };
    }

    return grade;
  };

  console.log(
    "candidate?.analysisCandidateEdenAI",
    candidate?.analysisCandidateEdenAI
  );

  return (
    <>
      {/* {member?.letterAndColor?.requirements?.letter && (
        <div className="relative">
          <div className="absolute left-0 top-0 rounded-lg bg-white px-4 py-6 shadow-lg">
            <p className="text-lg font-bold">Requirements Score:</p>
            <p
              className={` ${member?.letterAndColor?.requirements?.color} text-4xl font-black`}
            >
              {`${member?.letterAndColor?.requirements?.letter}`}
            </p>
          </div>
        </div>
      )} */}
      {member?.letterAndColor?.totalMatchPerc?.letter && (
        <div className=" mb-2 mt-4   flex items-center ">
          <div className=" flex items-center rounded-lg border-[1px] border-gray-300 bg-white px-4 py-4 ">
            <p
              className={`${member?.letterAndColor?.totalMatchPerc?.color} text-4xl font-black`}
            >
              {`${member?.letterAndColor?.totalMatchPerc?.letter}`}
            </p>
            {candidate?.analysisCandidateEdenAI?.fitRequirements?.content && (
              <>
                <hr className="mx-2 my-0 h-8 border-gray-400" />
                <div className="">
                  <p className="text-lg font-bold">Eden First Impression 👀</p>

                  {candidate?.analysisCandidateEdenAI?.fitRequirements?.content}
                </div>
              </>
            )}
          </div>
        </div>
      )}
      <div className="space-y-4 rounded-lg border-[1px] bg-white p-4 py-4">
        {/* Render each category */}

        {reportNotesData &&
          Object.entries(reportNotesData).map(([categoryName, items]) => (
            <div
              className="rounded-lg border-[3px] border-gray-300  px-4 py-4"
              key={categoryName}
            >
              <div className="flex justify-between pr-10">
                <h1 className="mb-3 text-lg font-bold font-medium">
                  {categoryName.substring(categoryName.indexOf(":") + 1).trim()}
                </h1>
                <span className="font-medium">
                  Average: {reportNotesData[categoryName].average}
                </span>
              </div>

              <ul className="list-none space-y-1  [&>*:nth-child(even)]:bg-white [&>*:nth-child(odd)]:bg-gray-200">
                {/* Render each item in the category */}

                {typeof items.notes !== "string"
                  ? items.notes.map((item) => {
                      const score = item.score || 0;

                      const { letter, color } = getGrade(score);

                      return (
                        <li
                          key={item.IDb}
                          className="w-full cursor-pointer rounded-md"
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
                            <div className="flex w-full columns-2 items-center justify-between px-4 py-2">
                              <span className="ml-2">
                                {item.title
                                  .trim()
                                  .split(" ")
                                  .slice(0, 25)
                                  .join(" ") +
                                  (item.title.split(" ").length > 25
                                    ? "..."
                                    : "")}
                              </span>
                              <span
                                className={color}
                                style={{
                                  marginRight: "1.2rem",
                                  fontSize: "1.4rem",
                                }}
                              >
                                {letter}
                              </span>
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
