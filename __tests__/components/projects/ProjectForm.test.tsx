import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../test-utils';
import { useAppContext } from '@/contexts/AppContext';
import ProjectForm from '@/components/projects/ProjectForm';
import { Project } from '@/types';
import { PROJECT_COLORS } from '@/constants';

// Mock the useAppContext hook
jest.mock('@/contexts/AppContext', () => ({
  useAppContext: jest.fn(),
}));

// Mock the useTranslations hook
jest.mock('@/hooks/useTranslations', () => ({
  useTranslations: () => ({
    t: (key: string) => key, // Return the key as the translation
  }),
}));

const mockUseAppContext = useAppContext as jest.MockedFunction<typeof useAppContext>;

describe('ProjectForm', () => {
  const mockOnClose = jest.fn();
  const mockAddProject = jest.fn();
  const mockUpdateProject = jest.fn();
  const mockCurrentUser = { id: 'user1', name: 'Test User' };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAppContext.mockReturnValue({
      addProject: mockAddProject,
      updateProject: mockUpdateProject,
      currentUser: mockCurrentUser,
    } as any);
  });

  test('renders the form for creating a new project', () => {
    render(<ProjectForm onClose={mockOnClose} />);

    // Check if form elements are rendered
    expect(screen.getByLabelText(/projectNameLabel/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/projectDescriptionLabel/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/projectStartDateLabel/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/projectEndDateLabel/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/projectBudgetLabel/i)).toBeInTheDocument();
    
    // Check if buttons are rendered
    expect(screen.getByText(/cancelButton/i)).toBeInTheDocument();
    expect(screen.getByText(/createProjectButton/i)).toBeInTheDocument();
  });

  test('renders the form with project data for editing', () => {
    const projectToEdit: Project = {
      id: 'project1',
      name: 'Test Project',
      description: 'Test Description',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      budget: 10000,
      ownerId: 'user1',
      color: PROJECT_COLORS[0].value,
      isArchived: false,
      createdAt: new Date().toISOString(),
    };

    render(<ProjectForm onClose={mockOnClose} projectToEdit={projectToEdit} />);

    // Check if form elements are filled with project data
    expect(screen.getByLabelText(/projectNameLabel/i)).toHaveValue('Test Project');
    expect(screen.getByLabelText(/projectDescriptionLabel/i)).toHaveValue('Test Description');
    expect(screen.getByLabelText(/projectStartDateLabel/i)).toHaveValue('2023-01-01');
    expect(screen.getByLabelText(/projectEndDateLabel/i)).toHaveValue('2023-12-31');
    expect(screen.getByLabelText(/projectBudgetLabel/i)).toHaveValue('10000');
    
    // Check if the update button is rendered instead of create
    expect(screen.getByText(/updateProjectButton/i)).toBeInTheDocument();
  });

  test('calls addProject when form is submitted for a new project', async () => {
    render(<ProjectForm onClose={mockOnClose} />);

    // Fill the form
    fireEvent.change(screen.getByLabelText(/projectNameLabel/i), { target: { value: 'New Project' } });
    fireEvent.change(screen.getByLabelText(/projectDescriptionLabel/i), { target: { value: 'New Description' } });
    fireEvent.change(screen.getByLabelText(/projectStartDateLabel/i), { target: { value: '2023-01-01' } });
    fireEvent.change(screen.getByLabelText(/projectEndDateLabel/i), { target: { value: '2023-12-31' } });
    fireEvent.change(screen.getByLabelText(/projectBudgetLabel/i), { target: { value: '5000' } });

    // Submit the form
    fireEvent.click(screen.getByText(/createProjectButton/i));

    // Check if addProject was called with the correct data
    await waitFor(() => {
      expect(mockAddProject).toHaveBeenCalledWith({
        name: 'New Project',
        description: 'New Description',
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        budget: 5000,
        color: PROJECT_COLORS[0].value,
      });
    });

    // Check if onClose was called
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('calls updateProject when form is submitted for an existing project', async () => {
    const projectToEdit: Project = {
      id: 'project1',
      name: 'Test Project',
      description: 'Test Description',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      budget: 10000,
      ownerId: 'user1',
      color: PROJECT_COLORS[0].value,
      isArchived: false,
      createdAt: new Date().toISOString(),
    };

    render(<ProjectForm onClose={mockOnClose} projectToEdit={projectToEdit} />);

    // Change some fields
    fireEvent.change(screen.getByLabelText(/projectNameLabel/i), { target: { value: 'Updated Project' } });
    fireEvent.change(screen.getByLabelText(/projectBudgetLabel/i), { target: { value: '15000' } });

    // Submit the form
    fireEvent.click(screen.getByText(/updateProjectButton/i));

    // Check if updateProject was called with the correct data
    await waitFor(() => {
      expect(mockUpdateProject).toHaveBeenCalledWith('project1', {
        name: 'Updated Project',
        description: 'Test Description',
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        budget: 15000,
        color: PROJECT_COLORS[0].value,
      });
    });

    // Check if onClose was called
    expect(mockOnClose).toHaveBeenCalled();
  });
});
