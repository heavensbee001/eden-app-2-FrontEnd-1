export interface Candidate {
  name: string;
  score: number;
}

export interface SkillSliderProps {
  candidates?: Candidate[];
}

export const SkillSlider = ({ candidates = [] }: SkillSliderProps) => {
  console.log("candidates from Slider Component", candidates);
  return (
    <div>
      {candidates.length &&
        candidates.map((item, index) => (
          <div
            className="relative flex items-center justify-between space-x-2"
            key={index}
          >
            <p className="w-9/12">{item.futurePotential}</p>
            <div className="relative mt-1 h-[5px] w-52 rounded-lg bg-gray-600">
              <div
                className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-blue-500"
                style={{ left: `${item.score}0%` }}
              ></div>
            </div>
          </div>
        ))}
    </div>
  );
};
