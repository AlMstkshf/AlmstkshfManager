
import React, { useState, FormEvent, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useTranslations } from '@/hooks/useTranslations';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Checkbox from '@/components/ui/Checkbox';
import { User, UserPermissions, Permission } from '@/types';
import { TEAM_MEMBER_PERMISSIONS, PROJECT_MANAGER_PERMISSIONS, ADMIN_PERMISSIONS } from '@/constants';
import { adminInviteUser } from '@/firebase';


interface UserFormProps {
  onClose: () => void;
  userToEdit?: User;
}

const UserForm: React.FC<UserFormProps> = ({ onClose, userToEdit }) => {
  const { updateUser, currentUser } = useAppContext(); 
  const { t } = useTranslations();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [permissions, setPermissions] = useState<UserPermissions>(userToEdit ? userToEdit.permissions : TEAM_MEMBER_PERMISSIONS);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    setError('');
  }, [userToEdit]);
  
  const validateForm = (): boolean => {
    setError('');
    if (!name.trim()) {
      setError(t('genericRequiredError', { fieldName: t('userNameLabel') }));
      return false;
    }
    if (!email.trim()) {
      setError(t('genericRequiredError', { fieldName: t('userEmailLabel') }));
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError(t('emailInvalidError'));
      return false;
    }
    return true;
  };
  
  const handlePermissionChange = (permission: Permission, isChecked: boolean) => {
    setPermissions((prev: UserPermissions) => ({
      ...prev,
      [permission]: isChecked
    }));
  };
  
  const getRoleFromPermissions = (perms: UserPermissions): string => {
    if (perms[Permission.MANAGE_ORGANIZATION]) return 'Admin';
    if (perms[Permission.CREATE_PROJECTS]) return 'ProjectManager';
    return 'TeamMember';
  }

  const applyPreset = (preset: UserPermissions) => {
    setPermissions(preset);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    if (userToEdit) {
      const success = await updateUser({ ...userToEdit, name, email, permissions });
      if (!success) setError(t('errorUserExists', { email }));
      else onClose();
    } else {
      try {
        await adminInviteUser({
            email,
            fullName: name,
            role: getRoleFromPermissions(permissions)
        });
        onClose();
      } catch (err: any) {
        if(err.message.includes('already-exists')) {
            setError(t('errorUserExists', {email}));
        } else {
            setError(err.message || "An unknown error occurred.");
        }
      }
    }
    setIsLoading(false);
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          error={error.includes(t('userNameLabel')) ? error : undefined}
          required
        />
        <Input
          label={t('userEmailLabel')}
          id="userEmail"
          type="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          placeholder={t('userEmailPlaceholder')}
          error={error.includes(t('userEmailLabel')) || error.includes(t('emailInvalidError')) ? error : undefined}
          required
          disabled={!!userToEdit}
        />
      </div>
       {error && <div className="text-xs text-red-600 -mt-3 mb-2">
            <p>{error}</p>
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
        <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
          {t('cancel')}
        </Button>
        <Button type="submit" isLoading={isLoading}>{userToEdit ? t('updateUserBtn') : t('addUserBtn')}</Button>
      </div>
    </form>
  );
};

export default UserForm;
