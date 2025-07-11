import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useTranslations } from '../../hooks/useTranslations';
import { TourStep } from '../../types';

interface TourModalProps {
  isOpen: boolean;
  onClose: () => void; // Typically the finishTour action
  step: TourStep;
  onNext: () => void;
  onPrev: () => void;
  isLastStep: boolean;
  isFirstStep: boolean;
  currentStepIndex: number;
  totalSteps: number;
}

const TourModal: React.FC<TourModalProps> = ({
  isOpen,
  onClose,
  step,
  onNext,
  onPrev,
  isLastStep,
  isFirstStep,
  currentStepIndex,
  totalSteps,
}) => {
  const { t } = useTranslations();

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t(step.titleKey)} size="md">
      <div className="space-y-4">
        <p className="text-gray-600 text-sm whitespace-pre-line">{t(step.messageKey)}</p>
        
        <div className="text-center text-xs text-gray-500 mt-4">
          {t('tourStepProgress', { currentStep: currentStepIndex + 1, totalSteps })}
        </div>

        <div className="flex justify-between items-center pt-4 border-t mt-4">
          <Button onClick={onPrev} disabled={isFirstStep} variant="ghost">
            {t('tourPreviousButton')}
          </Button>
          <div className="flex space-x-2 rtl:space-x-reverse">
            <Button onClick={onClose} variant="outline"> {/* Always allow skipping */}
              {t('tourFinishButton')}
            </Button>
            {!isLastStep && (
              <Button onClick={onNext}>
                {t('tourNextButton')}
              </Button>
            )}
            {isLastStep && (
              <Button onClick={onClose} variant="primary">
                {t('tourFinishButton')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TourModal;