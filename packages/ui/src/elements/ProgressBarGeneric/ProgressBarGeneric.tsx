function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export type ProgressBarGenericProps = {
  progress: number;
  color?: string;
};

export const ProgressBarGeneric = ({
  progress,
  color,
}: ProgressBarGenericProps) => {
  return (
    <div className="mb-2 h-2 w-full rounded-sm bg-gray-50">
      <div
        className={classNames(
          "h-2 rounded-sm",
          color ? `bg-${color}` : "bg-soilBlue"
        )}
        style={{ width: `${progress}%`, transition: "width 0.12s ease-in-out" }}
      ></div>
    </div>
  );
};

export default ProgressBarGeneric;
