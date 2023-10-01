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
          className="hover:bg-edenGray-100 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full"
          onClick={() => setOpen(!open)}
        >
          {clickableElement}
        </div>

        <ul
          className={classNames(
            "style-none border-box border-edenGray-100 absolute right-0 z-40 w-[50vh] overflow-hidden rounded-sm bg-white transition-all duration-200 ease-in-out",
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
          className="fixed left-0 top-0 z-30 h-screen w-screen"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(false);
          }}
        ></div>
      )}
    </>
  );
};
