import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { TaskComment, User, TaskCommentSentiment } from '../../types';
import { useTranslations } from '../../hooks/useTranslations';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { LocaleKey } from '../../locales';

interface TaskCommentsProps {
  taskId: string;
  projectId: string; 
  onClose: () => void;
}

const UserAvatar: React.FC<{ user?: User }> = ({ user }) => {
  if (!user) return <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-sm font-semibold text-white">?</div>;
  return (
    <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center text-sm font-semibold" title={user.name}>
      {user.name?.charAt(0).toUpperCase()}
    </div>
  );
};

const SentimentIcon: React.FC<{ sentiment?: TaskCommentSentiment, isUrgent?: boolean }> = ({ sentiment, isUrgent }) => {
  const { t } = useTranslations();
  let iconJsx;
  let titleKey: LocaleKey = 'sentimentUnknown';
  let colorClass = "text-gray-500";

  switch (sentiment) {
    case TaskCommentSentiment.Positive:
      iconJsx = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 9.75h.008v.008H9V9.75zm.75 3a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm2.25.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-3a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm-3.75 0h.008v.008H12V9.75z" /></svg>;
      titleKey = 'sentimentPositive';
      colorClass = "text-green-500";
      break;
    case TaskCommentSentiment.Negative:
      iconJsx = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.492a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75s.168-.75.375-.75S9.75 9.336 9.75 9.75zm4.5 0c0 .414-.168.75-.375.75S13.5 10.164 13.5 9.75s.168-.75.375-.75S14.25 9.336 14.25 9.75z" /></svg>;
      titleKey = 'sentimentNegative';
      colorClass = "text-red-500";
      break;
    case TaskCommentSentiment.Neutral:
      iconJsx = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" /></svg>;
      titleKey = 'sentimentNeutral';
      colorClass = "text-gray-600";
      break;
    default: // Unknown
      iconJsx = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>;
      titleKey = 'sentimentUnknown';
      colorClass = "text-yellow-500";
  }
  
  const UrgentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-red-600 ml-1 rtl:ml-0 rtl:mr-1"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>;


  return (
    <span className={`inline-flex items-center ${colorClass}`} title={t(titleKey)}>
      {iconJsx}
      {isUrgent && <UrgentIcon />}
    </span>
  );
};


const TaskComments: React.FC<TaskCommentsProps> = ({ taskId, projectId, onClose }) => {
  const { t } = useTranslations();
  const { getCommentsByTaskId, addTaskComment, users, currentUser } = useAppContext();
  const [newCommentText, setNewCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const comments = getCommentsByTaskId(taskId);

  const handleSubmitComment = async () => {
    if (!newCommentText.trim() || !currentUser) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await addTaskComment(taskId, projectId, newCommentText);
      setNewCommentText('');
    } catch (err) {
      console.error("Error adding comment from UI:", err);
      setError(t('errorAddingComment'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4">
      <h4 className="text-lg font-semibold text-gray-700 mb-3">{t('taskCommentsTitle')}</h4>
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2 rtl:pr-0 rtl:pl-2 mb-4">
        {comments.length === 0 && <p className="text-gray-500 text-sm">{t('noCommentsYet')}</p>}
        {comments.map(comment => {
          const author = users.find(u => u.id === comment.userId);
          const isAnalyzing = comment.sentiment === TaskCommentSentiment.Unknown && !comment.isUrgent && comment.id === comments[comments.length -1].id; // Basic check if it's the latest and still unknown

          return (
            <div key={comment.id} className={`p-3 rounded-md shadow-sm flex space-x-3 rtl:space-x-reverse items-start ${comment.isUrgent ? 'bg-red-50 border-l-2 border-red-400' : 'bg-gray-50'}`}>
              <UserAvatar user={author} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-800">{author?.name || t('unknownUser')}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(comment.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mt-0.5 whitespace-pre-wrap">{comment.text}</p>
                <div className="mt-1 text-xs flex items-center">
                    <SentimentIcon sentiment={comment.sentiment} isUrgent={comment.isUrgent} />
                    {isAnalyzing && <span className="ml-2 rtl:mr-2 rtl:ml-0 text-yellow-600 animate-pulse">{t('loadingSentiment')}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-4 border-t">
        <Textarea
          id={`newComment-${taskId}`}
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          placeholder={t('addCommentPlaceholder')}
          rows={3}
          className="mb-2"
          disabled={isSubmitting}
          aria-label={t('addCommentPlaceholder')}
        />
        {error && <p className="text-red-600 text-xs mb-2">{error}</p>}
        <div className="flex justify-end space-x-2 rtl:space-x-reverse">
            <Button onClick={onClose} variant="ghost" disabled={isSubmitting}>{t('cancel')}</Button>
            <Button 
                onClick={handleSubmitComment} 
                isLoading={isSubmitting} 
                disabled={isSubmitting || !newCommentText.trim()}
            >
            {isSubmitting ? t('loadingComment') : t('addCommentBtn')}
            </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskComments;