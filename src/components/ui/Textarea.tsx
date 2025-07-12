
import React, { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea: React.FC<TextareaProps> = ({ label, id, error, className = '', ...props }) => {
  const baseStyles = "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white text-gray-900 placeholder-gray-400";
  const errorStyles = "border-red-500 focus:ring-red-500 focus:border-red-500 text-red-900 placeholder-red-400";
  
  return (
    <div className="w-full">
      {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <textarea
        id={id}
        dir="auto" // For better handling of mixed LTR/RTL text
        className={`${baseStyles} ${error ? errorStyles : ''} ${className}`}
        rows={3}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default Textarea;
export { Textarea };
