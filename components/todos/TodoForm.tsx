import React, { useState, FormEvent } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useTranslations } from '../../hooks/useTranslations';

interface TodoFormProps {
  onTodoAdded?: () => void; // Optional callback
}

const TodoForm: React.FC<TodoFormProps> = ({ onTodoAdded }) => {
  const { addTodo } = useAppContext();
  const { t } = useTranslations();
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    addTodo({ text, dueDate: dueDate || undefined, completed: false });
    setText('');
    setDueDate('');
    if (onTodoAdded) onTodoAdded();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-end p-4 bg-gray-50 rounded-lg shadow">
      <Input
        label={t('newTodo')}
        id="todoText"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={t('todoPlaceholder')}
        className="flex-grow"
      />
      <Input
        label={t('dueDateOptional')}
        id="todoDueDate"
        type="date"
        value={dueDate}
        onChange={e => setDueDate(e.target.value)}
        className="w-full sm:w-auto"
      />
      <Button type="submit" size="md" className="w-full sm:w-auto">{t('addTodo')}</Button>
    </form>
  );
};

export default TodoForm;