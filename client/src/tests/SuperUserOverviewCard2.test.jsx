import React from 'react'; 
import { render, screen } from '@testing-library/react';
import SuperUserCardGroup from '../components/SuperUserOverviewCard2';
import { describe, it, expect } from 'vitest';



describe('SuperUserCardGroup', () => {
  const mockMetrics = {
    completionRate: '75.32',
    averageCompletionTimeInMinutes: '4.50',
    averageUsersPerSurvey: '12.34',
  };

  it('renders without crashing', () => {
    render(<SuperUserCardGroup metrics={mockMetrics} />);
    expect(screen.getByText(/Completion Rate/i)).toBeInTheDocument();
    expect(screen.getByText(/Average Completion Time/i)).toBeInTheDocument();
    expect(screen.getByText(/Avg. Users per Survey/i)).toBeInTheDocument();
  });

  it('displays correct metric values', () => {
    render(<SuperUserCardGroup metrics={mockMetrics} />);
    expect(screen.getByText('75.32%')).toBeInTheDocument();
    expect(screen.getByText('4.50 min')).toBeInTheDocument();
    expect(screen.getByText('12.34')).toBeInTheDocument();
  });
});
