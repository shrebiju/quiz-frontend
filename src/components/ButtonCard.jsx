import React from 'react';
import { BeatLoader } from 'react-spinners';

const ButtonCard = ({
  children,
  onClick,
  color = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  type = 'button',
  fullWidth = false,
  className = '',
  ...props
}) => {
  // Color variants
  const colorVariants = {
    primary: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500',
    success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
  };

  // Size variants
  const sizeVariants = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${colorVariants[color]} 
        ${sizeVariants[size]}
        ${fullWidth ? 'w-full' : ''}
        text-white font-medium rounded-md 
        focus:outline-none focus:ring-2 focus:ring-offset-2 
        transition-colors duration-200
        disabled:opacity-70 disabled:cursor-not-allowed
        flex items-center justify-center
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <BeatLoader color="#ffffff" size={8} className="mr-2" />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default ButtonCard;