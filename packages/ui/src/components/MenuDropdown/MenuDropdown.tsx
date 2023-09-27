import { Fragment, useState } from "react";
import { BsThreeDots } from "react-icons/bs";

import { classNames } from "../../../utils";

export interface IMenuDropdownProps {
  children: Array<React.ReactElement>;
  clickableElement?: React.ReactElement;
  positionY?: "top" | "bottom";
  positionX?: "left" | "right";
}

export const MenuDropdown = ({
  children,
  clickableElement = <BsThreeDots />,
  positionY = "bottom",
  positionX = "left",
}: IMenuDropdownProps) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <div>
        <div
          className="hover:bg-edenGray-100 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          {clickableElement}
        </div>

        <ul
          className={classNames(
            "z-40 rounded-sm style-none border-box bg-white border-edenGray-100 w-[50vh] absolute right-0 overflow-hidden transition-all duration-200 ease-in-out",
            open ? "max-h-[50vh] border" : "max-h-0",
            positionY === "top" ? "bottom-8" : "top-8",
            positionX === "right" ? "!left-0" : ""
          )}
          style={{ maxWidth: "15rem" }}
          onClick={() => setOpen(false)}
        >
          {children && children.map((item: React.ReactElement) => item)}
        </ul>
      </div>
      {open && (
        <div
          className="z-30 fixed w-screen h-screen top-0 left-0"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(false);
          }}
        ></div>
      )}
    </>
  );
};
