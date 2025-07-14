
import React, { useState, useEffect, FormEvent } from 'react';
import { Project } from '@/types';
import { useAppContext } from '@/contexts/AppContext';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { PROJECT_COLORS } from '@/constants';
import { useTranslations } from '@/hooks/useTranslations';

interface ProjectFormProps {
  onClose: () => void;
  projectToEdit?: Project | Omit<Project, 'id' | 'ownerId' | 'color'> & { id?: string; ownerId?: string; color?: string };
}

const CheckIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const ProjectForm: React.FC<ProjectFormProps> = ({ onClose, projectToEdit }) => {
  const { addProject, updateProject, currentUser } = useAppContext();
  const { t } = useTranslations();
  
  const isEditing = projectToEdit && 'id' in projectToEdit && !!projectToEdit.id;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState<number | string>('');
  const [color, setColor] = useState(PROJECT_COLORS[0].value);

  useEffect(() => {
    if (projectToEdit) {
      setName(projectToEdit.name || '');
      setDescription(projectToEdit.description || '');
      // @ts-ignore
      setStartDate(projectToEdit.startDate || new Date().toISOString().split('T')[0]);
      // @ts-ignore
      setEndDate(projectToEdit.endDate || '');
      setBudget(projectToEdit.budget || '');
      setColor(projectToGedit.color || PROJECT_COLORS[0].value);
    } else {
      setName('');
      setDescription('');
      setStartDate(new Date().toISOString().split('T')[0]);
      setEndDate('');
      setBudget('');
      setColor(PROJECT_COLORS[0].value);
    }
  }, [projectToEdit]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const projectDataPayload = {
      name,
      description,
      startDate,
      endDate: endDate || undefined,
      budget: budget ? Number(budget) : undefined,
      color,
    };

    if (isEditing && projectToEdit && 'id' in projectToEdit) {
      updateProject({ ...(projectToEdit as Project), ...projectDataPayload });
    } else {
      addProject(projectDataPayload as Omit<Project, 'id' | 'organizationId' | 'ownerId'>);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label={t('projectName')} id="projectName" value={name} onChange={e => setName(e.target.value)} required />
      <Textarea label={t('projectDescription')} id="projectDescription" value={description} onChange={e => setDescription(e.target.value)} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label={t('startDate')} id="projectStartDate" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
        <Input label={t('endDateOptional')} id="projectEndDate" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
      </div>
      <Input label={t('budgetOptional')} id="projectBudget" type="number" value={budget} onChange={e => setBudget(e.target.value)} placeholder="e.g., 5000" />
      <div>
        <label htmlFor="projectColor" className="block text-sm font-medium text-gray-700 mb-1">{t('projectColor')}</label>
        <div className="flex flex-wrap gap-2">
          {PROJECT_COLORS.map(c => (
            <button
              key={c.value}
              type="button"
              onClick={() => setColor(c.value)}
              className={`w-9 h-9 rounded-full ${c.twClass} flex items-center justify-center transition-all duration-150
                          ${color === c.value ? 'ring-2 ring-offset-2 ring-primary p-0.5' : 'hover:opacity-80'}`}
              title={c.name}
              aria-pressed={color === c.value}
            >
              {color === c.value && <CheckIcon className="w-5 h-5 text-white" />}
            </button>
          ))}
        </div>
        <input type="hidden" id="projectColor" value={color} />
      </div>
      <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-2">
        <Button type="button" variant="ghost" onClick={onClose}>{t('cancel')}</Button>
        <Button type="submit">{isEditing ? t('updateProjectBtn') : t('createProjectBtn')}</Button>
      </div>
    </form>
  );
};

export default ProjectForm;
