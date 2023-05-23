import { gql, useQuery } from "@apollo/client";
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
};

type meetingNotesType = Category[];

export const MeetingNotes: FC<Props> = ({ member, candidate }) => {
  const [meetingNotesData, setMeetingNotesData] = useState<meetingNotesType>(
    []
  );

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

  //     setMeetingNotesData(data.candidateNotesEdenAI);
  //   },
  // });

  useEffect(() => {
    // if (dataProject?.findProject) setProject(dataProject?.findProject);
    console.log("candidate = 2", candidate);

    if (candidate) setMeetingNotesData(candidate.notesInterview);
  }, [candidate]);

  return (
    <>
      <div className="container mx-auto px-4">
        <div className="-mx-4 flex flex-wrap">
          {meetingNotesData.map((d, i) => (
            <div key={i} className="w-full p-4 md:w-1/2">
              <div className="rounded-lg border bg-white p-6 shadow">
                <h3 className="mb-4 text-lg font-bold">{d.categoryName}</h3>
                <ul className="list-disc pl-6">
                  {d.reason.map((r, j) => (
                    <li key={j}>{r.replace("- ", "")}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
