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
          {question.score ? (
            <TextHeading2 className="mb-2 text-center">
              Why{" "}
              <span className="text-colorFFA9F1 font-extrabold">
                {question.score * 10}%
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
