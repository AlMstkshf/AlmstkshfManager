
import React, { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  footerContent?: ReactNode;
  className?: string;
  titleClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  children,
  footerContent,
  className = '',
  titleClassName = '',
  bodyClassName = '',
  footerClassName = '',
}) => {
  return (
    <div className={`bg-white shadow-lg rounded-lg overflow-hidden ${className}`}>
      {title && (
        <div className={`p-4 sm:p-5 border-b border-gray-200 ${titleClassName}`}>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{title}</h3>
        </div>
      )}
      <div className={`p-4 sm:p-5 ${bodyClassName}`}>
        {children}
      </div>
      {footerContent && (
        <div className={`p-4 sm:p-5 border-t border-gray-200 bg-gray-50 ${footerClassName}`}>
          {footerContent}
        </div>
      )}
    </div>
  );
};

export default Card;
