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
};

type meetingNotesType = Category[];

export const MeetingNotes: FC<Props> = ({ member, candidate }) => {
  const [meetingNotesData, setMeetingNotesData] = useState<meetingNotesType>(
    []
  );

  // console.log("member = ", member);

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
    // console.log("candidate = 2", candidate);

    if (candidate?.notesInterview)
      setMeetingNotesData(candidate.notesInterview);
  }, [candidate]);

  return (
    <>
      {meetingNotesData
        ? meetingNotesData?.map((d, i) => (
            <div className="mb-10" key={i}>
              <div className="border-edenGreen-300 flex justify-between border-b px-1">
                <h3 className="text-edenGreen-500 mb-3">{d.categoryName}</h3>
              </div>
              <ul className="list-none space-y-1">
                {d.reason.map((r, j) => (
                  <li
                    key={j}
                    className="border-edenGray-100 w-full rounded-md border-b px-1"
                  >
                    <div className="flex w-full columns-2 items-center justify-between py-1">
                      <p className="w-full pr-4 text-sm">
                        {r.replace("- ", "")}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))
        : null}
    </>
  );
};
