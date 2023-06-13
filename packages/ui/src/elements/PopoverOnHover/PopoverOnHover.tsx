import { Float } from "@headlessui-float/react";
import { FC, useRef, useState } from "react";

function useHover(delay = 500) {
  const [show, setShow] = useState(false);
  const timer = useRef<number | null>(null);

  function handleMouseEnter() {
    if (timer.current !== null) {
      clearTimeout(timer.current);
      timer.current = null;
    }

    timer.current = setTimeout(() => {
      setShow(true);
    }, delay) as any;
  }

  function handleMouseLeave() {
    if (timer.current !== null) {
      clearTimeout(timer.current);
      timer.current = null;
    }

    setShow(false);
  }

  return { show, handleMouseEnter, handleMouseLeave };
}

export const PopoverOnHover: FC<PopoverOnHoverProps> = ({
  children,
  Content,
  size,
  ubication = "top",
}) => {
  const { show, handleMouseEnter, handleMouseLeave } = useHover();

  return (
    <Float show={show} placement={ubication} offset={15} arrow={5}>
      <div
        className={``}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>

      <div
        className={`-mx-2 p-2 w-${
          size
            ? size === "sm"
              ? "36"
              : size === "md"
              ? "48"
              : "80"
            : "[calc(100%+1rem)]"
        } rounded-md border border-gray-200 bg-white shadow-lg`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Float.Arrow className="absolute h-5 w-5 rotate-45 bg-white" />

        <div className="relative h-full overflow-hidden rounded-md bg-white p-2">
          {<Content />}
        </div>
      </div>
    </Float>
  );
};
