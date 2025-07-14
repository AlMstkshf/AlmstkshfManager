import React, { useState } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { useAppContext } from '@/contexts/AppContext';
import { ProjectIdea, TaskPriority } from '@/types';
import Modal from '@/components/ui/Modal';
import ProjectForm from '@/components/projects/ProjectForm';
import TaskForm from '@/components/tasks/TaskForm';
import { generateId } from '@/utils/helpers';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';

const SaveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>;
const ClipboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM10.5 16.5c0 .621.504 1.125 1.125 1.125h1.5c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-1.5c-.621 0-1.125.504-1.125-1.125V10.5" /></svg>;
const FolderPlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>;
const DocumentPlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c1.153 0 2.24.03 3.22.077m3.22-.077L10.879 3.286a1.125 1.125 0 011.07-1.071h.078a1.125 1.125 0 011.07 1.07L15.18 5.79m-3.22-.077c1.153 0 2.24.03 3.22.077" /></svg>;


const ProjectIdeasPage: React.FC = () => {
  const { t } = useTranslations();
  const {
    saveProjectIdea, removeSavedIdea, savedIdeas, isIdeaSaved,
    getActiveProjects, currentUser, addNotification, generateProjectIdeas
  } = useAppContext();

  const [topic, setTopic] = useState<string>('');
  const [generatedIdeas, setGeneratedIdeas] = useState<ProjectIdea[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'generate' | 'saved'>('generate');

  const [isProjectFormModalOpen, setIsProjectFormModalOpen] = useState(false);
  const [isTaskFormModalOpen, setIsTaskFormModalOpen] = useState(false);
  const [isSelectProjectModalOpen, setIsSelectProjectModalOpen] = useState(false);

  const [ideaForProject, setIdeaForProject] = useState<ProjectIdea | null>(null);
  const [ideaForTask, setIdeaForTask] = useState<ProjectIdea | null>(null);
  const [selectedProjectIdForTask, setSelectedProjectIdForTask] = useState<string>('');
  const [copiedIdeaId, setCopiedIdeaId] = useState<string | null>(null);

  const handleGenerateIdeas = async () => {
    if (!topic.trim()) {
      setError(t('projectIdeaGeneratorInputLabel'));
      return;
    }
    if (!currentUser?.organizationId) {
        setError("User organization not found. Cannot generate ideas.");
        return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedIdeas([]);

    try {
      const ideas = await generateProjectIdeas(topic);
      if (Array.isArray(ideas) && ideas.every(item => item.name && item.description && Array.isArray(item.features))) {
        setGeneratedIdeas(ideas.map(idea => ({ ...idea, id: generateId(), organizationId: currentUser.organizationId })));
        if (ideas.length === 0) {
          setError(t('projectIdeaGeneratorNoIdeas'));
        }
      } else {
        setError(t('projectIdeaGeneratorError') + '(Invalid format from API)');
      }
    } catch (err) {
      console.error("Error generating ideas:", err);
      setError(t('projectIdeaGeneratorError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveIdea = (idea: ProjectIdea) => {
    saveProjectIdea(idea);
  };

  const handleRemoveSavedIdea = (ideaId: string) => {
    const idea = savedIdeas.find(i => i.id === ideaId);
    if (idea && window.confirm(t('confirmRemoveSavedIdea', { ideaName: idea.name }))) {
        removeSavedIdea(ideaId);
    }
  };

  const handleCopyIdea = (idea: ProjectIdea) => {
    const featuresString = idea.features.map(f => `- ${f}`).join('\n');
    const ideaText = `${t('ideaName')}: ${idea.name}\n${t('ideaDescription')}: ${idea.description}\n${t('ideaFeatures')}:\n${featuresString}`;
    navigator.clipboard.writeText(ideaText).then(() => {
      if ('id' in idea) setCopiedIdeaId(idea.id!);
      addNotification({messageKey: 'notificationIdeaCopied', messageParams: {ideaName: idea.name}, type: 'info'});
      setTimeout(() => setCopiedIdeaId(null), 2000);
    }).catch(err => console.error('Failed to copy idea:', err));
  };

  const handleCreateProjectFromIdea = (idea: ProjectIdea) => {
    setIdeaForProject(idea);
    setIsProjectFormModalOpen(true);
  };

  const handleAddIdeaAsTask = (idea: ProjectIdea) => {
    setIdeaForTask(idea);
    setIsSelectProjectModalOpen(true);
  };

  const handleProjectSelectedForTask = (projectId: string) => {
    if (!projectId) return;
    setSelectedProjectIdForTask(projectId);
    setIsSelectProjectModalOpen(false);
    setIsTaskFormModalOpen(true);
  };
  
  const userActiveProjects = getActiveProjects();

  const renderIdeaCard = (idea: ProjectIdea, isSavedContext: boolean) => (
    <div key={idea.id} className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-secondary hover:shadow-xl transition-shadow duration-200">
      <h2 className="text-xl font-semibold text-secondary mb-2">{idea.name}</h2>
      <p className="text-gray-700 mb-3 text-sm whitespace-pre-line">{idea.description}</p>
      {idea.features && idea.features.length > 0 && (
        <div className="mb-3">
          <h3 className="text-md font-medium text-gray-800 mb-1">{t('ideaFeatures')}</h3>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 pl-4 rtl:pr-4 rtl:pl-0">
            {idea.features.map((feature, fIndex) => (
              <li key={fIndex}>{feature}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
        {!isSavedContext && !isIdeaSaved(idea.id!) && (
          <Button onClick={() => handleSaveIdea(idea)} variant="outline" size="sm" leftIcon={<SaveIcon />}>
            {t('ideaSaveButton')}
          </Button>
        )}
         {isSavedContext && (
          <Button onClick={() => handleRemoveSavedIdea(idea.id!)} variant="danger" size="sm" leftIcon={<TrashIcon />}>
            {t('removeSavedIdeaButton')}
          </Button>
        )}
        <Button onClick={() => handleCopyIdea(idea)} variant="ghost" size="sm" leftIcon={<ClipboardIcon />}>
          {copiedIdeaId === idea.id ? t('ideaCopiedToClipboard') : t('ideaCopyButton')}
        </Button>
        <Button onClick={() => handleCreateProjectFromIdea(idea)} variant="outline" size="sm" leftIcon={<FolderPlusIcon />}>
          {t('ideaCreateProjectButton')}
        </Button>
        <Button onClick={() => handleAddIdeaAsTask(idea)} variant="outline" size="sm" leftIcon={<DocumentPlusIcon />}>
          {t('ideaAddTaskButton')}
        </Button>
      </div>
    </div>
  );

  const tabCommonClass = "px-4 py-2 font-medium text-sm rounded-t-md cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary";
  const tabActiveClass = "bg-white text-primary border-b-2 border-primary shadow-sm";
  const tabInactiveClass = "text-gray-500 hover:text-primary hover:bg-gray-100";

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold text-primary mb-6">{t('projectIdeas')}</h1>

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-4 rtl:space-x-reverse" aria-label="Tabs">
          <button
            role="tab"
            aria-selected={activeTab === 'generate'}
            onClick={() => setActiveTab('generate')}
            className={`${tabCommonClass} ${activeTab === 'generate' ? tabActiveClass : tabInactiveClass}`}
          >
            {t('projectIdeaGeneratorTitle')}
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'saved'}
            onClick={() => setActiveTab('saved')}
            className={`${tabCommonClass} ${activeTab === 'saved' ? tabActiveClass : tabInactiveClass}`}
          >
            {t('savedIdeasSectionTitle')} ({savedIdeas.length})
          </button>
        </nav>
      </div>

      {activeTab === 'generate' && (
        <div role="tabpanel" aria-labelledby="generate-tab">
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <Textarea
              id="ideaTopic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={t('projectIdeaGeneratorInputPlaceholder')}
              rows={4}
              className="mb-4"
              aria-describedby="topic-error"
            />
            {error && !isLoading && generatedIdeas.length === 0 && <p id="topic-error" className="text-red-600 text-sm mb-4">{error}</p>}
            <Button onClick={handleGenerateIdeas} isLoading={isLoading} disabled={isLoading || !currentUser} aria-live="polite">
              {isLoading ? t('projectIdeaGeneratorLoading') : t('projectIdeaGeneratorButton')}
            </Button>
          </div>

          {isLoading && (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" role="status" aria-label={t('projectIdeaGeneratorLoading')}></div>
              <p className="mt-2 text-gray-600">{t('projectIdeaGeneratorLoading')}</p>
            </div>
          )}
          {!isLoading && error && generatedIdeas.length === 0 && (
            <div role="alert" className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <strong className="font-bold">{t('error')}</strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {!isLoading && !error && generatedIdeas.length === 0 && topic && (
            <p className="text-gray-600 text-center py-10">{t('projectIdeaGeneratorNoIdeas')}</p>
          )}
          {!isLoading && generatedIdeas.length > 0 && (
            <div className="space-y-6">
              {generatedIdeas.map(idea => renderIdeaCard(idea, false))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'saved' && (
        <div role="tabpanel" aria-labelledby="saved-tab" className="space-y-6">
          {savedIdeas.length === 0 ? (
            <p className="text-gray-600 text-center py-10 bg-white rounded-lg shadow">{t('noSavedIdeasMessage')}</p>
          ) : (
            savedIdeas.map(idea => renderIdeaCard(idea, true))
          )}
        </div>
      )}

      {ideaForProject && currentUser && (
        <Modal isOpen={isProjectFormModalOpen} onClose={() => setIsProjectFormModalOpen(false)} title={t('createProject')}>
          <ProjectForm
            onClose={() => {
              setIsProjectFormModalOpen(false);
              setIdeaForProject(null);
            }}
            projectToEdit={{
                name: ideaForProject.name,
                description: ideaForProject.description,
                startDate: new Date().toISOString().split('T')[0],
                organizationId: currentUser.organizationId,
            }}
          />
        </Modal>
      )}

      {ideaForTask && currentUser && (
        <Modal
            isOpen={isSelectProjectModalOpen}
            onClose={() => {
              setIsSelectProjectModalOpen(false);
              setIdeaForTask(null);
            }}
            title={t('selectProjectForTaskModalTitle')}
        >
            {userActiveProjects.length > 0 ? (
                <>
                <Select onValueChange={setSelectedProjectIdForTask} value={selectedProjectIdForTask}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('selectProjectLabel')} />
                  </SelectTrigger>
                  <SelectContent>
                    {userActiveProjects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <div className="flex justify-end space-x-2 rtl:space-x-reverse mt-4">
                    <Button variant="ghost" onClick={() => {
                        setIsSelectProjectModalOpen(false);
                        setIdeaForTask(null);
                    }}>{t('cancel')}</Button>
                    <Button 
                        onClick={() => handleProjectSelectedForTask(selectedProjectIdForTask)} 
                        disabled={!selectedProjectIdForTask}
                    >
                        {t('addIdeaAsTaskButton')}
                    </Button>
                </div>
                </>
            ) : (
                <>
                <p className="text-center text-gray-600 py-4">{t('noActiveProjectsToAddTaskTo')}</p>
                <div className="flex justify-end mt-4">
                    <Button variant="ghost" onClick={() => {
                        setIsSelectProjectModalOpen(false);
                        setIdeaForTask(null);
                    }}>{t('cancel')}</Button>
                </div>
                </>
            )}
        </Modal>
      )}

      {ideaForTask && selectedProjectIdForTask && currentUser && (
         <Modal
            isOpen={isTaskFormModalOpen}
            onClose={() => {
                setIsTaskFormModalOpen(false);
                setIdeaForTask(null);
                setSelectedProjectIdForTask('');
            }}
            title={t('addTask')}
        >
          <TaskForm
            onClose={() => {
              setIsTaskFormModalOpen(false);
              setIdeaForTask(null);
              setSelectedProjectIdForTask('');
            }}
            projectId={selectedProjectIdForTask}
            initialTaskData={{
                name: ideaForTask.name,
                description: `${t('ideaDescription')}: ${ideaForTask.description}\n\n${t('ideaFeatures')}:\n- ${ideaForTask.features.join('\n- ')}`,
                priority: TaskPriority.Medium
            }}
        />
        </Modal>
      )}

    </div>
  );
};

export default ProjectIdeasPage;