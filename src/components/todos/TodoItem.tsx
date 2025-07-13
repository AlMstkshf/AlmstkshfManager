import React from 'react';
import { Todo } from '@/types';
import { formatDate } from '@/utils/helpers';
import Button from '@/components/ui/Button';
import { useTranslations } from '@/hooks/useTranslations';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: () => void;
  onDelete: () => void;
}

const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c1.153 0 2.24.03 3.22.077m3.22-.077L10.879 3.286a1.125 1.125 0 011.07-1.071h.078a1.125 1.125 0 011.07 1.07L15.18 5.79m-3.22-.077c1.153 0 2.24.03 3.22.077" /></svg>;

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleComplete, onDelete }) => {
  const { t } = useTranslations();
  return (
    <div className={`flex items-center justify-between p-3 bg-white rounded-md shadow transition-colors hover:bg-gray-50 ${todo.completed ? 'bg-gray-100' : 'bg-white'}`}>
      <div className="flex items-center space-x-3 rtl:space-x-reverse">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={onToggleComplete}
          className="h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary focus:ring-offset-1"
          aria-labelledby={`todo-text-${todo.id}`}
        />
        <span id={`todo-text-${todo.id}`} className={`text-sm ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
          {todo.text}
        </span>
      </div>
      <div className="flex items-center space-x-3 rtl:space-x-reverse">
        {todo.dueDate && (
          <span className={`text-xs ${todo.completed ? 'text-gray-400' : 'text-gray-500'}`}>
            {t('due')}: {formatDate(todo.dueDate) || t('notAvailableShort')}
          </span>
        )}
        <Button onClick={onDelete} variant="ghost" size="sm" className="p-1.5 text-red-500 hover:bg-red-100" aria-label={t('delete')} title={t('delete')}>
            <DeleteIcon />
        </Button>
      </div>
    </div>
  );
};

export default TodoItem;
