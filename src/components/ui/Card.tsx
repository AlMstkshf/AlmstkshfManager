
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

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
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

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
  return (
    <div className={`p-4 sm:p-5 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

export const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => {
  return (
    <div className={`p-4 sm:p-5 ${className}`}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<CardTitleProps> = ({ children, className = '' }) => {
  return (
    <h3 className={`text-lg sm:text-xl font-semibold text-gray-800 ${className}`}>
      {children}
    </h3>
  );
};

export default Card;
export { Card };
