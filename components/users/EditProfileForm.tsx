import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useTranslations } from '../../hooks/useTranslations';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { User } from '../../types';

interface EditProfileFormProps {
  onClose: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ onClose }) => {
  const { currentUser, updateUser, addNotification } = useAppContext();
  const { t } = useTranslations();
  
  const [name, setName] = useState(currentUser?.name || '');
  const [nameError, setNameError] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(currentUser?.photoURL || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setPhotoPreview(currentUser.photoURL || null);
    }
  }, [currentUser]);

  const validateForm = (): boolean => {
    setNameError('');
    if (!name.trim()) {
      setNameError(t('genericRequiredError', { fieldName: t('userNameLabel') }));
      return false;
    }
    return true;
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF).');
        return;
      }
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert('File size should not exceed 2MB.');
        return;
      }
      setPhotoFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !currentUser) {
      return;
    }

    const processUpdate = (photoURL?: string) => {
      const updatedUserData: User = {
        ...currentUser,
        name,
        photoURL: photoURL !== undefined ? photoURL : currentUser.photoURL,
      };

      const success = updateUser(updatedUserData);
      
      if (success) {
        addNotification('profileUpdatedSuccessfully');
        onClose();
      } else {
        setNameError(t('error')); // Generic error
      }
    };

    if (photoFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        processUpdate(reader.result as string);
      };
      reader.readAsDataURL(photoFile);
    } else {
      processUpdate(currentUser.photoURL);
    }
  };

  if (!currentUser) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col items-center space-y-3">
        <img 
          src={photoPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'U')}&background=0D8ABC&color=fff&size=96`} 
          alt="Profile Preview" 
          className="w-24 h-24 rounded-full object-cover shadow-md"
        />
        <input
          type="file"
          id="photo-upload"
          ref={fileInputRef}
          className="hidden"
          accept="image/png, image/jpeg, image/gif"
          onChange={handlePhotoChange}
        />
        <Button type="button" variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()}>
            Change Photo
        </Button>
      </div>

      <Input
        label={t('userNameLabel')}
        id="profileName"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={nameError}
        required
        aria-describedby="profileNameError"
      />
      {nameError && <p id="profileNameError" className="text-xs text-red-600 -mt-3 mb-2">{nameError}</p>}

      <Input
        label={t('userEmailLabel')}
        id="profileEmail"
        type="email"
        value={currentUser.email}
        disabled // Email is not editable from this form
      />

      <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-2">
        <Button type="button" variant="ghost" onClick={onClose}>
          {t('cancel')}
        </Button>
        <Button type="submit">{t('updateProfileButton')}</Button>
      </div>
    </form>
  );
};

export default EditProfileForm;
