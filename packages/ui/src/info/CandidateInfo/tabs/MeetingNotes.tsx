import { gql, useQuery } from "@apollo/client";
import { Members } from "@eden/package-graphql/generated";
import { FC, useState } from "react";

const CANDIDATE_NOTES_EDENAI = gql`
  query ($fields: candidateNotesEdenAIInput!) {
    candidateNotesEdenAI(fields: $fields) {
      categoryName
      reason
    }
  }
`;

interface Props {
  member?: Members;
}

const data = [
  {
    categoryName: "Personal Details",
    reason: [
      "- Has 11+ years of experience in Computer Vision, Machine Learning, and Robotics",
      "- Worked as a Senior Machine Learning Engineer and Deep Learning Researcher at the University of Bristol",
      "- Specialized in fine-tuning, PyTorch, TensorFlow, and paper reading in Machine Learning",
    ],
  },
  {
    categoryName: "Work Culture",
    reason: [
      "- Has experience in team leadership in both 10clouds and EdenAI",
      "- Values growth mindset and quick innovation",
      "- Seeks to create a better environment for other coders to work in",
    ],
  },
  {
    categoryName: "Interests",
    reason: [
      "- Focused on front-end engineering with React, Tailwind, and Node.js for the backend using GraphQL",
      "- Worked on a challenging project in creating a graph-based visual representation of optical flow",
      "- Aims to become a successful CTO in the future",
    ],
  },
];

type Category = {
  categoryName: string;
  reason: string[];
};

type meetingNotesType = Category[];

export const MeetingNotes: FC<Props> = ({ member }) => {
  const [meetingNotesData, setMeetingNotesData] = useState<meetingNotesType>(
    []
  );

  const {} = useQuery(CANDIDATE_NOTES_EDENAI, {
    variables: {
      fields: {
        memberID: member?._id,
      },
    },
    skip: !member?._id,
    onCompleted: (data) => {
      console.log("data = ", data);

      setMeetingNotesData(data.candidateNotesEdenAI);
    },
  });

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
