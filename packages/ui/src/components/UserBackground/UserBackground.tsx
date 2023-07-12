import {
  // Endorsements,
  Maybe,
  PreviousProjectsType,
} from "@eden/package-graphql/generated";
import React from "react";

export interface IUserBackgroundProps {
  background: Array<Maybe<PreviousProjectsType>>;
  // initialEndorsements: Array<Maybe<Endorsements>>;
  experienceOpen: number | null;
  setExperienceOpen: React.Dispatch<React.SetStateAction<number | null>>;
}

interface NewObjType {
  __typename?: string;
  title: {
    jobTitle: string;
    companyName: string;
  };
  startDate: string | null;
  endDate: string | null;
  workPeriod: string;
  description: string[];
}

export const UserBackground = ({
  background,
  // initialEndorsements,
  experienceOpen,
  setExperienceOpen,
}: IUserBackgroundProps) => {
  const modifiedBackgroundArr: NewObjType[] = background
    .filter((obj): obj is PreviousProjectsType => obj !== null)
    .map((obj: PreviousProjectsType): NewObjType => {
      const splitTitle = obj.title ? obj.title.split(",") : ["", ""];

      const jobTitle = splitTitle[0]?.trim() || "";
      const companyName = splitTitle[1]?.trim() || "";

      let workPeriod = "";
      let description: string[] = [];

      if (obj.description) {
        const [extractedWorkPeriod, ...bulletPoints] =
          obj.description.split(" • ");

        workPeriod = extractedWorkPeriod.trim();
        description = bulletPoints.map((bullet: string) => bullet.trim());
      }

      // Make a copy of the object so we don't modify the original array.
      const newObj: NewObjType = {
        __typename: obj.__typename,
        title: {
          jobTitle: jobTitle,
          companyName: companyName,
        },
        startDate: obj.startDate !== undefined ? obj.startDate : null,
        endDate: obj.endDate !== undefined ? obj.endDate : null,
        workPeriod: workPeriod,
        description: description,
      };

      // Return the modified object.
      return newObj;
    });

  console.log("modifiedBackgroundArr", modifiedBackgroundArr);

  return (
    <div>
      <div className="">
        {/* <TextLabel1>🎡 Background</TextLabel1> */}
        {modifiedBackgroundArr?.map((item, index) => {
          const empty =
            !item?.description && !item?.startDate && !item?.endDate;

          if (!item?.title) return null;
          return (
            <div
              key={index}
              className="my-4 "
              id="user-background"
              onClick={() => {
                if (!empty)
                  setExperienceOpen(index === experienceOpen ? null : index);
              }}
            >
              <div className="mb-2 flex items-center">
                <span
                  className={`mr-3 ${
                    empty ? "cursor-default text-slate-400" : "cursor-pointer"
                  }`}
                >
                  {!empty && index === experienceOpen ? "▼" : "▶"}
                </span>
                <div className=" outline- 0 flex h-fit cursor-pointer flex-col justify-center  break-words !rounded-full  p-4 text-left">
                  <p className="font-bold">{item?.title.jobTitle}</p>
                  <p>{item?.title.companyName}</p>
                  <p className="text-[12px] text-gray-400">
                    {item?.workPeriod}
                  </p>
                </div>
                {/* {index < 2 && <span className="ml-3 text-xl">⭐️</span>} */}
              </div>
              {index === experienceOpen && (
                <div className="pl-8">
                  <div className="text-gray-500">
                    {/* <TextLabel1>Timeline</TextLabel1> */}
                    {item?.startDate && (
                      <p>
                        {`${new Date(Number(item?.startDate)).toLocaleString(
                          "default",
                          {
                            month: "short",
                          }
                        )} ${new Date(
                          Number(item?.startDate)
                        ).getFullYear()} - ${
                          item?.endDate
                            ? `${new Date(Number(item?.endDate)).toLocaleString(
                                "default",
                                { month: "short" }
                              )} ${new Date(
                                Number(item?.endDate)
                              ).getFullYear()}`
                            : "present"
                        }`}
                      </p>
                    )}
                  </div>
                  {/* <TextLabel1>Description</TextLabel1> */}
                  <div className="w-full space-y-4">
                    {item?.description.map((item, index) => (
                      <div className="   text-left" key={index}>
                        <div className="flex">
                          <p>{"•"}</p>
                          <p className="ml-2">{item}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* MEMEBER.ENDORSEMENT NO LONGER EXISTS */}

      {/* {initialEndorsements && initialEndorsements.length > 0 && (
        <div className="mt-3">
          <EndorsementList endorsements={initialEndorsements} />
        </div>
      )} */}
    </div>
  );
};
