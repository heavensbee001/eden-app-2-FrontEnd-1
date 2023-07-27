export interface TextLabelProps {
  children?: React.ReactNode;
  className?: string;
}

export const TextLabel = ({ children, className }: TextLabelProps) => {
  return (
    <span
      className={`text-soilLabel font-Unica text-soilGray font-semibold uppercase ${className}`}
    >
      {children}
    </span>
  );
};
