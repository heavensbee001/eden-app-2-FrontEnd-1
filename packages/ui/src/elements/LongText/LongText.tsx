import { classNames } from "@eden/package-ui/utils";
import { useState } from "react";

export interface LongTextProps {
  text: string;
  cutText?: number;
  className?: string;
}
export const LongText = ({ text, className, cutText = 50 }: LongTextProps) => {
  const [showAll, setShowAll] = useState(false);

  if (!text) return null;
  return (
    <>
      <div
        className={classNames(
          className || "",
          "relative transition-max-height ease-in-out duration-500 overflow-hidden",
          showAll || text.length <= cutText ? "!max-h-screen" : "max-h-[2.3rem]"
        )}
      >
        {/* {showAll
          ? text
          : [...text.slice(0, cutText).split(" ").slice(0, -1), "..."].join(
              " "
            )}
        {text.length >= cutText && (
          <span
            className="ml-2 cursor-pointer text-xs text-edenGray-500"
            onClick={() => setShowAll((show) => !show)}
          >
            {showAll ? "less" : "more"}
          </span>
        )} */}
        <p>{text}</p>
        {!showAll && text.length >= cutText && (
          <div className="absolute bottom-0 bg-gradient-to-b from-transparent to-white h-3 w-full"></div>
        )}
      </div>
      <p className="text-center">
        {text.length >= cutText && (
          <span
            className="ml-2 cursor-pointer text-xs text-edenGray-500"
            onClick={() => setShowAll((show) => !show)}
          >
            {showAll ? "...less" : "more..."}
          </span>
        )}
      </p>
    </>
  );
};
