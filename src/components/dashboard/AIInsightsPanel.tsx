
import React from 'react';
import { Link } from 'react-router-dom';
import { ProjectInsightItem, ProjectInsightType, User, Project, Task } from '../../types';
import { useTranslations } from '../../hooks/useTranslations';
import { useAppContext } from '../../contexts/AppContext';

interface AIInsightsPanelProps {
  insights: ProjectInsightItem[];
  isLoading: boolean;
  error: string | null;
}

const InsightIcon: React.FC<{ type: ProjectInsightType }> = ({ type }) => {
  let icon;
  switch (type) {
    case 'bottleneck':
      icon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="M11.412 15.655L9.75 21.75l3.745-4.012M9.255 9.75H4.875c-.621 0-1.125.504-1.125 1.125v3.026c0 .621.504 1.125 1.125 1.125h4.38c.499 0 .937-.293 1.094-.73l.238-.638c.12-.32.037-.696-.21-.94L9.255 9.75z" /><path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l7.693-7.693a4.5 4.5 0 016.364 6.364l6.364-6.364m-6.364 6.364l6.364-6.364" /></svg>;
      break;
    case 'performance_high':
      icon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-500"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.744-1.257m-2.744 1.257l-2.744-1.257m2.744 1.257v6.25m0 0H9.5" /></svg>;
      break;
    case 'performance_low':
      icon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-yellow-500"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.511l-3.182-5.511M12 6h2.25M12 6V3.75M12 6v7.5m0-7.5A2.25 2.25 0 009.75 3.75H7.5A2.25 2.25 0 005.25 6v7.5m7.5-7.5h2.25M15 6V3.75M15 6v7.5m0-7.5A2.25 2.25 0 0117.25 3.75H19.5A2.25 2.25 0 0121.75 6v7.5" /></svg>;
      break;
    case 'trend':
      icon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.744-1.257m0 0l-2.744 1.257m2.744-1.257L15 3.75M21.75 17.25l-6.25-6.25" /></svg>;
      break;
    case 'resource_concern':
      icon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-orange-500"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>;
      break;
    case 'positive_highlight':
      icon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-teal-500"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.745 3.745 0 013.296-1.043A3.745 3.745 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>;
      break;
    default:
      icon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>;
  }
  return <div className="flex-shrink-0 mr-3 rtl:mr-0 rtl:ml-3">{icon}</div>;
};


const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ insights, isLoading, error }) => {
  const { t } = useTranslations();
  const { getProjectById, getUserById, tasks: allTasks } = useAppContext();

  const getInsightTypeName = (type: ProjectInsightType): string => {
    const typeMap: Record<ProjectInsightType, string> = {
      bottleneck: t('insightTypeBottleneck'),
      performance_high: t('insightTypePerformanceHigh'),
      performance_low: t('insightTypePerformanceLow'),
      trend: t('insightTypeTrend'),
      resource_concern: t('insightTypeResourceConcern'),
      positive_highlight: t('insightTypePositiveHighlight'),
    };
    return typeMap[type] || type;
  };

  if (isLoading) {
    return (
      <div className="text-center py-10 my-6 bg-white rounded-lg shadow">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-3 text-gray-600">{t('generatingInsightsLoading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="my-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">{t('error')} </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div className="my-6 p-6 bg-blue-50 border border-blue-200 rounded-lg shadow-sm text-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-blue-400 mx-auto mb-3"><path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.11v1.093c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.93l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527a1.125 1.125 0 01-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.11v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.93l.15-.894z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        <p className="text-blue-600 font-medium">{t('insightsGenerationNoInsights')}</p>
      </div>
    );
  }

  return (
    <div className="my-8 p-6 bg-white rounded-lg shadow-lg border-t-4 border-purple-500">
      <h2 className="text-2xl font-semibold text-purple-700 mb-6">{t('aiInsightsPanelTitle')}</h2>
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:shadow-md transition-shadow">
            <div className="flex items-start">
              <InsightIcon type={insight.type} />
              <div>
                <h3 className="text-md font-semibold text-gray-700">{getInsightTypeName(insight.type)}</h3>
                <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
              </div>
            </div>
            {(insight.relatedProjectIds?.length || insight.relatedTaskIds?.length || insight.relatedUserIds?.length) && (
              <div className="mt-3 pt-2 border-t border-gray-100 text-xs space-y-1">
                {insight.relatedProjectIds && insight.relatedProjectIds.length > 0 && (
                  <div>
                    <span className="font-medium">{t('relatedProjects')}:</span>{' '}
                    {insight.relatedProjectIds.map((id, idx) => {
                      const project = getProjectById(id);
                      return project ? (
                        <Link key={id} to={`/project/${id}`} className="text-primary hover:underline">
                          {project.name}{idx < insight.relatedProjectIds!.length - 1 ? ', ' : ''}
                        </Link>
                      ) : <span key={id}>{id}{idx < insight.relatedProjectIds!.length - 1 ? ', ' : ''}</span>;
                    })}
                  </div>
                )}
                {insight.relatedTaskIds && insight.relatedTaskIds.length > 0 && (
                   <div>
                    <span className="font-medium">{t('relatedTasks')}:</span>{' '}
                    {insight.relatedTaskIds.map((id, idx) => {
                        const task = allTasks.find(t => t.id === id);
                        return task ? (
                             <Link key={id} to={`/project/${task.projectId}`} className="text-primary hover:underline" title={`${t('viewTaskLink')} in project ${getProjectById(task.projectId)?.name || ''}`}>
                                {task.name}{idx < insight.relatedTaskIds!.length - 1 ? ', ' : ''}
                            </Link>
                        ) : <span key={id}>{id}{idx < insight.relatedTaskIds!.length - 1 ? ', ' : ''}</span>;
                    })}
                  </div>
                )}
                {insight.relatedUserIds && insight.relatedUserIds.length > 0 && (
                  <div>
                    <span className="font-medium">{t('relatedUsers')}:</span>{' '}
                    {insight.relatedUserIds.map((id, idx) => {
                      const user = getUserById(id);
                      return user ? (
                        // Link to user management if a user profile page existed, for now just name
                        <span key={id} className="text-secondary">
                          {user.name}{idx < insight.relatedUserIds!.length - 1 ? ', ' : ''}
                        </span>
                      ) : <span key={id}>{id}{idx < insight.relatedUserIds!.length - 1 ? ', ' : ''}</span>;
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIInsightsPanel;
