import { CandidateType } from "@eden/package-graphql/generated";
import {
  Avatar,
  Badge,
  CheckBox,
  Loading,
  TextHeading2,
} from "@eden/package-ui";
import clsx from "clsx";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import {
  ComponentPropsWithoutRef,
  FC,
  ReactNode,
  useEffect,
  useState,
} from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface InputGroupProps extends ComponentPropsWithoutRef<"td"> {
  extraCssClass?: string;
  textColor?: string;
  children: string | ReactNode;
}

const ColumnStyled: FC<InputGroupProps> = ({
  extraCssClass,
  children,
  textColor = "text-gray-900",
  ...otherProps
}) => (
  <td
    className={clsx("text-md px-2 py-1", textColor, extraCssClass)}
    {...otherProps}
  >
    {children}
  </td>
);

type Grade = {
  letter: string;
  color: string;
};

const getGrade = (percentage: number, mainColumn: boolean): Grade => {
  let grade: Grade = { letter: "", color: "" };

  if (percentage >= 85) {
    grade = { letter: "A", color: "text-green-500" };
  } else if (percentage >= 75) {
    grade = { letter: "B", color: "text-green-200" };
  } else if (percentage >= 65) {
    if (mainColumn) grade = { letter: "C", color: "text-orange-300" };
    else grade = { letter: "C", color: "text-black" };
  } else {
    if (mainColumn) grade = { letter: "D", color: "text-red-300" };
    else grade = { letter: "D", color: "text-black" };
  }

  return grade;
};

interface CandidateTypeSkillMatch extends CandidateType {
  skillMatch: number;
  flagSkill?: boolean;
  totalMatchPerc?: number;
  letterAndColor?: {
    totalMatchPerc?: Grade;
    culture?: Grade;
    skill?: Grade;
    requirements?: Grade;
  };
}

export enum ListModeEnum {
  "list" = "list",
  "creation" = "creation",
  "edit" = "edit",
  "selectable" = "selectable",
}

type CandidatesTableListProps = {
  candidatesList: CandidateTypeSkillMatch[];
  // eslint-disable-next-line no-unused-vars
  setCandidatesList: (candidates: CandidateTypeSkillMatch[]) => void;
  fetchIsLoading: boolean;
  // eslint-disable-next-line no-unused-vars
  setRowObjectData: (candidate: CandidateTypeSkillMatch) => void;
  listMode?: ListModeEnum;
  candidateIDRowSelected?: string | null;
  // eslint-disable-next-line no-unused-vars
  handleChkSelection?: (candidate: CandidateTypeSkillMatch) => void;
  selectedIds?: string[];
};

