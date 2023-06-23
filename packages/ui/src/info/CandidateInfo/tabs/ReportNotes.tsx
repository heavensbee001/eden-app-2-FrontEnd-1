import { CandidateTypeSkillMatch } from "@eden/package-ui";
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

export const ReportNotes: FC<Props> = ({ candidate }) => {
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

        const average = total / Object.keys(items).length;

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
      <div className="space-y-4 rounded-lg p-4 py-10">
        {/* Render each category */}

        {reportNotesData &&
          Object.entries(reportNotesData).map(([categoryName, items]) => (
            <div key={categoryName}>
              <div className="flex justify-between pr-10">
                <h2 className="mb-3 text-lg font-medium">{categoryName}</h2>
                <span className="font-medium">
                  Average: {reportNotesData[categoryName].average}
                </span>
              </div>

              <ul className="list-disc space-y-1 pl-7 [&>*:nth-child(even)]:bg-white [&>*:nth-child(odd)]:bg-gray-300">
                {/* Render each item in the category */}

                {typeof items.notes !== "string"
                  ? items.notes.map((item) => {
                      const score = item.score || 0;

                      const { letter, color } = getGrade(score);

                      return (
                        <li
                          key={item.IDb}
                          className="flex w-full cursor-pointer columns-2 items-center justify-between rounded-md px-4 py-2 "
                        >
                          <span className="ml-2">
                            {item.title
                              .trim()
                              .split(" ")
                              .slice(0, 25)
                              .join(" ") +
                              (item.title.split(" ").length > 25 ? "..." : "")}
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
