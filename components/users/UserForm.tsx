import React, { useState, FormEvent, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useTranslations } from '../../hooks/useTranslations';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Checkbox from '../ui/Checkbox';
import { User, UserPermissions, Permission, TEAM_MEMBER_PERMISSIONS, PROJECT_MANAGER_PERMISSIONS, ADMIN_PERMISSIONS } from '../../types';

interface UserFormProps {
  onClose: () => void;
  userToEdit?: User;
}

const UserForm: React.FC<UserFormProps> = ({ onClose, userToEdit }) => {
  const { addUser, updateUser, currentUser } = useAppContext(); 
  const { t } = useTranslations();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [permissions, setPermissions] = useState<UserPermissions>(userToEdit ? userToEdit.permissions : TEAM_MEMBER_PERMISSIONS);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name);
      setEmail(userToEdit.email);
      setPermissions(userToEdit.permissions);
    } else {
      setName('');
      setEmail('');
      setPermissions(TEAM_MEMBER_PERMISSIONS);
    }
    setNameError('');
    setEmailError('');
  }, [userToEdit]);
  
  const validateForm = (): boolean => {
    let isValid = true;
    setNameError('');
    setEmailError('');

    if (!name.trim()) {
      setNameError(t('genericRequiredError', { fieldName: t('userNameLabel') }));
      isValid = false;
    }
    if (!email.trim()) {
      setEmailError(t('genericRequiredError', { fieldName: t('userEmailLabel') }));
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(t('emailInvalidError'));
      isValid = false;
    }
    return isValid;
  };
  
  const handlePermissionChange = (permission: Permission, isChecked: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [permission]: isChecked
    }));
  };

  const applyPreset = (preset: UserPermissions) => {
    setPermissions(preset);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    let success = false;
    const userData = { name, email, permissions };

    if (userToEdit) {
      success = updateUser({ ...userToEdit, ...userData });
      if (!success) setEmailError(t('errorUserExists', { email }));
    } else {
      success = addUser(userData as Omit<User, 'id'|'organizationId'|'status'>); 
      if (!success) setEmailError(t('errorUserExists', { email }));
    }
    
    if (success) onClose();
  };
  
  const PERMISSION_GROUPS = [
    { 
      title: "Projects",
      perms: [Permission.CREATE_PROJECTS, Permission.EDIT_ALL_PROJECTS, Permission.DELETE_ALL_PROJECTS, Permission.ARCHIVE_ALL_PROJECTS]
    },
    {
      title: "Tasks",
      perms: [Permission.CREATE_TASKS, Permission.EDIT_ALL_TASKS, Permission.DELETE_ALL_TASKS, Permission.ASSIGN_USERS_TO_TASKS]
    },
    {
      title: "Administration",
      perms: [Permission.MANAGE_USERS, Permission.MANAGE_ORGANIZATION, Permission.VIEW_ACTIVITY_LOG, Permission.ACCESS_DASHBOARD]
    },
    {
      title: "AI Features",
      perms: [Permission.GENERATE_PROJECT_TIMELINE, Permission.GENERATE_PROJECT_INSIGHTS, Permission.GENERATE_MEETING_AGENDA]
    }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={t('userNameLabel')}
          id="userName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={nameError}
          required
          aria-describedby="userNameError"
        />
        <Input
          label={t('userEmailLabel')}
          id="userEmail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('userEmailPlaceholder')}
          error={emailError}
          required
          aria-describedby="userEmailError"
        />
      </div>
       {(nameError || emailError) && <div className="text-xs text-red-600 -mt-3 mb-2">
            {nameError && <p id="userNameError">{nameError}</p>}
            {emailError && <p id="userEmailError">{emailError}</p>}
        </div>}

      <fieldset className="p-4 border rounded-md">
        <legend className="text-md font-semibold px-2">{t('permissions')}</legend>
        
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 block mb-2">{t('permissionPresets')}</label>
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="outline" onClick={() => applyPreset(ADMIN_PERMISSIONS)}>{t('applyAdminPreset')}</Button>
            <Button type="button" size="sm" variant="outline" onClick={() => applyPreset(PROJECT_MANAGER_PERMISSIONS)}>{t('applyPMPreset')}</Button>
            <Button type="button" size="sm" variant="outline" onClick={() => applyPreset(TEAM_MEMBER_PERMISSIONS)}>{t('applyTMPreset')}</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            {PERMISSION_GROUPS.map(group => (
              <div key={group.title}>
                  <h4 className="font-medium text-gray-800 mb-2">{group.title}</h4>
                  <div className="space-y-2">
                    {group.perms.map(p => (
                       <Checkbox
                          key={p}
                          id={p}
                          label={t(`permission_${p}` as any)}
                          checked={permissions[p]}
                          onChange={(e) => handlePermissionChange(p, e.target.checked)}
                          disabled={userToEdit?.id === currentUser?.id && p === Permission.MANAGE_ORGANIZATION}
                        />
                    ))}
                  </div>
              </div>
            ))}
        </div>

      </fieldset>

      <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-2">
        <Button type="button" variant="ghost" onClick={onClose}>
          {t('cancel')}
        </Button>
        <Button type="submit">{userToEdit ? t('updateUserBtn') : t('addUserBtn')}</Button>
      </div>
    </form>
  );
};

export default UserForm;
