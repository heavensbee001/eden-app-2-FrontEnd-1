import { classNames } from "@eden/package-ui/utils";
import React, { ButtonHTMLAttributes, CSSProperties } from "react";

type ButtonProps = {
  variant?: "default" | "primary" | "secondary" | "tertiary";
  radius?: "default" | "rounded" | "pill";
  size?: "lg" | "md" | "sm";
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  style?: CSSProperties;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  children,
  variant = "default",
  // eslint-disable-next-line no-unused-vars
  radius = "default",
  // eslint-disable-next-line no-unused-vars
  size = "lg",
  className,
  disabled,
  loading,
  onClick,
  style,
}: ButtonProps) => {
  const btnCls = classNames(
    className || "",
    "py-2 px-4 font-Moret text-lg rounded-md font-bold",
    variant === "default" || variant === "primary"
      ? "box-border border-2 border-edenGreen-600 text-edenGreen-600 hover:bg-edenGreen-500 hover:border-edenGreen-500 hover:text-white disabled:!text-edenGray-500 disabled:!border-edenGray-500 disabled:!bg-edenGray-100"
      : "",
    variant === "secondary"
      ? "bg-edenGreen-600 text-white hover:bg-edenGreen-300 hover:text-edenGreen-600 disabled:!text-edenGray-500 disabled:!bg-edenGray-100"
      : "",
    variant === "tertiary"
      ? "text-edenGreen-600 hover:bg-edenGreen-200 disabled:!text-edenGray-500"
      : ""
  );

  const loader = (
    <svg
      className="animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      width="21px"
      height="21px"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        opacity="0.2"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        fill="#000000"
      />
      <path
        d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z"
        fill="#000000"
      />
    </svg>
  );

  return (
    <button
      style={style}
      className={btnCls}
      onClick={onClick}
      disabled={disabled}
    >
      {loading ? (
        <div className="flex items-center space-x-1">
          <div>{children}</div>
          {loader}
        </div>
      ) : (
        children
      )}
    </button>
  );
};
