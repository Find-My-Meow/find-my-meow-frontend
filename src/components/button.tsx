import React from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition duration-300 ${className}`}
    >
      {label}
    </button>
  );
};

export default Button;
