import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import AccountManagerTable from '../pages/SuperUser/AccountManager';
import { vi } from 'vitest';
import React from 'react';

// TEST CASES OVERVIEW:
// TEST 1: AccountManagerTable > renders loading initially and then shows users
// TEST 2: AccountManagerTable > filters users based on search input
// TEST 3: AccountManagerTable > opens and closes delete confirmation dialog
// TEST 4: AccountManagerTable > calls deleteUser when confirming deletion

// Mock MUI
vi.mock('@mui/material', async () => {
  const actual = await vi.importActual('@mui/material');
  return {
    ...actual,
    CircularProgress: () => <div>Loading...</div>,
  };
});


vi.mock('../services/users', () => ({
  getAllUsers: vi.fn(),
  deleteUser: vi.fn(),
}));

import { getAllUsers, deleteUser } from '../services/users';

describe('AccountManagerTable', () => {
  const mockUsers = [
    { _id: '1', name: 'John Doe', email: 'john@example.com', accountType: 'user' },
    { _id: '2', name: 'Jane Smith', email: 'jane@example.com', accountType: 'admin' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  //test 1
  it('renders loading initially and then shows users', async () => {
    getAllUsers.mockResolvedValueOnce({ data: mockUsers });
    render(<AccountManagerTable />);

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  // test 2
  it('filters users based on search input', async () => {
    getAllUsers.mockResolvedValueOnce({ data: mockUsers });
    render(<AccountManagerTable />);

    await waitFor(() => screen.getByText('John Doe'));

    fireEvent.change(screen.getByLabelText(/search/i), {
      target: { value: 'jane' },
    });

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  // test 3
  it('opens and closes delete confirmation dialog', async () => {
    getAllUsers.mockResolvedValueOnce({ data: mockUsers });
    render(<AccountManagerTable />);

    await waitFor(() => screen.getByText('John Doe'));

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    expect(screen.getByText(/Confirm Deletion/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cancel'));

    await waitFor(() =>
      expect(screen.queryByText(/Confirm Deletion/i)).not.toBeInTheDocument()
    );
  });

  // test 4
  it('calls deleteUser when confirming deletion', async () => {
    getAllUsers.mockResolvedValueOnce({ data: mockUsers });
    deleteUser.mockResolvedValueOnce({});

    render(<AccountManagerTable />);
    await waitFor(() => screen.getByText('John Doe'));

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);
    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(deleteUser).toHaveBeenCalledWith('1');
    });
  });
});
