import { EdenTooltip } from "../../components";
import { EdenIconExclamation } from "../EdenIcons";

export interface Candidate {
  name: string;
  score: number;
  reasonForPotential: string;
  index: number;
}

export interface SkillSliderProps {
  candidates?: Candidate[];
}

export const SkillSlider = ({
  name,
  score,
  reasonForPotential,
  index,
}: Candidate) => {
  return (
    <div className="relative flex items-center ">
      <EdenTooltip
        id={index.toString()}
        key={index}
        innerTsx={<div className="w-60">{reasonForPotential}</div>}
        place="top"
        effect="solid"
        backgroundColor="white"
        border
        borderColor="#e5e7eb"
        padding="0.5rem"
        offset={{ right: 100 }}
      >
        <div className="bg-edenPink-200 h-5 w-5 rounded-full p-1 shadow">
          <EdenIconExclamation className="h-full w-full cursor-pointer" />
        </div>{" "}
      </EdenTooltip>
      <p className="w-9/12">{name}</p>
      <div className="relative  h-[5px] w-52 rounded-lg bg-gray-300">
        <div
          className="bg-edenGreen-500 absolute left-0 h-[5px] rounded-lg"
          style={{ width: `${score}0%` }}
        ></div>
      </div>
    </div>
  );
};
