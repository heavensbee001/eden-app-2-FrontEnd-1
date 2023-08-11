import { Transition } from "@headlessui/react";
import { Fragment } from "react";

import { EdenIconExclamationAndQuestion } from "../EdenIcons";

export type EdenAiProcessingModalContainedProps = {
  title?: string;
  children?: React.ReactNode;
  open?: boolean;
};

export const EdenAiProcessingModalContained = ({
  title = "",
  children,
  open = false,
}: EdenAiProcessingModalContainedProps) => {
  return (
    <Transition show={open} as={Fragment}>
      <div className={"absolute inset-0 z-30 overflow-y-auto"}>
        <div className="absolute bg-black bg-opacity-30 h-full top-0 w-full flex items-center justify-center rounded-md">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="relative z-30 inline-block overflow-x-hidden rounded-md bg-white text-left align-bottom shadow-xl transition-all sm:w-full sm:max-w-md sm:align-middle">
              <div
                className={
                  "flex min-h-[280px] w-full flex-col justify-center !pt-8 sm:my-8 sm:mt-0 sm:p-6"
                }
              >
                <div className="mx-auto mb-4">
                  <div
                    className="w-14 h-14"
                    style={{ animation: "spin 2s ease-in-out infinite" }}
                  >
                    <EdenIconExclamationAndQuestion className="w-full h-full" />
                  </div>
                </div>
                <h1 className="text-edenGreen-600 text-center">{title}</h1>
                <p className="text-center">{children}</p>
              </div>
            </div>
          </Transition.Child>
        </div>
      </div>
    </Transition>
  );
};

export default EdenAiProcessingModalContained;
