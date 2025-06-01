import { render, screen, fireEvent } from '@testing-library/react';
import SuperUserCard from '../components/SuperUserOverviewCard';
import React from 'react';

describe('SuperUserCard', () => {
  const surveys = [
    { _id: 's1', published: false },
    { _id: 's2', published: true, deadline: new Date(Date.now() + 86400000).toISOString() },
    { _id: 's3', published: true, deadline: new Date(Date.now() - 86400000).toISOString() },
  ];

  const users = [
    { _id: 'u1', accountType: 'experimenter' },
    { _id: 'u2', accountType: 'superuser' },
    { _id: 'u3', accountType: 'experimentee' },
    { _id: 'u4', accountType: 'experimenter' },
  ];

  const responses = Array.from({ length: 6 }, (_, i) => ({ _id: `r${i + 1}` }));

  it('displays correct totals for surveys, users, and responses', () => {
    render(<SuperUserCard surveys={surveys} users={users} allAnswers={responses} />);
    expect(screen.getByText('3')).toBeInTheDocument(); // Total surveys
    expect(screen.getByText('4')).toBeInTheDocument(); // Total users
    expect(screen.getByText('6')).toBeInTheDocument(); // Total responses
  });

    it('filters users when clicking filter buttons', () => {
    render(<SuperUserCard surveys={surveys} users={users} allAnswers={responses} />);

    fireEvent.click(screen.getByRole('button', { name: /experimenter/i }));
    expect(screen.getAllByText('2').length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole('button', { name: /super user/i }));
    expect(screen.getAllByText('1').length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole('button', { name: /experimentee/i }));
    expect(screen.getAllByText('1').length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole('button', { name: /total/i }));
    expect(screen.getAllByText('4').length).toBeGreaterThan(0);
    });

});
