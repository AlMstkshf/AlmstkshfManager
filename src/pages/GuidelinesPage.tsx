
import React from 'react';
import { useTranslations } from '../../hooks/useTranslations';

const GuidelinesPage: React.FC = () => {
  const { t } = useTranslations();

  const GuidelineSection: React.FC<{ titleKey: any; children: React.ReactNode }> = ({ titleKey, children }) => (
    <section className="mb-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-primary mb-4 border-b pb-2">{t(titleKey)}</h2>
      <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
        {children}
      </div>
    </section>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-secondary">{t('guidelinesPageTitle')}</h1>
      </header>

      <GuidelineSection titleKey="guidelinesIntroTitle">
        <p>{t('guidelinesIntroMessage')}</p>
      </GuidelineSection>

      <GuidelineSection titleKey="guidelinesProjectsTitle">
        <p>{t('guidelinesProjectsContentP1')}</p>
        <p>{t('guidelinesProjectsContentP2')}</p>
      </GuidelineSection>

      <GuidelineSection titleKey="guidelinesTasksTitle">
        <p>{t('guidelinesTasksContentP1')}</p>
        <p>{t('guidelinesTasksContentP2')}</p>
      </GuidelineSection>

      <GuidelineSection titleKey="guidelinesTodosTitle">
        <p>{t('guidelinesTodosContent')}</p>
      </GuidelineSection>

      <GuidelineSection titleKey="guidelinesAIFeaturesTitle">
        <p><strong>{t('projectIdeaGeneratorTitle')}:</strong> {t('guidelinesAIFeaturesContentP1')}</p>
        <p><strong>{t('suggestedProjectTimelineTitle')}:</strong> {t('guidelinesAIFeaturesContentP2')}</p>
        <p><strong>{t('taskCommentsTitle')}, {t('quickAddTaskModalTitle')}, {t('meetingAgendaTitle')}:</strong> {t('guidelinesAIFeaturesContentP3')}</p>
      </GuidelineSection>

      <GuidelineSection titleKey="guidelinesUserManagementTitle">
        <p>{t('guidelinesUserManagementContent')}</p>
      </GuidelineSection>

      <GuidelineSection titleKey="guidelinesUserProfileTitle">
        <p>{t('guidelinesUserProfileContent')}</p>
      </GuidelineSection>

      <GuidelineSection titleKey="guidelinesTipsTitle">
        <ul className="list-disc list-inside space-y-1 pl-4 rtl:pr-4 rtl:pl-0">
          <li>{t('guidelinesTipsContentLi1')}</li>
          <li>{t('guidelinesTipsContentLi2')}</li>
          <li>{t('guidelinesTipsContentLi3')}</li>
          <li>{t('guidelinesTipsContentLi4')}</li>
        </ul>
      </GuidelineSection>
      
    </div>
  );
};

export default GuidelinesPage;