import { Float } from "@headlessui-float/react";
import { FC, useRef, useState } from "react";

function useHover(delay = 150) {
  const [show, setShow] = useState(false);
  const timer = useRef<number | null>(null);

  function open() {
    if (timer.current !== null) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    setShow(true);
  }

  function close() {
    setShow(false);
  }

  function delayClose() {
    timer.current = setTimeout(() => {
      setShow(false);
    }, delay) as any;
  }

  return { show, setShow, timer, open, close, delayClose };
}
// Ref: https://headlessui-float.vercel.app/react/floatingui-options.html#placement

type PopoverOnHoverProps = {
  children: React.ReactNode;
  Content: () => JSX.Element;
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

export const PopoverOnHover: FC<PopoverOnHoverProps> = ({
  children,
  Content,
  size,
  ubication = "top",
}) => {
  const { show, open, delayClose } = useHover();

  return (
    <Float show={show} placement={ubication} offset={15} arrow={5}>
      <div className={``} onMouseEnter={open} onMouseLeave={delayClose}>
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
        onMouseEnter={open}
        onMouseLeave={delayClose}
      >
        <Float.Arrow className="absolute h-5 w-5 rotate-45 bg-white" />

        <div className="relative h-full overflow-hidden rounded-md bg-white p-2">
          {<Content />}
        </div>
      </div>
    </Float>
  );
};
