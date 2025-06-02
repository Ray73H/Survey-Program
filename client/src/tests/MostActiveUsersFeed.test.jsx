import { render, screen, fireEvent } from '@testing-library/react';
import MostActiveUsersFeed from '../components/MostActiveUsersFeed';
import React from 'react';

describe('MostActiveUsersFeed', () => {
  const mockUsers = [
    { _id: 'u1', name: 'Alice', accountType: 'experimenter' },
    { _id: 'u2', name: 'Bob', accountType: 'experimentee' },
    { _id: 'u3', name: 'Charlie', accountType: 'experimenter' },
  ];

  const mockSurveys = [
    { _id: 's1', userId: 'u1' },
    { _id: 's2', userId: 'u1' },
    { _id: 's3', userId: 'u3' },
  ];

  const mockResponseStats = {
    u1: 5,
    u3: 2,
  };

  it('renders only experimenters', () => {
    render(<MostActiveUsersFeed surveys={mockSurveys} users={mockUsers} responseStats={mockResponseStats} />);
    expect(screen.getByText(/Alice created/i)).toBeInTheDocument();
    expect(screen.getByText(/Charlie created/i)).toBeInTheDocument();
    expect(screen.queryByText(/Bob created/i)).not.toBeInTheDocument();
  });

  it('expands to show more than 5 users', () => {
    const manyUsers = Array.from({ length: 8 }, (_, i) => ({
      _id: `u${i + 1}`,
      name: `User${i + 1}`,
      accountType: 'experimenter',
    }));
    const manySurveys = Array.from({ length: 8 }, (_, i) => ({
      _id: `s${i + 1}`,
      userId: `u${i + 1}`,
    }));

    render(<MostActiveUsersFeed surveys={manySurveys} users={manyUsers} responseStats={{}} />);

    expect(screen.getAllByText(/created/i)).toHaveLength(5);
    fireEvent.click(screen.getByRole('button', { name: /show more/i }));
    expect(screen.getAllByText(/created/i)).toHaveLength(8);
  });
});
