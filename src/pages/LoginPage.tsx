
import React, { useState, FormEvent, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import { useAppContext } from '@/contexts/AppContext';
import { useTranslations } from '@/hooks/useTranslations';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const EyeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EyeSlashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.575M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L6.228 6.228" />
  </svg>
);

const LoginPage: React.FC = () => {
  const { loginUser, currentUser } = useAppContext();
  const { t } = useTranslations();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      navigate('/', { replace: true });
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setPasswordError(null);
    setFormError(null);

    let isValid = true;
    if (!email.trim()) {
      setEmailError(t('emailRequiredError'));
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(t('emailInvalidError'));
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError(t('passwordRequiredError'));
      isValid = false;
    }

    if (!isValid) {
      return;
    }
    
    setIsLoading(true);
    const result = await loginUser(email, password); 

    setIsLoading(false);
    if (result.success) { 
      navigate('/', { replace: true });
    } else { 
      setFormError(result.error ? t(result.error) : t('loginFailedError'));
    }
  };
  
  const toggleShowPassword = () => setShowPassword(!showPassword);

  if (currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-bg p-4">
        <p>{t('redirectToDashboard')}</p>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{
        backgroundImage: 'url(https://i.ibb.co/QFScnY0/almstkshf-manager-landing-page-background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="w-full max-w-md bg-white bg-opacity-60 p-8 rounded-xl shadow-2xl">
        <div className="text-center mb-8">
          <img
            src="https://i.ibb.co/F4Hg9gM/ALMSTKSHF-MANAGER-APP-FROM-ALMSTKSHF-FOR-MEDIA-MONITORING.jpg"
            alt={t('appName') + " Logo"}
            className="mx-auto max-w-[280px] h-auto"
        />
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6" aria-labelledby="login-heading">
          <h2 id="login-heading" className="sr-only">{t('loginPageTitle')}</h2>
          <Input
            label={t('emailLabel')}
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError(null);
              if (formError) setFormError(null);
            }}
            placeholder="you@example.com"
            error={emailError || undefined}
            disabled={isLoading}
            required
            aria-describedby={emailError ? "email-error-text" : undefined}
          />
          {emailError && <p id="email-error-text" className="sr-only">{emailError}</p>}

          <Input
            label={t('passwordLabel')}
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) setPasswordError(null);
              if (formError) setFormError(null);
            }}
            placeholder="••••••••"
            error={passwordError || undefined}
            disabled={isLoading}
            required
            aria-describedby={passwordError ? "password-error-text" : undefined}
            endIcon={
              <button 
                type="button" 
                onClick={toggleShowPassword} 
                className="text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            }
        />
          {passwordError && <p id="password-error-text" className="sr-only">{passwordError}</p>}
          
          {formError && <p id="form-submission-error" role="alert" className="text-sm text-red-600 text-center bg-red-50 p-3 rounded-md">{formError}</p>}
          <Button 
            type="submit" 
            className="w-full !py-3 text-base" 
            isLoading={isLoading}
            disabled={isLoading}
            variant="primary"
          >
            {isLoading ? t('loggingInStatus') : t('loginButton')}
          </Button>
        </form>
        <div className="text-sm text-center text-gray-700 mt-6">
          <Link to="/request-password-reset" className="font-medium text-gray-600 hover:text-primary hover:underline">
            {t('forgotPasswordLink')}
          </Link>
        </div>
        <p className="text-sm text-center text-gray-700 mt-2">
          <Link to="/register" className="font-medium text-primary hover:text-primary-dark hover:underline">
            {t('registrationPageTitle')}
          </Link>
        </p>
        <p className="text-xs text-gray-400 text-center mt-8">
          &copy; {new Date().getFullYear()} {t('appName')}. {t('allRightsReserved', {defaultValue: 'All rights reserved.'})}
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
