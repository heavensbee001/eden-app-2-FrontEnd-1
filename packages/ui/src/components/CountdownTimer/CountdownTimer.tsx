/* eslint-disable @next/next/no-img-element */
import "./styles.css";

import { useEffect, useState } from "react";

export interface ICountdownTimer {
  onCountdownEnd?: () => void;
}

// eslint-disable-next-line no-unused-vars
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

// eslint-disable-next-line no-unused-vars
export const CountdownTimer = ({ onCountdownEnd }: ICountdownTimer) => {
  const FULL_DASH_ARRAY = 283;
  // const WARNING_THRESHOLD = 10;
  // const ALERT_THRESHOLD = 5;

  // const COLOR_CODES = {
  //   info: {
  //     color: "green",
  //   },
  //   warning: {
  //     color: "orange",
  //     threshold: WARNING_THRESHOLD,
  //   },
  //   alert: {
  //     color: "red",
  //     threshold: ALERT_THRESHOLD,
  //   },
  // };
  const TIME_LIMIT = 600;
  // const remainingPathColor = COLOR_CODES.info.color;

  const [timeLeft, setTimeLeft] = useState<number>(TIME_LIMIT);

  // useEffect(() => {
  //   const _intervalId = setInterval(() => {
  //     console.log(timeLeft);

  //     setTimeLeft(timeLeft - 1);
  //     setCircleDasharray();
  //     // setRemainingPathColor(timeLeft);

  //     if (timeLeft === 0) {
  //       clearInterval(_intervalId);
  //     }
  //   }, 1000);

  //   return () => clearInterval(_intervalId);
  // }, []);
  useEffect(() => {
    if (timeLeft > 0)
      setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        setCircleDasharray();
      }, 1000);
  }, [timeLeft]);

  function formatTime(time: number) {
    const minutes = Math.floor(time / 60);
    let seconds: string | number = time % 60;

    if (seconds < 10) {
      seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
  }

  // function setRemainingPathColor(timeLeft: number) {
  //   const { alert, warning, info } = COLOR_CODES;

  //   if (document && timeLeft <= alert.threshold) {
  //     document
  //       ?.getElementById("base-timer-path-remaining")
  //       ?.classList.remove(warning.color);
  //     document
  //       ?.getElementById("base-timer-path-remaining")
  //       ?.classList.add(alert.color);
  //   } else if (timeLeft <= warning.threshold) {
  //     document
  //       ?.getElementById("base-timer-path-remaining")
  //       ?.classList.remove(info.color);
  //     document
  //       ?.getElementById("base-timer-path-remaining")
  //       ?.classList.add(warning.color);
  //   }
  // }

  function calculateTimeFraction() {
    const rawTimeFraction = timeLeft / TIME_LIMIT;

    return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
  }

  function setCircleDasharray() {
    const circleDasharray = `${(
      calculateTimeFraction() * FULL_DASH_ARRAY
    ).toFixed(0)} 283`;

    document
      ?.getElementById("base-timer-path-remaining")
      ?.setAttribute("stroke-dasharray", circleDasharray);
  }

  return (
    <>
      <div className="base-timer">
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
              strokeDasharray="283"
              className="base-timer__path-remaining ${remainingPathColor} green"
              d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
            ></path>
          </g>
        </svg>
        <span id="base-timer-label" className="base-timer__label">
          {formatTime(timeLeft)}
        </span>
      </div>
    </>
  );
};