export const CandidatesTableList: FC<CandidatesTableListProps> = ({
  candidatesList,
  setCandidatesList,
  fetchIsLoading,
  setRowObjectData,
  candidateIDRowSelected = null,
  listMode = ListModeEnum.list,
  handleChkSelection,
  selectedIds,
}) => {
  const handleObjectDataSelection = (candidate: CandidateTypeSkillMatch) => {
    setRowObjectData(candidate);
  };
  const [showMatchDetails, setShowMatchDetails] = useState(false);

  useEffect(() => {
    // console.log("candidatesList 00 0 = ", candidatesList);
    if (
      candidatesList.length > 0 &&
      (candidatesList[0]?.totalMatchPerc == undefined ||
        (candidatesList[0]?.flagSkill != true &&
          candidatesList[0]?.skillMatch != undefined))
    ) {
      // calculate the average score of the percentages for each candidatesList and save it on setCandidatesList
      const candidatesListWithSkillMatch = candidatesList.map((candidate) => {
        let totalMatchPerc = 0;
        let totalMatchPercCount = 0;

        let letterAndColor = {};

        let flagSkill = false;

        console.log("candidate?.skillMatch", candidate?.skillMatch);

        if (candidate?.skillMatch != undefined && candidate?.skillMatch > 0) {
          totalMatchPerc += candidate.skillMatch;
          totalMatchPercCount++;
          flagSkill = true;

          letterAndColor = {
            ...letterAndColor,
            skill: getGrade(candidate.skillMatch, false),
          };
        }

        if (candidate?.overallScore) {
          totalMatchPerc += candidate.overallScore;
          totalMatchPercCount++;

          letterAndColor = {
            ...letterAndColor,
            culture: getGrade(candidate.overallScore, false),
          };
        }

        if (
          candidate?.compareCandidatePosition?.CV_ConvoToPositionAverageScore
        ) {
          totalMatchPerc +=
            candidate?.compareCandidatePosition?.CV_ConvoToPositionAverageScore;
          totalMatchPercCount++;

          letterAndColor = {
            ...letterAndColor,
            requirements: getGrade(
              candidate?.compareCandidatePosition
                ?.CV_ConvoToPositionAverageScore,
              false
            ),
          };
        }

        totalMatchPerc = totalMatchPerc / totalMatchPercCount;

        totalMatchPerc = parseInt(totalMatchPerc.toFixed(1));

        letterAndColor = {
          ...letterAndColor,
          totalMatchPerc: getGrade(totalMatchPerc, true),
        };

        return {
          ...candidate,
          totalMatchPerc,
          flagSkill: flagSkill,
          letterAndColor,
        };
      });

      // sort the candidatesList by the totalMatchPerc
      const sortedCandidatesList = candidatesListWithSkillMatch.sort((a, b) => {
        if (a.totalMatchPerc > b.totalMatchPerc) {
          return -1;
        }
        if (a.totalMatchPerc < b.totalMatchPerc) {
          return 1;
        }
        return 0;
      });

      // console.log("candidatesList = 23", sortedCandidatesList);

      setCandidatesList(sortedCandidatesList);
    }
  }, [candidatesList]);

  console.log("candidatesList 00 0 = ", candidatesList);

  return (
    <section className="scrollbar-hide max-h-[calc(100vh-9.5rem)] w-full overflow-scroll rounded-md border border-gray-300 bg-white drop-shadow-md">
      <table className="text-md relative w-full">
        <thead className="sticky left-0 top-0 bg-slate-200 text-gray-800 shadow-md">
          <tr>
            {listMode !== ListModeEnum.list ? (
              <th className="border-b border-gray-300 py-2 font-medium">
                {/* Select */}
              </th>
            ) : null}
            <th className="min-w-min border-b border-gray-300 py-2 pl-2 text-start font-medium">
              Name
            </th>
            <th className="border-b border-gray-300 py-2 font-medium">
              Total
              {showMatchDetails ? (
                <AiOutlineEyeInvisible
                  size={24}
                  className="ml-2 inline cursor-pointer text-gray-600 hover:text-gray-400"
                  onClick={() => setShowMatchDetails(false)}
                />
              ) : (
                <AiOutlineEye
                  size={24}
                  className="ml-2 inline cursor-pointer text-gray-600 hover:text-gray-400"
                  onClick={() => setShowMatchDetails(true)}
                />
              )}
            </th>
            {showMatchDetails && (
              <th className={"border-b border-gray-300 py-2 font-medium"}>
                Requir.
              </th>
            )}
            {showMatchDetails && (
              <th
                className={
                  "border-b border-gray-300 py-2 font-medium transition-all duration-500 ease-in-out"
                }
              >
                Stats
              </th>
            )}
            {showMatchDetails && (
              <th
                className={
                  "border-b border-gray-300 py-2 font-medium transition-all duration-500 ease-in-out"
                }
              >
                Skills
              </th>
            )}
            <th className="border-b border-gray-300 py-2 pr-2 text-right font-medium">
              $/hour
            </th>
            <th className="border-b border-gray-300 py-2 font-medium">Level</th>
            <th
              className={classNames(
                "border-b border-gray-300 py-2 font-medium",
                !candidateIDRowSelected
                  ? "w-auto"
                  : "hidden w-0 overflow-hidden"
              )}
            >
              Location
            </th>
          </tr>
        </thead>
        <tbody>
          {fetchIsLoading ? (
            <tr>
              <td colSpan={8} className="content-center py-2">
                <Loading />
              </td>
            </tr>
          ) : Boolean(candidatesList) ? (
            candidatesList.map((candidate, idx) => (
              <tr
                key={`${candidate.user?._id}-${idx}`}
                onClick={() => handleObjectDataSelection(candidate)}
                className={`${
                  candidateIDRowSelected === candidate.user?._id
                    ? "bg-lime-100"
                    : "even:bg-slate-100"
                } group cursor-pointer  hover:bg-lime-50 focus:outline-none focus:ring focus:ring-gray-300 active:bg-gray-300`}
              >
                {listMode !== ListModeEnum.list ? (
                  <ColumnStyled className="-mr-1 w-8 px-0 py-0">
                    <CheckBox
                      className="-mr-1 pl-2"
                      name={candidate.user?._id!}
                      checked={
                        selectedIds
                          ? selectedIds.includes(candidate.user?._id!)
                          : false
                      }
                      onChange={() =>
                        handleChkSelection && handleChkSelection(candidate)
                      }
                    />
                  </ColumnStyled>
                ) : null}
                <ColumnStyled extraCssClass="border-r-0 pr-0">
                  <div className="flex flex-nowrap items-center">
                    <Avatar
                      size="xs"
                      src={candidate.user?.discordAvatar!}
                      alt={`${candidate.user?.discordName!.trim()}-avatar`}
                    />
                    <span className="ml-2">{candidate.user?.discordName!}</span>
                  </div>
                </ColumnStyled>
                <ColumnStyled textColor="text-fuchsia-600 text-center">
                  {candidate.totalMatchPerc &&
                  candidate.letterAndColor?.totalMatchPerc ? (
                    <TextHeading2
                      className={` ${candidate.letterAndColor.totalMatchPerc.color} font-black`}
                    >
                      {`${candidate.letterAndColor.totalMatchPerc.letter}`}
                    </TextHeading2>
                  ) : null}
                </ColumnStyled>

                {showMatchDetails &&
                  candidate?.compareCandidatePosition
                    ?.CV_ConvoToPositionAverageScore && (
                    <ColumnStyled textColor="text-[#EDBFB7] text-center">
                      <TextHeading2
                        className={` ${candidate?.letterAndColor?.requirements?.color} font-black`}
                      >
                        {`${candidate?.letterAndColor?.requirements?.letter}`}
                      </TextHeading2>
                    </ColumnStyled>
                  )}
                {showMatchDetails && candidate.overallScore && (
                  <ColumnStyled textColor="text-[#86C8BC] text-center">
                    <TextHeading2
                      className={` ${candidate?.letterAndColor?.culture?.color} font-black`}
                    >
                      {`${candidate?.letterAndColor?.culture?.letter}`}
                    </TextHeading2>
                  </ColumnStyled>
                )}

                {showMatchDetails && candidate.skillMatch && (
                  <ColumnStyled textColor="text-[#86C8BC] text-center">
                    <TextHeading2
                      className={` ${candidate?.letterAndColor?.skill?.color} font-black`}
                    >
                      {`${candidate?.letterAndColor?.skill?.letter}`}
                    </TextHeading2>
                  </ColumnStyled>
                )}

                <ColumnStyled extraCssClass="pr-2 text-right">
                  {candidate.user?.budget?.perHour ? (
                    <TextHeading2 className="font-black text-yellow-500">
                      ${candidate.user?.budget?.perHour}
                    </TextHeading2>
                  ) : // <span className="text-gray-400">-</span>
                  null}
                </ColumnStyled>
                <ColumnStyled extraCssClass="text-center">
                  {candidate?.user?.experienceLevel?.total ? (
                    <Badge
                      colorRGB="153,255,204"
                      tooltip={false}
                      text={
                        candidate?.user.experienceLevel?.total
                          ? candidate?.user.experienceLevel?.total <= 3
                            ? "Junior"
                            : candidate?.user.experienceLevel?.total <= 6
                            ? "Mid"
                            : "Senior"
                          : "Entry"
                      }
                      cutText={9}
                    />
                  ) : null}
                </ColumnStyled>

                <ColumnStyled
                  textColor="text-center"
                  extraCssClass={classNames(
                    candidateIDRowSelected
                      ? "hidden w-0 overflow-hidden"
                      : "w-auto"
                  )}
                >
                  {candidate.user?.location && (
                    <p>{candidate.user?.location}</p>
                  )}
                  {candidate.user?.timeZone && (
                    <p className="!text-xs text-gray-500">
                      {candidate.user?.timeZone}
                    </p>
                  )}
                </ColumnStyled>
              </tr>
            ))
          ) : (
            <tr>
              <ColumnStyled
                extraCssClass="text-center content-center py-2"
                textColor="black"
                colSpan={8}
              >
                No candidates found
              </ColumnStyled>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
};
