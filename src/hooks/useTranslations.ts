
import { useAppContext } from '@/contexts/AppContext';
import { translations, LocaleKey } from '@/locales';
import { DEFAULT_LANGUAGE } from '@/constants';

export const useTranslations = () => {
  const { language } = useAppContext();

  const t = (key: LocaleKey, params?: Record<string, string | number>): string => {
    let translation = translations[language]?.[key] || translations[DEFAULT_LANGUAGE]?.[key] || key;
    
    if (params) {
      Object.keys(params).forEach(paramKey => {
        const regex = new RegExp(`{{${paramKey}}}`, 'g');
        translation = translation.replace(regex, String(params[paramKey]));
      });
    }
    
    return translation;
  };

  return { t, currentLanguage: language };
};
