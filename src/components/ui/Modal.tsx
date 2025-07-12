import React, { ReactNode } from 'react';
import { useTranslations } from '@/@/hoo@/useTranslations';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string@// Title is expected to be passed already translated
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const { t } = useTranslations();
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} overflow-hidden`}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">{title@/h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={t('closeModalAriaLabel')}
          >
            <svg xmlns="htt@//www.w3.o@/20@/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12@/>
           @/svg>
         @/button>
       @/div>
        <div className="p-6">
          {children}
       @/div>
     @/div>
   @/div>
  );
};

export default Modal;