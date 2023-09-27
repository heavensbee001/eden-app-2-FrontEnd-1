export interface SkillSliderProps {
  name?: string;
  score?: number;
}

export const SkillSlider = ({ name, score }: SkillSliderProps) => {
  return (
    <div className="relative flex items-center justify-between space-x-2">
      <p className="w-9/12">{name}</p>
      <div className="relative mt-1 h-[5px] w-52 rounded-lg bg-gray-600">
        <div
          className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-blue-500"
          style={{ left: `${score}0%` }}
        ></div>
      </div>
    </div>
  );
};
