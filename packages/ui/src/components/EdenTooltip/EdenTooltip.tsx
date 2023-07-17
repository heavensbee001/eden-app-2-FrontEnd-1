import { FC } from "react";
import ReactTooltip, { TooltipProps } from "react-tooltip";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
export interface IEdenTooltipProps extends TooltipProps {
  children: React.ReactNode;
  innerTsx: React.ReactNode;
  id: string;
  containerClassName?: string;
}

export const EdenTooltip: FC<IEdenTooltipProps> = (
  props: IEdenTooltipProps
) => {
  const { id, innerTsx, children, className, containerClassName } = props;

  return (
    <>
      <div
        data-tip={id}
        data-for={`badgeTip-${id}-description`}
        className={classNames(containerClassName ? containerClassName : "")}
      >
        {children}
        <ReactTooltip
          {...(props as TooltipProps)}
          className={classNames("!opacity-100", className || "")}
          id={`badgeTip-${id}-description`}
        >
          <div className="chat-message p-2 text-gray-700">
            <div className={"flex items-start"}>
              <div
                className={
                  "order-2 mx-2 flex max-w-[78%] flex-col items-start space-y-2 text-xs"
                }
              >
                <span
                  // className="inline-block rounded-lg rounded-bl-none bg-gray-300 px-4 py-2 text-gray-600"
                  className={
                    "inline-block whitespace-pre-wrap rounded-lg rounded-tl-none border border-[#D1E4EE] bg-[#EDF2F7] px-4 py-2"
                  }
                >
                  {innerTsx}
                </span>
              </div>
              <img
                src="https://pbs.twimg.com/profile_images/1595723986524045312/fqOO4ZI__400x400.jpg"
                alt="My profile"
                className="order-1 h-6 w-6 rounded-full"
              />
            </div>
          </div>
        </ReactTooltip>
      </div>
    </>
  );
};
