/* eslint-disable no-unused-vars */
import { useQuery } from "@apollo/client";
import { FIND_MEMBER } from "@eden/package-graphql";
import { SummaryQuestionType } from "@eden/package-graphql/generated";
import {
  Avatar,
  Button,
  EdenChatTab,
  GraphTab,
  InfoTab,
  MatchTab,
  MeetingNotes,
  ReportNotes,
  TextHeading3,
} from "@eden/package-ui";
import { Tab } from "@headlessui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

type NodeDisplay = {
  nameRelevantNode: string;
  nameOriginalNode: string;
  score: number;
  color: string;
};

type relevantNodeObj = {
  [key: string]: {
    nodes: NodeDisplay[];
  };
};

export interface ICandidateInfoProps {
  memberID: string;
  percentage: number | null;
  summaryQuestions?: SummaryQuestionType[];
  mostRelevantMemberNode?: relevantNodeObj;
  candidate?: any;
  selectedUserScoreLetter?: any;
  onClose?: () => void;
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export const CandidateInfo = ({
  memberID,
  percentage,
  summaryQuestions,
  mostRelevantMemberNode,
  selectedUserScoreLetter,
  candidate,
  onClose,
}: ICandidateInfoProps) => {
  const [index, setIndex] = useState(0);

  const router = useRouter();

  const { data: dataMember } = useQuery(FIND_MEMBER, {
    variables: {
      fields: {
        _id: memberID,
      },
    },
    skip: !Boolean(memberID),
    ssr: false,
  });

  console.log("selectedUserScoreLetter 000f0f0 = ", selectedUserScoreLetter);

  const tabs = [
    {
      tab: "Bio",
      Content: () => (
        <InfoTab
          member={dataMember?.findMember}
          mostRelevantMemberNode={mostRelevantMemberNode}
          selectedUserScoreLetter={selectedUserScoreLetter}
        />
      ),
    },
    {
      tab: "Requirements",
      Content: () => (
        <ReportNotes
          member={dataMember?.findMember}
          candidate={candidate}
          selectedUserScoreLetter={selectedUserScoreLetter}
        />
      ),
    },
    {
      tab: "Stats",
      Content: () => (
        <MatchTab
          member={dataMember?.findMember}
          summaryQuestions={summaryQuestions}
          selectedUserScoreLetter={selectedUserScoreLetter}
        />
      ),
    },
    {
      tab: "Skill Graph",
      Content: () => (
        <GraphTab
          member={dataMember?.findMember}
          selectedUserScoreLetter={selectedUserScoreLetter}
        />
      ),
    },
    {
      tab: "Highlights",
      Content: () => (
        <MeetingNotes member={dataMember?.findMember} candidate={candidate} />
      ),
    },
    {
      tab: "Interview",
      Content: () => (
        <EdenChatTab
          memberImg={dataMember?.findMember.discordAvatar}
          conversationID={candidate.conversationID}
        />
      ),
    },
  ];

  console.log("candidate = ", candidate);

  return (
    <>
      <div className="font-Inter absolute z-20 h-40 w-full flex-col bg-white text-center">
        <FaChevronLeft
          className="absolute left-4 top-4 cursor-pointer text-gray-500 hover:text-gray-400"
          onClick={onClose}
        />
        <div className="grid w-full grid-cols-3 bg-white">
          <div className="col-1 mt-5 w-full py-2 text-center">
            {!router.pathname.includes("/talentlist") ? (
              <div className="flex w-full justify-end">
                <Button
                  className="border-none bg-red-400 text-sm font-bold text-white hover:bg-red-500"
                  radius="pill"
                >
                  REJECT
                </Button>
              </div>
            ) : null}
          </div>
          <div className="col-2 p-2 pb-1">
            <div className="flex w-full justify-center">
              <Avatar src={dataMember?.findMember.discordAvatar!} size={`lg`} />
            </div>
          </div>
          <div className="col-3 mt-5 w-full py-2 text-center text-sm">
            {!router.pathname.includes("/talentlist") ? (
              <div className="flex w-full justify-start">
                <Button
                  variant="primary"
                  radius="pill"
                  className="border-none font-bold text-white"
                >
                  APPROVE
                </Button>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex w-full justify-center px-4">
          <TextHeading3 className="font-extrabold">
            {dataMember?.findMember?.discordName}
          </TextHeading3>
        </div>
        <TextHeading3 className="w-full justify-center px-4 !text-sm font-bold text-gray-400">
          {dataMember?.findMember?.memberRole?.title}
        </TextHeading3>
      </div>
      <div className="w-full bg-white">
        <Tab.Group
          defaultIndex={index}
          onChange={(index: number) => {
            console.log("Changed selected tab to:", index);
            setIndex(index);
          }}
        >
          <Tab.List className="absolute top-36 z-20 flex h-8  w-full justify-between bg-white text-lg">
            {tabs.map(({ tab }, index) => (
              <Tab
                key={index}
                className={({ selected }) =>
                  classNames(
                    "pt-px text-[14px]",
                    selected
                      ? "border-b-soilGreen-700 w-full border-b-2 bg-lime-50 text-gray-600 outline-none"
                      : "font-avenir-roman w-full border-b-2 text-gray-400 hover:bg-gray-50 hover:text-gray-500"
                  )
                }
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels>
            <div className="relative top-44">
              {tabs.map(({ Content }, index) => (
                <Tab.Panel key={index}>
                  {/* <div className="h-[calc(100vh-17rem)]"> */}
                  {/* <div className="relative"> */}
                  <div className="abolute px-6">
                    <Content />
                  </div>
                  {/* </div> */}
                </Tab.Panel>
              ))}
            </div>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </>
  );
};
