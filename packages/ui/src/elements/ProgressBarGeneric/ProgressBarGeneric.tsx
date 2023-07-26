export type ProgressBarGenericProps = {
  progress: number;
  color?: string;
};

export const ProgressBarGeneric = ({
  progress,
  color,
}: ProgressBarGenericProps) => {
  return (
    <div className="h-2 w-full rounded-sm bg-gray-50">
      <div
        className={"h-2 rounded-sm"}
        style={{
          width: `${progress}%`,
          transition: "width 0.12s ease-in-out",
          backgroundColor: color ? color : "#7FA294",
        }}
      ></div>
    </div>
  );
};

export default ProgressBarGeneric;
