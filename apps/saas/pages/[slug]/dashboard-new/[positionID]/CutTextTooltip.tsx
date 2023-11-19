import { Maybe } from "@eden/package-graphql/generated";
import React, { useEffect, useRef, useState } from "react";
import ReactTooltip from "react-tooltip";

type CutTextTooltipProps = {
  text?: Maybe<string>;
};

const CutTextTooltip = ({ text }: CutTextTooltipProps) => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [tooltipDisable, setTooltipDisable] = useState(true);

  const handleTooltipVisible = () => {
    if (elementRef.current) {
      const element = elementRef.current;
      const isTruncated = element.scrollWidth > element.clientWidth;

      setTooltipDisable(!isTruncated);
    }
  };

  useEffect(() => {
    handleTooltipVisible();

    window.addEventListener("resize", handleTooltipVisible);

    return () => {
      window.removeEventListener("resize", handleTooltipVisible);
    };
  }, []);

  return (
    <>
      <div
        data-tip={text}
        data-for={`badgeTip-${text}`}
        className="text-truncate font-Moret text-edenGreen-600 text-center text-2xl font-bold leading-[34px]"
        ref={elementRef}
      >
        {text}
        <ReactTooltip
          id={`badgeTip-${text}`}
          className="font-Unica w-fit rounded-xl bg-black font-normal !opacity-100"
          place="top"
          disable={tooltipDisable}
          effect="solid"
        >
          {text}
        </ReactTooltip>
      </div>
    </>
  );
};

export default CutTextTooltip;
