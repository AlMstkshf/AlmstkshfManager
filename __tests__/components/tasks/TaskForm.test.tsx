import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../test-utils';
import { useAppContext } from '../../../contexts/AppContext';
import TaskForm from '../../../components/tasks/TaskForm';
import { Task, TaskPriority, TaskStatus } from '../../../types';

// Mock the useAppContext hook
jest.mock('../../../contexts/AppContext', () => ({
  useAppContext: jest.fn(),
}));

// Mock the useTranslations hook
jest.mock('../../../hooks/useTranslations', () => ({
  useTranslations: () => ({
    t: (key: string) => key, // Return the key as the translation
  }),
}));

const mockUseAppContext = useAppContext as jest.MockedFunction<typeof useAppContext>;

describe('TaskForm', () => {
  const mockOnClose = jest.fn();
  const mockAddTask = jest.fn();
  const mockUpdateTask = jest.fn();
  const mockUsers = [
    { id: 'user1', name: 'User 1' },
    { id: 'user2', name: 'User 2' },
  ];
  const mockTasks = [
    { id: 'task1', name: 'Task 1', projectId: 'project1' },
    { id: 'task2', name: 'Task 2', projectId: 'project1' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAppContext.mockReturnValue({
      addTask: mockAddTask,
      updateTask: mockUpdateTask,
      users: mockUsers,
      tasks: mockTasks,
    } as any);
  });

  test('renders the form for creating a new task', () => {
    render(<TaskForm onClose={mockOnClose} projectId="project1" />);

    // Check if form elements are rendered
    expect(screen.getByLabelText(/taskNameLabel/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/taskDescriptionLabel/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/taskAssigneeLabel/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/taskDueDateLabel/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/taskPriorityLabel/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/taskStatusLabel/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/taskDependsOnLabel/i)).toBeInTheDocument();
    
    // Check if buttons are rendered
    expect(screen.getByText(/cancelButton/i)).toBeInTheDocument();
    expect(screen.getByText(/createTaskButton/i)).toBeInTheDocument();
  });

  test('renders the form with task data for editing', () => {
    const taskToEdit: Task = {
      id: 'task1',
      name: 'Test Task',
      description: 'Test Description',
      projectId: 'project1',
      assigneeId: 'user1',
      dueDate: '2023-12-31',
      priority: TaskPriority.High,
      status: TaskStatus.InProgress,
      dependsOnTaskId: 'task2',
      createdAt: new Date().toISOString(),
    };

    render(<TaskForm onClose={mockOnClose} projectId="project1" taskToEdit={taskToEdit} />);

    // Check if form elements are filled with task data
    expect(screen.getByLabelText(/taskNameLabel/i)).toHaveValue('Test Task');
    expect(screen.getByLabelText(/taskDescriptionLabel/i)).toHaveValue('Test Description');
    expect(screen.getByLabelText(/taskDueDateLabel/i)).toHaveValue('2023-12-31');
    
    // Check if the update button is rendered instead of create
    expect(screen.getByText(/updateTaskButton/i)).toBeInTheDocument();
  });

  test('calls addTask when form is submitted for a new task', async () => {
    render(<TaskForm onClose={mockOnClose} projectId="project1" />);

    // Fill the form
    fireEvent.change(screen.getByLabelText(/taskNameLabel/i), { target: { value: 'New Task' } });
    fireEvent.change(screen.getByLabelText(/taskDescriptionLabel/i), { target: { value: 'New Description' } });
    fireEvent.change(screen.getByLabelText(/taskDueDateLabel/i), { target: { value: '2023-12-31' } });
    
    // Select assignee
    fireEvent.change(screen.getByLabelText(/taskAssigneeLabel/i), { target: { value: 'user1' } });
    
    // Select priority
    fireEvent.change(screen.getByLabelText(/taskPriorityLabel/i), { target: { value: TaskPriority.High } });
    
    // Submit the form
    fireEvent.click(screen.getByText(/createTaskButton/i));

    // Check if addTask was called with the correct data
    await waitFor(() => {
      expect(mockAddTask).toHaveBeenCalledWith({
        name: 'New Task',
        description: 'New Description',
        projectId: 'project1',
        assigneeId: 'user1',
        dueDate: '2023-12-31',
        priority: TaskPriority.High,
        status: TaskStatus.ToDo,
        dependsOnTaskId: undefined,
      });
    });

    // Check if onClose was called
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('calls updateTask when form is submitted for an existing task', async () => {
    const taskToEdit: Task = {
      id: 'task1',
      name: 'Test Task',
      description: 'Test Description',
      projectId: 'project1',
      assigneeId: 'user1',
      dueDate: '2023-12-31',
      priority: TaskPriority.Medium,
      status: TaskStatus.ToDo,
      dependsOnTaskId: undefined,
      createdAt: new Date().toISOString(),
    };

    render(<TaskForm onClose={mockOnClose} projectId="project1" taskToEdit={taskToEdit} />);

    // Change some fields
    fireEvent.change(screen.getByLabelText(/taskNameLabel/i), { target: { value: 'Updated Task' } });
    fireEvent.change(screen.getByLabelText(/taskStatusLabel/i), { target: { value: TaskStatus.InProgress } });

    // Submit the form
    fireEvent.click(screen.getByText(/updateTaskButton/i));

    // Check if updateTask was called with the correct data
    await waitFor(() => {
      expect(mockUpdateTask).toHaveBeenCalledWith('task1', {
        name: 'Updated Task',
        description: 'Test Description',
        projectId: 'project1',
        assigneeId: 'user1',
        dueDate: '2023-12-31',
        priority: TaskPriority.Medium,
        status: TaskStatus.InProgress,
        dependsOnTaskId: undefined,
      });
    });

    // Check if onClose was called
    expect(mockOnClose).toHaveBeenCalled();
  });
});