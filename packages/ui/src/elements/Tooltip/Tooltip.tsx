// import { QuestionMarkCircleIcon } from "@heroicons/react/outline";
import ReactTooltip from "react-tooltip";
import { v4 as uuidv4 } from "uuid";

export interface TooltipProps {
  tipId?: string;
  className?: string;
  children: React.ReactNode;
}
export const Tooltip = ({ tipId, children, className }: TooltipProps) => {
  const id = tipId || uuidv4();

  return (
    <>
      <div
        data-tip
        data-for={id}
        className={`${className} text-2xs inline-block cursor-pointer text-gray-500`}
      >
        <div
          className={`border-edenGray-500 flex h-4 w-4 items-center justify-center rounded-full border-2 font-bold`}
        >
          i
        </div>
      </div>
      <ReactTooltip
        border
        id={id}
        place="top"
        effect="solid"
        textColor="#FFF"
        className="max-w-xs text-xs font-normal"
        borderColor="#000346"
        backgroundColor="#000346"
      >
        {children}
      </ReactTooltip>
    </>
  );
};
