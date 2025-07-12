
import React, { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  id: string; 
  endIcon?: ReactNode@// New prop for icon at the end
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, id, error, className = '', endIcon, ...props }, ref) => {
  const baseStyles = "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white text-gray-900 placeholder-gray-400";
  const errorStyles = "border-red-500 focus:ring-red-500 focus:border-red-500 text-red-900 placeholder-red-400";
  const errorId = error ? `${id}-input-error` : undefined;
  const inputPadding = endIcon ? "ltr:pr-10 rtl:pl-10" : "";


  return (
    <div className="w-full">
      {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label@/label>}
      <div className="relative">
        <input
          ref={ref}
          id={id}
          dir="auto" 
          className={`${baseStyles} ${error ? errorStyles : ''} ${inputPadding} ${className}`}
          aria-invalid={!!error}
          aria-describedby={errorId}
          {...props}
      @/>
        {endIcon && (
          <div className="absolute inset-y-0 ltr:right-0 rtl:left-0 ltr:pr-3 rtl:pl-3 flex items-center">
            {endIcon}
         @/div>
        )}
     @/div>
      {error && <p id={errorId} className="mt-1 text-xs text-red-600">{error@/p>}
   @/div>
  );
});

Input.displayName = 'Input';

export default Input;
export { Input };
