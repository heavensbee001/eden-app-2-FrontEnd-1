import { SummaryQuestionType } from "@eden/package-graphql/generated";
import { PopoverOnHover, TextHeading2 } from "@eden/package-ui";
import { FC } from "react";

type PopoverScoreReasonProps = {
  children: React.ReactNode;
  question: SummaryQuestionType;
  size?: "sm" | "md" | "lg";
  ubication?:
    | "top"
    | "top-start"
    | "top-end"
    | "right"
    | "right-start"
    | "right-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end"
    | "left"
    | "left-start"
    | "left-end";
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const PopoverScoreReason: FC<PopoverScoreReasonProps> = ({
  children,
  question,
  // eslint-disable-next-line no-unused-vars
  size,
  ubication = "top",
}) => {
  const ContentToShow = () => {
    return (
      <div>
        <>
          {question.score != undefined ? (
            <TextHeading2 className="mb-2 text-center !text-lg">
              Why{" "}
              <span
                className={classNames(
                  "font-bold",
                  `text-${getPercentageColor(question.score * 10)}`
                )}
              >
                {getPercentageText(question.score * 10)}
              </span>
              ?
            </TextHeading2>
          ) : null}
          {question.reason ? (
            <ul className="mb-6 list-inside list-disc text-sm">
              {question.reason
                .split("-")
                .filter(Boolean)
                .map((bulletPoint, index) => (
                  <li key={index}>{bulletPoint.trim()}</li>
                ))}
            </ul>
          ) : null}
        </>
      </div>
    );
  };

  return (
    <PopoverOnHover size={"md"} ubication={ubication} Content={ContentToShow}>
      {children}
    </PopoverOnHover>
  );
};

const getPercentageColor = (percentage: number) => {
  let color = "";

  if (percentage >= 90) {
    color = "[#12A321]";
  } else if (percentage >= 70) {
    color = "[#8CE136]";
  } else if (percentage >= 50) {
    color = "[#FFCF25]";
  } else if (percentage >= 40) {
    color = "[#FF6847]";
  } else {
    color = "[#E40000]";
  }

  return color;
};

const getPercentageText = (percentage: number) => {
  let text = "";

  if (percentage >= 90) {
    text = "very strong";
  } else if (percentage >= 70) {
    text = "strong";
  } else if (percentage >= 50) {
    text = "neutral";
  } else if (percentage >= 40) {
    text = "weak";
  } else {
    text = "very weak";
  }

  return text.toUpperCase();
};
