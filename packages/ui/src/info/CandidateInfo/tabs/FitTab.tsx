import { CandidateTypeSkillMatch, PopoverScoreReason } from "@eden/package-ui";
import { FC, useEffect, useState } from "react";

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

export const FitTab: FC<Props> = ({ candidate, member }) => {
  const [meetingNotesData, setReportNotesData] = useState<{
    [key: string]: meetingNotesType;
  }>({});

  console.log({ candidate, member });

  useEffect(() => {
    if (candidate?.compareCandidatePosition?.reportPassFail) {
      const categories: { [key: string]: meetingNotesType } = {};

      candidate?.compareCandidatePosition?.reportPassFail.forEach(
        (item: DatabaseItem) => {
          if (!categories[item.categoryName]) {
            categories[item.categoryName] = [];
          }
          categories[item.categoryName].push(item);
        }
      );

      setReportNotesData(categories);
    }

    setReportNotesData(candidate.compareCandidatePosition.reportPassFail);
  }, [candidate]);

  console.log({ meetingNotesData });

  return (
    <>
      {member?.letterAndColor?.requirements?.letter && (
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
      )}
      <div className="space-y-4 rounded-lg p-4 py-36">
        {/* Render each category */}

        {Object.entries(meetingNotesData).map(([categoryName, items]) => (
          <div key={categoryName}>
            <h2 className="text-lg font-medium">{categoryName}</h2>
            <ul className="list-disc space-y-2 pl-7">
              {/* Render each item in the category */}

              {Object.entries(items).map((item: any) => {
                const score = item.score || 0;

                let result, color, symbol;

                if (score >= 8) {
                  result = "";
                  color = "text-blue-600";
                  symbol = "🤩";
                } else if (score >= 4) {
                  result = "";
                  color = "text-green-600";
                  symbol = "\u2714";
                } else if (score >= 1) {
                  result = "";
                  color = "text-yellow-400";
                  symbol = "😐";
                } else {
                  result = "    ━";
                  color = "text-gray-600";
                  symbol = "";
                }

                return (
                  // eslint-disable-next-line react/jsx-key
                  <PopoverScoreReason
                    question={{
                      score: item.score,
                      reason: item.reason,
                    }}
                    ubication="top-start"
                  >
                    <li
                      key={item.IDb}
                      className="w- hover: flex w-fit cursor-pointer items-center rounded-md px-4 py-2 transition-all duration-200 ease-out hover:scale-[102%]  hover:shadow-md hover:shadow-[rgba(116,250,109,0.4)]  "
                    >
                      <span
                        className={color}
                        style={{ marginRight: "1.2rem", fontSize: "1.4rem" }}
                      >
                        {symbol} {result}
                      </span>
                      <span className="ml-2">
                        {item.title?.trim().split(" ").slice(0, 25).join(" ") +
                          (item.title?.split(" ").length > 25 ? "..." : "")}
                      </span>
                    </li>
                  </PopoverScoreReason>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
};
