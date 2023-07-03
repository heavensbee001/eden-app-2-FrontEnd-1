import { gql, useMutation, useQuery } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import { Maybe, Members } from "@eden/package-graphql/generated";
import { useRouter } from "next/router";
// import dynamic from "next/dynamic";
import React, { useContext, useEffect, useState } from "react";

import { Button, Modal } from "../../elements";

export interface IEdenAiLetter {
  isModalOpen: boolean;
  member: Maybe<Members>;
}

// mutation RejectionLetter($fields: rejectionLetterInput) {
//   rejectionLetter(fields: $fields) {
//     generatedLetter
//   }
// }

// {
//   "fields": {
//     "positionID": "6475ea6437d59a80df96028a",
//     "userID": "812342397790191638"
//   }
// }

export const REJECTION_LETTER = gql`
  mutation ($fields: rejectionLetterInput!) {
    rejectionLetter(fields: $fields) {
      generatedLetter
    }
  }
`;

export const EdenAiLetter = ({ isModalOpen, member }: IEdenAiLetter) => {
  const router = useRouter();
  const { positionID } = router.query;
  const [letterContent, setLetterContent] = useState("");

  // const generatedLetter = useMutation(REJECTION_LETTER, {
  //   variables: {
  //     fields: {
  //       positionID: positionID,
  //       userID: member?._id,
  //     },
  //   },
  // });

  const [rejectionLetter] = useMutation(REJECTION_LETTER, {
    onCompleted({ rejectionLetter }) {
      //   console.log("updateGrant", updateGrant);

      //   console.log("nodes", nodes);

      setLetterContent(rejectionLetter.generatedLetter);
      console.log("generatedLetter from completed", rejectionLetter);
      console.log("letterContent", rejectionLetter);
    },
  });

  useEffect(() => {
    if (isModalOpen === true)
      rejectionLetter({
        variables: {
          fields: {
            positionID: positionID,
            userID: member?._id,
          },
        },
      });

    console.log("generatedLetter", rejectionLetter);
  }, [isModalOpen]);

  const handleLetter = () => {
    rejectionLetter({
      variables: {
        fields: {
          positionID: positionID,
          userID: member?._id,
        },
      },
    });
  };

  return (
    <>
      <Modal open={isModalOpen}>
        <div className="flex flex-col items-center justify-end gap-10 space-y-6 ">
          <div className="w-full">
            <p className="text-xl font-bold">Personalized Rejection Message</p>
            <p>
              {member &&
                `Copy/Paste the following personalized message to gracefully reject ${member.discordName} 
              .`}
            </p>
          </div>

          <div className="h-fit border-2 bg-white p-6">
            {/* <p>
              {`Dear Jeremy,


            Thank you for taking the time to participate in our
            interview process. We certainly appreciated the opportunity to learn
            more about your capabilities and technical skills. However, after
            analyzing your profile, it was observed that your experience with
            some of the key technologies in our stack and leadership roles is
            somewhat limited. For this position, proficiency in these
            technologies and the ability to guide team members effectively is
            crucial, and the ability to make sound technical trade-off decisions
            is of great significance. We believe that with more experience and
            exploration, you'll be a capable candidate for similar roles in the
            future. We highly recommend looking into our sister companies that
            might have suitable opportunities fitting your current skill set.
            joineden.ai is a great resource where you can find these openings.
            We wish you the best in your future endeavors and career pursuits.


            Kind Regards, Miltiadis Saratzidis`}
            </p> */}

            {letterContent && <p>{letterContent}</p>}
          </div>
          <div>
            <Button onClick={handleLetter}>Copy Message To Clipboard</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
