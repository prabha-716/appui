import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`px-4 py-2 rounded-3xl h-14 w-4/5 bg-[#FFFDF2] text-black border border-[dfdfdf] focus:outline-none focus:ring-2 focus:ring-[#dfdfdf] ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = "Input"
