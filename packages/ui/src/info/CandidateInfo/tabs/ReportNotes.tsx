// import { gql, useQuery } from "@apollo/client";
// import { Members } from "@eden/package-graphql/generated";
import { CandidateTypeSkillMatch, PopoverScoreReason } from "@eden/package-ui";
import { FC, useEffect, useState } from "react";

// const CANDIDATE_NOTES_EDENAI = gql`
//   query ($fields: candidateNotesEdenAIInput!) {
//     candidateNotesEdenAI(fields: $fields) {
//       categoryName
//       reason
//     }
//   }
// `;

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

// interface DatabaseProps = DatabaseItem[];

type meetingNotesType = DatabaseItem[];

export const ReportNotes: FC<Props> = ({ candidate, member }) => {
  const [meetingNotesData, setReportNotesData] = useState<{
    [key: string]: meetingNotesType;
  }>({});

  // const [items, setItems] = useState(data);

  // const handleScoreChange = (IDb: string, score: number) => {
  //   // Update the score for the item with the given IDb
  //   const updatedItems = items.map((item) =>
  //     item.IDb === IDb ? { ...item, score } : item
  //   );

  //   setItems(updatedItems);

  //   // Call the onScoreChange callback, if provided
  //   if (onScoreChange) {
  //     onScoreChange(IDb, score);
  //   }
  // };

  useEffect(() => {
    if (candidate?.compareCandidatePosition?.reportPassFail) {
      // const categories: meetingNotesType = [];
      const categories: { [key: string]: meetingNotesType } = {};

      candidate?.compareCandidatePosition?.reportPassFail.forEach(
        (item: DatabaseItem) => {
          if (!categories[item.categoryName]) {
            categories[item.categoryName] = [];
          }
          categories[item.categoryName].push(item);
        }
      );

      // console.log("categories w2= ", categories);

      setReportNotesData(categories);
    }

    // if (candidate?.compareCandidatePosition?.reportPassFail)
    //   setReportNotesData(candidate.compareCandidatePosition.reportPassFail);
  }, [candidate]);

  console.log("meetingNotesData = ", meetingNotesData);

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

              {items.map((item) => {
                const score = item.score || 0;
                // const hasPassed = score >= 5;

                let result, color, symbol;

                // if (score >= 8) {
                //   result = "Excellent";
                //   color = "text-blue-600";
                //   symbol = "\u2B50";
                // } else if (score >= 4) {
                //   result = "Pass";
                //   color = "text-green-600";
                //   symbol = "\u2714";
                // } else if (score >= 1) {
                //   result = "Neutral";
                //   color = "text-yellow-400";
                //   symbol = "";
                // } else {
                //   result = "Fail";
                //   color = "text-red-600";
                //   symbol = "\u2718";
                // }
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
                    {/* <li
                      key={item.IDb}
                      className="flex cursor-pointer items-center justify-between py-2 hover:bg-gray-200"
                      title={
                        item.title.trim().split(" ").slice(0, 25).join(" ") +
                        (item.title.split(" ").length > 25 ? "..." : "")
                      }
                      onClick={() => {
                        // handleScoreChange(item.IDb, newScore);
                      }}
                    >
                      <span className="mr-2">
                        •{" "}
                        {item.title.trim().split(" ").slice(0, 25).join(" ") +
                          (item.title.split(" ").length > 25 ? "..." : "")}
                      </span>
                      <span className={color}>
                        {symbol} {result}
                      </span> */}

                    {/* {hasPassed ? (
                        <span className="text-green-500">&#x2714;</span>
                      ) : (
                        <span className="text-red-500">&#x2718;</span>
                      )} */}
                    <li
                      key={item.IDb}
                      className="w- hover: flex w-fit cursor-pointer items-center rounded-md px-4 py-2 transition-all duration-200 ease-out hover:scale-[102%]  hover:shadow-md hover:shadow-[rgba(116,250,109,0.4)]  "
                      // title={
                      //   item.title.trim().split(" ").slice(0, 25).join(" ") +
                      //   (item.title.split(" ").length > 25 ? "..." : "")
                      // }
                    >
                      <span
                        className={color}
                        style={{ marginRight: "1.2rem", fontSize: "1.4rem" }}
                      >
                        {symbol} {result}
                      </span>
                      <span className="ml-2">
                        {item.title.trim().split(" ").slice(0, 25).join(" ") +
                          (item.title.split(" ").length > 25 ? "..." : "")}
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
