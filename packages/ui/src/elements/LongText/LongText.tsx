import { useState } from "react";

import { Button } from "../Button";

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
      <p className={className}>
        {text.slice(0, cutText)}
        {showAll && text.slice(cutText)}
      </p>
      {text.length >= cutText && (
        <p className="text-center">
          <span
            className="cursor-pointer mx-auto text-xs text-edenGray-500"
            onClick={() => setShowAll((show) => !show)}
          >
            {showAll ? "less" : "more"}...
          </span>
        </p>
      )}
    </>
  );
};
