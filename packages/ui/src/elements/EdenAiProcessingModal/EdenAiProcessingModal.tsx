import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { Fragment } from "react";

export type EdenAiProcessingModalProps = {
  title?: string;
  children?: React.ReactNode;
  open?: boolean;
};

export const EdenAiProcessingModal = ({
  title = "",
  children,
  open = false,
}: EdenAiProcessingModalProps) => {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog
        as="div"
        className={"fixed inset-0 z-30 overflow-y-auto"}
        onClose={() => {
          console.log("close");
        }}
      >
        <div
          className={
            "flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0"
          }
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay
              className={
                "fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              }
            />
          </Transition.Child>
          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className={"hidden sm:inline-block sm:h-screen sm:align-middle"}
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="relative z-30 inline-block min-h-[280px] overflow-x-hidden rounded-md bg-white !pt-8 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6 sm:align-middle">
              <div className={"mt-3 w-full sm:mt-0"}>
                <Image
                  width={40}
                  height={40}
                  className="mx-auto mb-4 animate-pulse"
                  src="/eden-logo.png"
                  alt=""
                />
                <Dialog.Title
                  as="h3"
                  className={`mb-4 text-center text-lg font-medium text-gray-900`}
                >
                  {title}
                </Dialog.Title>
                {children}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EdenAiProcessingModal;
