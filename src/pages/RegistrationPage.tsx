
import React, { useState, FormEvent, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { useTranslations } from '@/hooks/useTranslations';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { User } from '@/types'; 

type RegistrationMode = 'join' | 'create';

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

const RegistrationPage: React.FC = () => {
  const { registerAndCreateOrg, registerWithInvite, currentUser } = useAppContext();
  const { t } = useTranslations();
  const navigate = useNavigate();

  const [mode, setMode] = useState<RegistrationMode>('create');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [organizationName, setOrganizationName] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      navigate('/', { replace: true });
    }
  }, [currentUser, navigate]);

  const validatePasswordPolicy = (pass: string): boolean => {
    const minLength = pass.length >= 8;
    const hasUppercase = /[A-Z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    return minLength && hasUppercase && hasNumber && hasSymbol;
  };

  const resetFormFields = () => {
    setFullName('');
    setEmail('');
    setPassword('');
    setShowPassword(false);
    setConfirmPassword('');
    setShowConfirmPassword(false);
    setInviteCode('');
    setOrganizationName('');
    setError(null);
  };

  const handleModeChange = (newMode: RegistrationMode) => {
    setMode(newMode);
    resetFormFields();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
        setError(t('genericRequiredError', {fieldName: t('fullNameLabel')}));
        return;
    }
    if (!email.trim() ||!/\S+@\S+\.\S+/.test(email)) {
        setError(t('emailInvalidError'));
        return;
    }
    if (!password.trim()) {
        setError(t('passwordRequiredError'));
        return;
    }
    if (!validatePasswordPolicy(password)) {
      setError(t('passwordPolicyError'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('passwordMismatchError'));
      return;
    }

    setIsLoading(true);

    let result: { success: boolean, error?: any };
    const userData = { name: fullName, email };

    if (mode === 'join') {
      if (!inviteCode.trim()) {
        setError(t('genericRequiredError', {fieldName: t('inviteCodeLabel')}));
        setIsLoading(false);
        return;
      }
      result = await registerWithInvite(userData, inviteCode, password);
    } else { 
      if (!organizationName.trim()) {
        setError(t('organizationNameRequiredError'));
        setIsLoading(false);
        return;
      }
      result = await registerAndCreateOrg(userData, organizationName, password);
    }

    setIsLoading(false);
    if (result.success) { 
      navigate('/', { replace: true });
    } else { 
      setError(result.error ? t(result.error) : t('registrationFailedError')); 
    }
  };
  
  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
  
  const commonInputClass = "bg-white/80 focus:bg-white/90";

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
      <div className="w-full max-w-lg bg-white bg-opacity-60 p-8 rounded-xl shadow-2xl">
        <div className="text-center mb-6">
            <img
                src="https://i.ibb.co/F4Hg9gM/ALMSTKSHF-MANAGER-APP-FROM-ALMSTKSHF-FOR-MEDIA-MONITORING.jpg"
                alt={t('appName') + " Logo"}
                className="mx-auto max-w-[280px] h-auto mb-2"
            />
            <h1 className="text-2xl font-bold text-gray-800">{t('registrationPageTitle')}</h1>
        </div>

        <div className="mb-6 flex justify-center border border-gray-300 rounded-lg p-1 bg-gray-100/70">
          <button
            onClick={() => handleModeChange('create')}
            className={`w-1/2 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out
                        ${mode === 'create' ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}
            aria-pressed={mode === 'create'}
          >
            {t('createOrganizationOption')}
          </button>
          <button
            onClick={() => handleModeChange('join')}
            className={`w-1/2 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out
                        ${mode === 'join' ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}
            aria-pressed={mode === 'join'}
          >
            {t('joinOrganizationOption')}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label={t('fullNameLabel')}
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className={commonInputClass}
            disabled={isLoading}
          />
          <Input
            label={t('emailLabel')}
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={commonInputClass}
            disabled={isLoading}
          />
          <Input
            label={t('passwordLabel')}
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={commonInputClass}
            disabled={isLoading}
            aria-describedby="password-policy-error"
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
          <Input
            label={t('confirmPasswordLabel')}
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={commonInputClass}
            disabled={isLoading}
            endIcon={
              <button 
                type="button" 
                onClick={toggleShowConfirmPassword} 
                className="text-gray-500 hover:text-gray-700"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            }
          />

          {mode === 'join' && (
            <Input
              label={t('inviteCodeLabel')}
              id="inviteCode"
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              required
              className={commonInputClass}
              disabled={isLoading}
              placeholder="e.g. ORG123"
            />
          )}

          {mode === 'create' && (
            <Input
              label={t('organizationNameLabel')}
              id="organizationName"
              type="text"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              required
              className={commonInputClass}
              disabled={isLoading}
            />
          )}

          {error && <p id="password-policy-error" role="alert" className="text-sm text-red-600 text-center bg-red-50 p-3 rounded-md">{error}</p>}

          <Button 
            type="submit" 
            className="w-full !py-3 text-base" 
            isLoading={isLoading} 
            disabled={isLoading}
            variant="primary"
          >
            {isLoading ? (mode === 'create' ? t('creatingOrganizationStatus') : t('joiningOrganizationStatus')) : t('registerButton')}
          </Button>
        </form>
        <p className="text-sm text-center text-gray-700 mt-6">
          <Link to="/login" className="font--medium text-primary hover:text-primary-dark hover:underline">
            {t('switchToLoginLink')}
          </Link>
        </p>
         <p className="text-xs text-gray-400 text-center mt-8">
          &copy; {new Date().getFullYear()} {t('appName')}. {t('allRightsReserved')}
        </p>
      </div>
    </div>
  );
};

export default RegistrationPage;
