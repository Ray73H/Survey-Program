import { render, screen, fireEvent } from '@testing-library/react';
import RecentActivityFeed from '../components/RecentActivityFeed';
import React from 'react';

describe('RecentActivityFeed', () => {
  const mockActivities = Array.from({ length: 8 }, (_, i) => ({
    _id: `${i + 1}`,
    title: `Survey ${i + 1}`,
    author: `Author ${i + 1}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  // test 1
  it('shows "No recent activity found" when activity list is empty', () => {
    render(<RecentActivityFeed activities={[]} />);
    expect(screen.getByText(/no recent activity found/i)).toBeInTheDocument();
  });

  // test 5
  it('shows 5 items initially and all on "Show More"', () => {
    render(<RecentActivityFeed activities={mockActivities} />);
    expect(screen.getAllByText(/was/i)).toHaveLength(5);
    fireEvent.click(screen.getByRole('button', { name: /show more/i }));
    expect(screen.getAllByText(/was/i)).toHaveLength(8);
  });
});
