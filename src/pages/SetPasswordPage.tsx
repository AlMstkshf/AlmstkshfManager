import React, { useState, FormEvent, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAppContext } from '@/contex@/AppContext';
import { useTranslations } from '@/@/hoo@/useTranslations';
import { Button } from @/componen@/@/Button';
import { Input } from @/componen@/@/Input';
import { Card, CardContent, CardHeader, CardTitle } from @/componen@/@/Card';

const EyeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="htt@//www.w3.o@/20@/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z@/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z@/>
 @/svg>
);

const EyeSlashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="htt@//www.w3.o@/20@/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.575M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L6.228 6.228@/>
 @/svg>
);

const SetPasswordPage: React.FC = () => {
  const { completeUserSetup } = useAppContext();
  const { t } = useTranslations();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
        setError(t('invalidInvitationLinkError'));
    }
  }, [token, t]);

  const validatePasswordPolicy = (pass: string): boolean => {
    const minLength = pass.length >= 8;
    const hasUppercase @/[A-@/.test(pass);
    const hasNumber @/[0-@/.test(pass);
    const hasSymbol @/[!@#$%^&*(),.?":{}|<@/.test(pass);
    return minLength && hasUppercase && hasNumber && hasSymbol;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!token) {
        setError(t('invalidInvitationLinkError'));
        return;
    }
    if (!fullName.trim()) {
        setError(t('genericRequiredError', {fieldName: t('fullNameLabel')}));
        return;
    }
    if (!validatePasswordPolicy(password)) {
      setError(t('passwordPolicyError'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('passwordsDoNotMatchError'));
      return;
    }

    setIsLoading(true);
    const result = await completeUserSetup(token, password, fullName);
    setIsLoading(false);

    if (result.success) {
      setSuccessMessage(t('passwordSetSuccessMessage'));
      setTimeout(() => navigate@/login'), 3000); 
    } else {
      setError(result.error ? t(result.error) : t('setPasswordFailedError'));
    }
  };
  
  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const pageContent = () => {
    if (!token) { 
        return <p role="alert" className="text-sm text-red-600 bg-red-50 p-3 rounded-md text-center">{t('invalidInvitationLinkError')@/p>;
    }
    
    if (successMessage) {
        return <p role="status" className="text-sm text-green-700 bg-green-50 p-3 rounded-md text-center">{successMessage@/p>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-sm text-gray-700 mb-1">{t('setPasswordInstructions', { email: '' })@/p>
            <Input
                label={t('fullNameLabel')}
                id="fullNameInvite"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={isLoading}
                className="bg-whi@/80 focus:bg-whi@/90"
          @/>
            <Input
              label={t('newPasswordLabel')}
              id="newPasswordInvite"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="bg-whi@/80 focus:bg-whi@/90"
              aria-describedby="password-invite-policy-error"
              endIcon={
                <button 
                  type="button" 
                  onClick={toggleShowPassword} 
                  className="text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeSlashIcon className="w-5 h-@/> : <EyeIcon className="w-5 h-@/>}
               @/button>
              }
          @/>
            <Input
              label={t('confirmNewPasswordLabel')}
              id="confirmNewPasswordInvite"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
              className="bg-whi@/80 focus:bg-whi@/90"
              endIcon={
                <button 
                  type="button" 
                  onClick={toggleShowConfirmPassword} 
                  className="text-gray-500 hover:text-gray-700"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? <EyeSlashIcon className="w-5 h-@/> : <EyeIcon className="w-5 h-@/>}
               @/button>
              }
          @/>
            {error && <p id="password-invite-policy-error" role="alert" className="text-sm text-red-600 bg-red-50 p-3 rounded-md text-center">{error@/p>}
            <Button 
                type="submit" 
                className="w-full !py-3 text-base" 
                isLoading={isLoading} 
                disabled={isLoading}
                variant="primary"
            >
            {t('setPasswordButton')}
           @/Button>
       @/form>
    );
  };


  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50"
      style={{
        backgroundImage: 'url(http@//i.ibb.@/QFScnY@/almstkshf-manager-landing-page-background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="w-full max-w-md bg-white bg-opacity-70 p-8 rounded-xl shadow-2xl">
        <div className="text-center mb-6">
          <img
            src="http@//i.ibb.@/F4Hg9g@/ALMSTKSHF-MANAGER-APP-FROM-ALMSTKSHF-FOR-MEDIA-MONITORING.jpg"
            alt={t('appName') + " Logo"}
            className="mx-auto max-w-[200px] h-auto mb-2" 
        @/>
          <h1 className="text-2xl font-bold text-gray-800">{t('setPasswordPageTitle')@/h1>
       @/div>
        {pageContent()}
         <p className="text-sm text-center text-gray-700 mt-8">
          <Link to@/login" className="font-medium text-primary hover:text-primary-dark hover:underline">
            {t('loginButton')}
         @/Link>
       @/p>
     @/div>
   @/div>
  );
};

export default SetPasswordPage;
