import { Dispatch, SetStateAction, useEffect } from "react";
import { BiChevronRight } from "react-icons/bi";

import { Step } from "../Wizard";

export interface IWizardStepsHeaderProps {
  steps: Array<Step>;
  currentStep: number;
  setStep: Dispatch<SetStateAction<number>>;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const WizardStepsHeader = ({
  steps,
  currentStep,
  setStep,
}: IWizardStepsHeaderProps) => {
  useEffect(() => {
    const activeStep = document.querySelector(`#wizard-header-${currentStep}`);

    if (activeStep) {
      activeStep.scrollIntoView({ behavior: "smooth", inline: "center" });
    }
  }, [currentStep]);

  return (
    <div className="scrollbar-hide absolute left-0 top-0 z-30 flex w-full overflow-x-scroll p-4">
      {steps.map((step, index) => (
        <div
          id={`wizard-header-${index}`}
          key={index}
          className="flex items-center"
        >
          <div
            className={classNames(
              currentStep === index
                ? "text-edenGreen-600"
                : "cursor-pointer text-edenGreen-400",
              currentStep !== index && step.navigationDisabled
                ? "!cursor-not-allowed"
                : ""
            )}
            onClick={() => {
              if (currentStep != index && !step.navigationDisabled)
                setStep(index);
            }}
          >
            <span
              className={classNames(
                "whitespace-nowrap text-xs",
                currentStep === index
                  ? "text-edenGreen-600"
                  : "text-edenGreen-400"
              )}
            >
              {step.label.toUpperCase()}
            </span>
          </div>
          {index < steps.length - 1 && (
            <span className="px-2 pt-[2px]">
              <BiChevronRight size={"1rem"} color="#00462C" />
            </span>
          )}
        </div>
      ))}
    </div>
  );
};
