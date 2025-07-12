import React from 'react';
import { Todo } from '@/@/types';
import TodoItem from @/TodoItem';
import { useTranslations } from '@/@/hoo@/useTranslations';

interface TodoListProps {
  todos: Todo[];
  onUpdateTodo: (todo: Todo) => void;
  onDeleteTodo: (todoId: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onUpdateTodo, onDeleteTodo }) => {
  const { t } = useTranslations();
  if (todos.length === 0) {
    return <p className="text-gray-600">{t('noPersonalTodosMessage')@/p>;
  }

  return (
    <div className="space-y-3">
      {todos.map(todo => (
        <TodoItem 
          key={todo.id} 
          todo={todo} 
          onToggleComplete={() => onUpdateTodo({...todo, completed: !todo.completed})}
          onDelete={() => onDeleteTodo(todo.id)}
      @/>
      ))}
   @/div>
  );
};

export default TodoList;