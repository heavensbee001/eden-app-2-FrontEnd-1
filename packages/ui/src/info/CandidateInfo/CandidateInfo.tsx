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
  TextHeading3,
} from "@eden/package-ui";
import { Tab } from "@headlessui/react";
import { useState } from "react";

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
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export const CandidateInfo = ({
  memberID,
  percentage,
  summaryQuestions,
  mostRelevantMemberNode,
}: ICandidateInfoProps) => {
  const [index, setIndex] = useState(0);

  const { data: dataMember } = useQuery(FIND_MEMBER, {
    variables: {
      fields: {
        _id: memberID,
      },
    },
    skip: !Boolean(memberID),
    ssr: false,
  });

  const tabs = [
    {
      tab: "INFO",
      Content: () => (
        <InfoTab
          member={dataMember?.findMember}
          mostRelevantMemberNode={mostRelevantMemberNode}
        />
      ),
    },
    {
      tab: "MATCH",
      Content: () => (
        <MatchTab
          member={dataMember?.findMember}
          summaryQuestions={summaryQuestions}
        />
      ),
    },
    {
      tab: "GRAPH",
      Content: () => <GraphTab member={dataMember?.findMember} />,
    },
    {
      tab: "EDEN AI CHAT",
      Content: () => <EdenChatTab memberID={dataMember?.findMember._id} />,
    },
  ];

  return (
    <>
      <div className="font-Inter absolute z-20 h-44 w-full flex-col bg-white text-center">
        <div className="grid grid-cols-3 bg-white">
          <div className="col-1 mt-5 w-full p-2 text-center">
            <div className="flex w-full justify-end">
              <Button className="bg-red-400 font-bold text-white" radius="pill">
                REJECT
              </Button>
            </div>
          </div>
          <div className="col-2 p-2">
            <div className="flex w-full justify-center">
              <Avatar src={dataMember?.findMember.discordAvatar!} size={`lg`} />
            </div>
          </div>
          <div className="col-3 mt-5 w-full p-2 text-center">
            <div className="flex w-full justify-start">
              <Button
                variant="primary"
                radius="pill"
                className="font-bold text-white"
              >
                APPROVE
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <TextHeading3 className="font-extrabold">
            {dataMember?.findMember?.discordName}
          </TextHeading3>
        </div>
        <TextHeading3 className="font-extrabold text-gray-500">
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
          <Tab.List className="absolute top-40 z-20 flex h-8 w-full justify-between bg-white text-lg">
            {tabs.map(({ tab }, index) => (
              <Tab
                key={index}
                className={({ selected }) =>
                  classNames(
                    selected
                      ? "border-b-soilGreen-700 text-soilGreen-700 w-full border-b-2 outline-none"
                      : "font-avenir-roman w-full border-b-2 text-gray-400"
                  )
                }
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels>
            <div className="relative top-48">
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
