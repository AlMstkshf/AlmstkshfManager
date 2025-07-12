import React from 'react';
import React from 'react';
import { render, screen, renderHook, act } from '@testing-library/react';
import { AppProvider, useAppContext } from '../../src/contexts/AppContext';
import * as firebaseFirestore from 'firebase/firestore';

// Mock Firebase functions
jest.mock('firebase/firestore', () => ({
  ...jest.requireActual('firebase/firestore'),
  addDoc: jest.fn(),
  collection: jest.fn(),
  serverTimestamp: jest.fn(),
}));

describe('AppContext', () => {
  it('logActivity should call addDoc with correct parameters', async () => {
    const wrapper = ({ children }) => <AppProvider>{children}</AppProvider>;
    const { result } = renderHook(() => useAppContext(), { wrapper });

    await act(async () => {
      await result.current.logActivity('test_action', { targetName: 'Test Target' });
    });

    expect(firebaseFirestore.addDoc).toHaveBeenCalled();
    expect(firebaseFirestore.collection).toHaveBeenCalledWith(expect.anything(), 'logs');
    const loggableObject = (firebaseFirestore.addDoc as jest.Mock).mock.calls[0][1];
    expect(loggableObject.action).toBe('test_action');
    expect(loggableObject.targetName).toBe('Test Target');
    expect(loggableObject.timestamp).toBeDefined();
  });

    it('renders children without crashing', () => {
    render(
      <AppProvider>
        <div>Test Child</div>
      </AppProvider>
    );
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });
});