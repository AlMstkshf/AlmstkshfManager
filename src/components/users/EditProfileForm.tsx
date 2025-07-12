
import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useTranslations } from '../../hooks/useTranslations';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { User } from '../../types';
import { storage, auth, db } from '../../firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';


interface EditProfileFormProps {
  onClose: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ onClose }) => {
  const { currentUser, addNotification } = useAppContext();
  const { t } = useTranslations();
  
  const [name, setName] = useState(currentUser?.name || '');
  const [nameError, setNameError] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(currentUser?.photoURL || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !currentUser || !auth.currentUser) {
      return;
    }

    setIsLoading(true);

    try {
        let photoURL = currentUser.photoURL;

        // If a new photo was selected (photoPreview is a data URL)
        if (photoPreview && photoPreview.startsWith('data:image')) {
            const storageRef = ref(storage, `profile_pictures/${currentUser.id}`);
            const uploadTask = await uploadString(storageRef, photoPreview, 'data_url');
            photoURL = await getDownloadURL(uploadTask.ref);
        }

        // Update Firebase Auth profile
        await updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: photoURL
        });
        
        // Update Firestore profile
        const userDocRef = doc(db, 'users', currentUser.id);
        await updateDoc(userDocRef, {
            name: name,
            photoURL: photoURL
        });
        
        addNotification('profileUpdatedSuccessfully');
        onClose();

    } catch (error) {
        console.error("Failed to update profile:", error);
        setNameError(t('error')); // Generic error
    } finally {
        setIsLoading(false);
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
        <Button type="button" variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
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
        disabled={isLoading}
        aria-describedby="profileNameError"
      />
      {nameError && <p id="profileNameError" className="text-xs text-red-600 -mt-3 mb-2">{nameError}</p>}

      <Input
        label={t('userEmailLabel')}
        id="profileEmail"
        type="email"
        value={currentUser.email}
        disabled 
      />

      <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-2">
        <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
          {t('cancel')}
        </Button>
        <Button type="submit" isLoading={isLoading}>{t('updateProfileButton')}</Button>
      </div>
    </form>
  );
};

export default EditProfileForm;