// import { EdenTooltip } from "../../components";

export interface Candidate {
  name: string;
  score: number;
}

export interface SkillSliderProps {
  candidates?: Candidate[];
}

export const SkillSlider = ({ name, score }: Candidate) => {
  return (
    <div className="relative flex items-center justify-between space-x-2">
      {/* <EdenTooltip></EdenTooltip> */}
      <p className="w-9/12">{name}</p>
      <div className="relative mt-1 h-[5px] w-52 rounded-lg bg-gray-300">
        <div
          className="bg-edenGreen-500 absolute left-0 h-[5px] rounded-lg"
          style={{ width: `${score}0%` }}
        ></div>
      </div>
    </div>
  );
};
