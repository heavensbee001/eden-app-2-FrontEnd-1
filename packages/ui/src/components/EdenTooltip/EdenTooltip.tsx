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
          className={classNames(
            "w-fit rounded-xl !opacity-100",
            className || ""
          )}
          id={`badgeTip-${id}-description`}
        >
          <div className="chat-message  text-gray-700">
            <div className={"flex "}>
              <div
                className={
                  "order-2 mx-2 flex max-w-[78%] flex-col items-start  text-xs"
                }
              >
                <span
                  // className="inline-block rounded-lg rounded-bl-none bg-gray-300 px-4 py-2 text-gray-600"
                  className={"inline-block rounded-2xl rounded-tl-none   pb-2"}
                >
                  <div className=" flex  items-center gap-1 text-[18px]  text-zinc-600">
                    <h1 className="text-edenGreen-600 text-md ">Eden&apos;s</h1>
                    <p className="mt-[2px] text-[14px]">insights</p>
                  </div>

                  <div className="mt-[1px] text-[14px]"> {innerTsx}</div>
                </span>
              </div>
            </div>
          </div>
        </ReactTooltip>
      </div>
    </>
  );
};
