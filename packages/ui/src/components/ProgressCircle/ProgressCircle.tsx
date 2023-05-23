/* eslint-disable @next/next/no-img-element */
import "./styles.css";

export interface IProgressCircleProps {
  progress: number;
  color?: string;
  size?: number;
}

// eslint-disable-next-line no-unused-vars
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

// eslint-disable-next-line no-unused-vars
export const ProgressCircle = ({
  progress,
  color = "rgb(116 250 109)",
  size = 80,
}: IProgressCircleProps) => {
  const FULL_DASH_ARRAY = 283;
  const LIMIT = 100;

  function calculateFraction() {
    const rawTimeFraction = progress / LIMIT;

    return rawTimeFraction - (1 / LIMIT) * (1 - rawTimeFraction);
  }

  function circleDasharray() {
    const _circleDasharray = `${(calculateFraction() * FULL_DASH_ARRAY).toFixed(
      0
    )} 283`;

    return _circleDasharray;
  }

  return (
    <>
      <div
        style={{ width: size, height: size }}
        className={classNames(`relative`)}
      >
        <svg
          className="base-timer__svg"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g className="base-timer__circle">
            <circle
              className="base-timer__path-elapsed"
              cx="50"
              cy="50"
              r="45"
            ></circle>
            <path
              id="base-timer-path-remaining"
              strokeDasharray={circleDasharray()}
              color={color}
              className={"base-timer__path-remaining"}
              d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
            ></path>
          </g>
        </svg>
        <span
          id="base-timer-label"
          style={{ width: size, height: size }}
          className={classNames(
            `absolute top-0 flex items-center justify-center text-sm`
          )}
        >
          {progress}%
        </span>
      </div>
    </>
  );
};
