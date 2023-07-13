export interface TextBodyProps {
  children?: React.ReactNode;
  className?: string;
}

export const TextBody = ({ children, className }: TextBodyProps) => {
  return <p className={`font-Unica ${className}`}>{children}</p>;
};
