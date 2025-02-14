import { ReactNode } from "react";

export interface DefaultButtonProps {
  title: string;
  classname?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
  disabled?: boolean;
  color?: string;
  icon?: ReactNode;
}

export const DefaultButton: React.FC<DefaultButtonProps> = ({
  title,
  classname,
  onClick,
  children,
  disabled = false,
  color = "primary",
  icon,
}) => {
  return (
    <button
      className={`bg-primary text-white rounded-full px-4 py-2`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
      {icon}
      {title}
    </button>
  );
};

export default DefaultButton;
