// client/src/tests/StatisticsCardsSurveyList.test.jsx
import { render, screen } from '@testing-library/react';
import StatisticsCards from '../components/StatisticsCardsSurveyList';
import React from 'react';

describe('StatisticsCards', () => {
  const mockStats = {
    totalSurveys: 5,
    totalResponses: 100,
    averageCompletionRate: 80.5,
    averageCompletionTime: 12.34,
    averageUsersPerSurvey: 4.56,
  };

  it('renders all statistic cards with correct values', () => {
    render(<StatisticsCards stats={mockStats} />);
    
    expect(screen.getByText('Total Surveys Created')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();

    expect(screen.getByText('Total Responses')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();

    expect(screen.getByText('Avg. Completion Rate (%)')).toBeInTheDocument();
    expect(screen.getByText('80.5')).toBeInTheDocument();

    expect(screen.getByText('Avg. Completion Time (min)')).toBeInTheDocument();
    expect(screen.getByText('12.34')).toBeInTheDocument();

    expect(screen.getByText('Avg. Users per Survey')).toBeInTheDocument();
    expect(screen.getByText('4.56')).toBeInTheDocument();
  });

  it('shows "-" if stats values are null or undefined', () => {
    const incompleteStats = {};
    render(<StatisticsCards stats={incompleteStats} />);
    expect(screen.getAllByText('-').length).toBeGreaterThan(0);
  });
});
