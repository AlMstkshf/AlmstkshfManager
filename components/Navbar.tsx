
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import NotificationBell from './notifications/NotificationBell';
import { Language } from '../types';
import { useTranslations } from '../hooks/useTranslations';
import Button from './ui/Button';
import Input from './ui/Input'; // Import Input

const LogoutIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>;
const UserCircleIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const ChevronDownIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>;
const MagnifyingGlassIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>;
const XMarkIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;


const Navbar: React.FC = () => {
  const { currentUser, language, setLanguage, logout } = useAppContext();
  const { t } = useTranslations();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);


  const toggleLanguage = () => {
    setLanguage(language === Language.EN ? Language.AR : Language.EN);
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/login');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };
  
  const handleSearchToggle = () => {
    if (isSearchOpen) {
      setIsSearchOpen(false);
      setSearchTerm('');
    } else {
      setIsSearchOpen(true);
    }
  };
  
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node) && isSearchOpen) {
        // Don't close if clicking the search toggle button itself
        const targetElement = event.target as HTMLElement;
        if (!targetElement.closest('[data-search-toggle]')) {
             setIsSearchOpen(false);
             setSearchTerm('');
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);


  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" aria-label={t('appName')}>
          <img 
            src="https://i.ibb.co/F4Hg9gWh/ALMSTKSHF-MANAGER-APP-FROM-ALMSTKSHF-FOR-MEDIA-MONITORING.jpg" 
            alt={t('appName')} 
            className="h-10 w-auto"
          />
        </Link>
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          {/* Search Component */}
          <div ref={searchRef} className="relative flex items-center">
            {isSearchOpen ? (
              <div className="flex items-center transition-all duration-300 ease-in-out">
                <Input
                  ref={searchInputRef}
                  id="navbar-search"
                  type="search"
                  placeholder={t('searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-9 text-sm w-40 sm:w-56 md:w-64 !py-1.5 !px-3 rounded-md" 
                  aria-label={t('searchPlaceholder')}
                />
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleSearchToggle} 
                    className="p-1.5 ms-1 text-gray-600 hover:text-primary"
                    aria-label={t('searchToggleCloseAriaLabel')}
                    data-search-toggle 
                >
                    <XMarkIcon className="w-5 h-5"/>
                </Button>
              </div>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSearchToggle} 
                className="p-1.5 text-gray-600 hover:text-primary"
                aria-label={t('searchToggleOpenAriaLabel')}
                data-search-toggle
              >
                <MagnifyingGlassIcon className="w-5 h-5"/>
              </Button>
            )}
          </div>

          <NotificationBell />
          <Button onClick={toggleLanguage} variant="ghost" size="sm" className="whitespace-nowrap">
            {language === Language.EN ? t('languageToggleToArabic') : t('languageToggleToEnglish')}
          </Button>
          {currentUser ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={toggleDropdown} 
                className="flex items-center space-x-2 rtl:space-x-reverse p-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary transition-colors"
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
                aria-label={t('userProfilePageTitle')}
              >
                <span className="text-sm text-gray-700 hidden sm:inline">{currentUser.name}</span>
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt={currentUser.name} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center text-sm font-semibold">
                    {currentUser.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <ChevronDownIcon className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isDropdownOpen && (
                <div 
                  className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-56 bg-white rounded-md shadow-xl overflow-hidden ring-1 ring-black ring-opacity-5 z-50"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                >
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900 truncate">{currentUser.name}</p>
                    <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                  </div>
                  <div className="py-1">
                    <Link 
                      to="/profile" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                      role="menuitem"
                    >
                      <UserCircleIcon className="w-5 h-5 ms-3 text-gray-500" />
                      {t('sidebarMyProfile')}
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                      role="menuitem"
                    >
                      <LogoutIcon className="w-5 h-5 ms-3 text-gray-500" />
                      {t('logoutButton')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <span className="text-gray-700">{t('guest')}</span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
