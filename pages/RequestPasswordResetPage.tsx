
import React, { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { useTranslations } from '../hooks/useTranslations';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const RequestPasswordResetPage: React.FC = () => {
  const { requestPasswordReset } = useAppContext();
  const { t } = useTranslations();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError(t('emailInvalidError'));
      return;
    }

    setIsLoading(true);
    const success = await requestPasswordReset(email);
    setIsLoading(false);

    if (success) {
      setMessage(t('resetLinkSentMessage', { email }));
      setEmail(''); // Clear email field on success
    } else {
      // For security, often the message is the same whether email exists or not
      setMessage(t('resetLinkSentMessage', { email }));
      // setError(t('failedToSendResetLinkMessage')); // Or show generic success
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50"
      style={{
        backgroundImage: 'url(https://i.ibb.co/QFScnYTy/almstkshf-manager-landing-page-background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="w-full max-w-md bg-white bg-opacity-70 p-8 rounded-xl shadow-2xl">
        <div className="text-center mb-6">
          <img
            src="https://i.ibb.co/F4Hg9gWh/ALMSTKSHF-MANAGER-APP-FROM-ALMSTKSHF-FOR-MEDIA-MONITORING.jpg"
            alt={t('appName') + " Logo"}
            className="mx-auto max-w-[200px] h-auto mb-2" 
          />
          <h1 className="text-2xl font-bold text-gray-800">{t('requestPasswordResetPageTitle')}</h1>
        </div>

        <p className="text-sm text-gray-700 mb-6 text-center">{t('requestPasswordResetInstruction')}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label={t('emailLabel')}
            id="email-reset"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            disabled={isLoading}
            className="bg-white/80 focus:bg-white/90"
          />
          
          {message && <p role="status" className="text-sm text-green-700 bg-green-50 p-3 rounded-md text-center">{message}</p>}
          {error && <p role="alert" className="text-sm text-red-600 bg-red-50 p-3 rounded-md text-center">{error}</p>}

          <Button 
            type="submit" 
            className="w-full !py-3 text-base" 
            isLoading={isLoading} 
            disabled={isLoading}
            variant="primary"
          >
            {t('sendResetLinkButton')}
          </Button>
        </form>

        <p className="text-sm text-center text-gray-700 mt-8">
          <Link to="/login" className="font-medium text-primary hover:text-primary-dark hover:underline">
            {t('loginButton')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RequestPasswordResetPage;