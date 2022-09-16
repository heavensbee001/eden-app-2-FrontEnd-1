/* eslint-disable camelcase */
import { Maybe, Members, SkillType_Member } from "@graphql/eden/generated";
import { Button, Card, MatchAvatar, SkillList, SocialMediaComp } from "ui";

export interface MemberMatchCardProps {
  percentage: string;
  member: Members;
  requiredSkills: Maybe<SkillType_Member>[];
  onClick?: () => void;
}

export const MemberMatchCard = ({
  percentage,
  member,
  requiredSkills,
  onClick,
}: MemberMatchCardProps) => {
  const mySkills: Maybe<SkillType_Member>[] | undefined = [];

  member.skills?.forEach((skill) => {
    mySkills.push(skill);
  });

  const isSameSkills = (
    a: Maybe<SkillType_Member>,
    b: Maybe<SkillType_Member>
  ) => a?.skillInfo?.name === b?.skillInfo?.name;

  const matchedSkills = (left: any, right: any, compareFunction: any) =>
    left.filter((leftValue: any) =>
      right.some((rightValue: any) => compareFunction(leftValue, rightValue))
    );

  const missingSkills = (left: any, right: any, compareFunction: any) =>
    left.filter(
      (leftValue: any) =>
        !right.some((rightValue: any) => compareFunction(leftValue, rightValue))
    );

  const getRandomColor = () => {
    const colors = [
      "120, 238, 203, 0.5",
      "255, 146, 205, 0.4",
      "255, 242, 104, 0.5",
      "155, 103, 255, 0.44",
      "136, 169, 255, 0.5",
      "83, 212, 240, 0.4",
      "168, 253, 82, 0.4",
    ];

    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <Card
      shadow={true}
      className="relative flex w-max flex-col items-center justify-center p-5"
    >
      <MatchAvatar src={member.discordAvatar!} percentage={percentage} />
      <h1 className="font-poppins text-darkGreen text-soilHeading2 font-medium">
        {member.discordName}{" "}
        <span className="text-soilGray font-Inter text-xs font-semibold">
          #{member.discriminator}
        </span>
      </h1>
      <p className="text-soilLabel font-Inter mb-2 font-semibold uppercase">
        {member.memberRole?.title}
      </p>
      <SocialMediaComp links={member.links} size="20px" title="" />
      <div className="mt-3 w-full self-start">
        <p className="text-soilGray text-soilLabel font-Inter font-semibold">
          MATCHING SKILLS
        </p>
        <div className="flex w-60 flex-wrap">
          <SkillList
            skills={matchedSkills(requiredSkills, mySkills, isSameSkills)}
            colorRGB={getRandomColor()}
          />
        </div>
        <p className="text-soilGray text-soilLabel font-Inter mt-3 font-semibold">
          MISSING SKILLS
        </p>
        <div className="flex w-60 flex-wrap">
          <SkillList
            skills={missingSkills(requiredSkills, mySkills, isSameSkills)}
            colorRGB={"170, 170, 170, 0.12"}
          />
        </div>
      </div>
      <Button className="absolute top-1 right-1" onClick={onClick}>
        More
      </Button>
    </Card>
  );
};