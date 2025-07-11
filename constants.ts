import { Language } from './types';

export const PROJECT_COLORS: { name: string; value: string; twClass: string }[] = [
  { name: 'Blue', value: '#007bff', twClass: 'bg-blue-500' },
  { name: 'Indigo', value: '#6f42c1', twClass: 'bg-indigo-500' },
  { name: 'Red', value: '#dc3545', twClass: 'bg-red-500' },
  { name: 'Orange', value: '#fd7e14', twClass: 'bg-orange-500' },
  { name: 'Yellow', value: '#ffc107', twClass: 'bg-yellow-500' },
  { name: 'Green', value: '#28a745', twClass: 'bg-green-500' },
  { name: 'Teal', value: '#20c997', twClass: 'bg-teal-500' },
  { name: 'Cyan', value: '#17a2b8', twClass: 'bg-cyan-500' },
  { name: 'Pink', value: '#e83e8c', twClass: 'bg-pink-500' },
  { name: 'Gray', value: '#6c757d', twClass: 'bg-gray-500' },
];

// APP_NAME constant is removed. The t('appName') from locales.ts will be used.
export const DEFAULT_LANGUAGE = Language.EN;