import React from 'react';
import { render, screen } from '../../test-utils';
import { useAppContext } from '@/contexts/AppContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// Mock the useAppContext hook
jest.mock('@/contexts/AppContext', () => ({
  useAppContext: jest.fn(),
}));

const mockUseAppContext = useAppContext as jest.MockedFunction<typeof useAppContext>;

describe('ProtectedRoute', () => {
  const TestComponent = () => <div>Protected Content</div>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('redirects to login when user is not authenticated', () => {
    // Mock the context with no current user
    mockUseAppContext.mockReturnValue({
      currentUser: null,
    } as any);

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/protected" element={<ProtectedRoute />}>
            <Route index element={<TestComponent />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // Should redirect to login page
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  test('renders child routes when user is authenticated', () => {
    // Mock the context with a current user
    mockUseAppContext.mockReturnValue({
      currentUser: { id: '1', name: 'Test User' },
    } as any);

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/protected" element={<ProtectedRoute />}>
            <Route index element={<TestComponent />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // Should render the protected content
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });
});
