
import React, { useState, useMemo } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useTranslations } from '@/hooks/useTranslations';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import UserForm from '@/components/users/UserForm';
import { User } from '@/types';
import { getPermissionSummary } from '@/utils/helpers';

const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c1.153 0 2.24.03 3.22.077m3.22-.077L10.879 3.286a1.125 1.125 0 011.07-1.071h.078a1.125 1.125 0 011.07 1.07L15.18 5.79m-3.22-.077c1.153 0 2.24.03 3.22.077" /></svg>;
const UserGroupIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.071M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>;
const ShieldExclamationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 12.75h.008v.008H12v-.008z" /></svg>;

const UserManagementPage: React.FC = () => {
  const { users, deleteUser, canCurrentUserManageUsers, isCurrentUserAdmin, organizations, currentUser, updateOrganization } = useAppContext();
  const { t } = useTranslations();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | undefined>(undefined);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | undefined>(undefined);

  const [isEditingOrgName, setIsEditingOrgName] = useState(false);
  const organization = useMemo(() => organizations.find(o => o.id === currentUser?.organizationId), [organizations, currentUser]);
  const [orgName, setOrgName] = useState(organization?.name || '');

  if (!canCurrentUserManageUsers()) {
    return (
        <div className="container mx-auto py-10 px-4 text-center">
            <ShieldExclamationIcon />
            <h1 className="text-2xl font-bold text-red-700 mt-4">{t('accessDeniedTitle')}</h1>
            <p className="text-gray-600 mt-2">{t('accessDeniedMessage')}</p>
            <Button onClick={() => window.history.back()} className="mt-6">
                Go Back
            </Button>
        </div>
    );
  }

  const openAddUserModal = () => {
    setUserToEdit(undefined);
    setIsFormModalOpen(true);
  };

  const openEditUserModal = (user: User) => {
    setUserToEdit(user);
    setIsFormModalOpen(true);
  };

  const openDeleteConfirmModal = (user: User) => {
    setUserToDelete(user);
    setIsDeleteConfirmModalOpen(true);
  };

  const handleDeleteConfirmed = () => {
    if (userToDelete) {
      deleteUser(userToDelete.id);
    }
    setIsDeleteConfirmModalOpen(false);
    setUserToDelete(undefined);
  };
  
  const handleSaveOrgName = () => {
    if (organization && orgName.trim()) {
      updateOrganization(organization.id, { name: orgName.trim() });
      setIsEditingOrgName(false);
    }
  };
  
  return (
    <div className="container mx-auto py-6 px-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">{t('userManagementTitle')}</h1>
        {isCurrentUserAdmin() && (
            <Button onClick={openAddUserModal} leftIcon={<PlusIcon />}>
            {t('addNewUser')}
            </Button>
        )}
      </div>

      {isCurrentUserAdmin() && organization && (
        <div>
            <div className="flex items-center justify-between">
                {isEditingOrgName ? (
                    <div className="flex-grow flex items-center gap-4">
                       <Input 
                         id="orgName"
                         value={orgName}
                         onChange={(e) => setOrgName(e.target.value)}
                         className="flex-grow"
                       />
                       <Button onClick={handleSaveOrgName} size="sm">{t('save')}</Button>
                       <Button onClick={() => { setIsEditingOrgName(false); setOrgName(organization.name); }} variant="ghost" size="sm">{t('cancel')}</Button>
                    </div>
                ) : (
                    <>
                        <p className="text-gray-700">
                            <span className="font-medium">{t('organizationNameLabel')}</span> {organization.name}
                        </p>
                        <Button onClick={() => setIsEditingOrgName(true)} variant="ghost" size="sm" leftIcon={<EditIcon />}>
                           {t('editTaskBtn')}
                        </Button>
                    </>
                )}
            </div>
        </div>
      )}


      <div>
      {users.length === 0 ? (
        <div className="text-center py-10">
          <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">{t('usersTableNoUsers')}</h3>
          {isCurrentUserAdmin() && <p className="mt-1 text-sm text-gray-500">{t('addNewUser') + ' ' + t('toGetStarted')}</p>}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('usersTableNameHeader')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('usersTableEmailHeader')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('usersTablePermissionsHeader')}
                </th>
                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('usersTableActionsHeader')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
                        ) : (
                          <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-secondary text-white">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="ml-4 rtl:mr-4 rtl:ml-0">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {getPermissionSummary(user.permissions, t)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 rtl:space-x-reverse">
                    {isCurrentUserAdmin() && (
                        <>
                        <Button variant="ghost" size="sm" onClick={() => openEditUserModal(user)} leftIcon={<EditIcon />}>
                            {t('editTaskBtn')}
                        </Button>
                        {user.id !== currentUser?.id && (
                          <Button variant="ghost" size="sm" onClick={() => openDeleteConfirmModal(user)} className="text-red-600 hover:bg-red-100" leftIcon={<DeleteIcon />}>
                              {t('deleteUserBtn')}
                          </Button>
                        )}
                        </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </div>


      {isCurrentUserAdmin() && (
          <Modal 
              isOpen={isFormModalOpen} 
              onClose={() => setIsFormModalOpen(false)} 
              title={userToEdit ? t('editUserModalTitle') : t('addUserModalTitle')}
              size="lg"
          >
              <UserForm 
                  onClose={() => setIsFormModalOpen(false)} 
                  userToEdit={userToEdit}
              />
          </Modal>
      )}

      {isCurrentUserAdmin() && userToDelete && (
        <Modal
          isOpen={isDeleteConfirmModalOpen}
          onClose={() => setIsDeleteConfirmModalOpen(false)}
          title={t('deleteUserConfirmationTitle')}
          size="sm"
        >
          <p className="text-sm text-gray-600 mb-4">
            {t('deleteUserConfirmationMessage', { userName: userToDelete.name })}
          </p>
          <div className="flex justify-end space-x-3 rtl:space-x-reverse">
            <Button variant="ghost" onClick={() => setIsDeleteConfirmModalOpen(false)}>{t('cancel')}</Button>
            <Button variant="danger" onClick={handleDeleteConfirmed}>{t('deleteUserBtn')}</Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UserManagementPage;
