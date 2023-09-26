export interface SkillSliderProps {}

export const SkillSlider = ({}: SkillSliderProps) => {
  return (
    <div className="relative flex items-center space-x-2">
      <h3>Proficient in other front-end frameworks</h3>
      <div className="relative h-[5px] w-52 rounded-lg bg-gray-600">
        <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-blue-500"></div>
      </div>
    </div>
  );
};
