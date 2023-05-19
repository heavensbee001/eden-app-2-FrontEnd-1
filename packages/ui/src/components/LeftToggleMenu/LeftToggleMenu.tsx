/* eslint-disable no-unused-vars */
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export interface LeftToggleMenuProps {
  defaultVisible?: boolean;
  children?: React.ReactNode;
}

export const LeftToggleMenu = ({
  defaultVisible = false,
  children,
}: LeftToggleMenuProps) => {
  const [visible, setVisible] = useState(defaultVisible);

  return (
    // <div className="absolute left-0 top-16 h-[calc(100%-4rem)] -translate-x-32">

    <div
      className={classNames(
        "absolute left-0 top-0 z-30 h-full transition-all ease-in-out",
        visible ? "" : "-translate-x-64"
      )}
    >
      <div className="h-full w-64 border-r border-gray-200 bg-white">
        {children}
      </div>
      <div
        className="absolute -right-5 top-4 z-10 flex h-12 w-5 cursor-pointer items-center justify-center rounded-br-md rounded-tr-md border border-l-0 border-gray-300 bg-gray-200"
        onClick={() => setVisible(!visible)}
      >
        {visible ? <FaChevronLeft className="-ml-[2px]" /> : <FaChevronRight />}
      </div>
    </div>
  );
};
