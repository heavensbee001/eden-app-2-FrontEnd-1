// import { gql, useQuery } from "@apollo/client";
import { Members } from "@eden/package-graphql/generated";
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
  member?: Members;
  candidate: any;
}

type Category = {
  categoryName: string;
  reason: string[];
  score: number;
};

type meetingNotesType = Category[];

export const ReportNotes: FC<Props> = ({ member, candidate }) => {
  const [meetingNotesData, setReportNotesData] = useState<meetingNotesType>([]);

  console.log("member = ", member);

  // const {} = useQuery(CANDIDATE_NOTES_EDENAI, {
  //   variables: {
  //     fields: {
  //       memberID: member?._id,
  //     },
  //   },
  //   skip: !member?._id,
  //   onCompleted: (data) => {
  //     console.log("data = ", data);

  //     setReportNotesData(data.candidateNotesEdenAI);
  //   },
  // });

  useEffect(() => {
    // if (dataProject?.findProject) setProject(dataProject?.findProject);
    console.log(
      "candidate.compareCandidatePosition = 2",
      candidate?.compareCandidatePosition
    );

    if (candidate?.compareCandidatePosition?.CV_ConvoToPosition)
      setReportNotesData(candidate.compareCandidatePosition.CV_ConvoToPosition);
  }, [candidate]);

  return (
    <>
      <div className="container mx-auto px-4">
        <div className="-mx-4 flex flex-wrap">
          {meetingNotesData
            ? meetingNotesData?.map((d, i) => (
                <div key={i} className="w-full p-4 md:w-1/2">
                  <div className="relative rounded-lg border bg-white p-6 shadow">
                    <div className="absolute right-2 top-2 rounded-full bg-blue-200 px-4 py-2 text-lg font-semibold">
                      {d.score}
                    </div>
                    <p className="mb-4 text-lg font-bold">{d.categoryName}</p>
                    <ul className="list-disc pl-6">
                      {d.reason.map((r, j) => (
                        <li key={j}>{r.replace("- ", "")}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))
            : null}
        </div>
      </div>
    </>
  );
};
