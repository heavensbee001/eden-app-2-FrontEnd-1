export interface IWizardStepProps {
  label: string;
  children: React.ReactNode;
  nextDisabled?: boolean;
  hideNext?: boolean;
  navigationDisabled?: boolean;
  nextButton?: React.ReactNode | undefined;
}

// eslint-disable-next-line no-unused-vars
export const WizardStep = ({
  children,
  // eslint-disable-next-line no-unused-vars
  label,
  // eslint-disable-next-line no-unused-vars
  nextDisabled = false,
  // eslint-disable-next-line no-unused-vars
  hideNext = false,
  // eslint-disable-next-line no-unused-vars
  navigationDisabled = false,
  // eslint-disable-next-line no-unused-vars
  nextButton,
}: IWizardStepProps) => {
  return <section className="h-full overflow-y-scroll">{children}</section>;
};
