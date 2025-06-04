// client/src/tests/SurveyList.test.jsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SurveyList from '../pages/SurveyList';
import { BrowserRouter } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';
import * as surveyService from '../services/surveys';
import * as answerService from '../services/answers';
import { vi } from 'vitest';

vi.mock('../contexts/UserContext', () => ({
  useUserContext: vi.fn(),
}));

vi.mock('../services/surveys');
vi.mock('../services/answers');

const mockSurveys = [
  {
    _id: '1',
    title: 'Survey A',
    author: 'Author A',
    public: true,
    pinCode: '1234',
    imported: false,
    published: true,
    deadline: '2025-12-31',
    uniqueParticipants: 100,
    questions: [
      {
        questionNumber: 1,
        questionText: 'Question 1',
        questionType: 'Multiple Choice',
        options: ['Option 1', 'Option 2'],
      },
    ],
  },
];

const mockMetrics = [
  {
    surveyId: '1',
    completionRate: 85,
    averageCompletionTimeInMinutes: 10,
  },
];

const mockMetricsPerQuestion = {
  '1': {
    1: {
      completionRate: 90,
      averageTime: 2,
    },
  },
};

const mockStats = {
  totalSurveys: 1,
  totalResponses: 10,
  averageCompletionRate: 85,
  averageCompletionTime: 10,
  averageUsersPerSurvey: 5,
};

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <SurveyList />
    </BrowserRouter>
  );
};

beforeEach(() => {
  useUserContext.mockReturnValue({ user: { accountType: 'experimenter', userId: 'u1' } });
  surveyService.getSurveysByUserId.mockResolvedValue({ data: mockSurveys });
  answerService.getMetricsPerSurvey.mockResolvedValue({ data: mockMetrics });
  answerService.getMetricsPerQuestion.mockResolvedValue({ data: mockMetricsPerQuestion });
  answerService.getTotalResponses.mockResolvedValue({ data: { totalResponses: mockStats.totalResponses } });
  answerService.getAverageCompletionRate.mockResolvedValue({ data: { averageCompletionRate: mockStats.averageCompletionRate } });
  answerService.getAverageCompletionTime.mockResolvedValue({ data: { averageCompletionTime: mockStats.averageCompletionTime } });
  answerService.getAverageUsersPerSurvey.mockResolvedValue({ data: { averageUsersPerSurvey: mockStats.averageUsersPerSurvey } });
});

test('renders SurveyList and displays survey', async () => {
  renderComponent();
  await waitFor(() => {
    expect(screen.getByText('Survey A')).toBeInTheDocument();
    expect(screen.getByText('Author A')).toBeInTheDocument();
  });
});

test('filters surveys by title', async () => {
  renderComponent();
  await screen.findByText('Survey A');

  fireEvent.change(screen.getByLabelText(/search by title or author/i), {
    target: { value: 'Survey A' },
  });

  expect(screen.queryByText('Survey A')).toBeInTheDocument();
});

test('expands survey to show questions and metrics', async () => {
  renderComponent();

  // Wait for a known survey title to appear
  await screen.findByText('Survey A');

  // Find the expand button (first cell in the row has the IconButton)
  const expandButtons = screen.getAllByRole('button');
  const expandButton = expandButtons.find((btn) =>
    btn.querySelector('svg[data-testid="KeyboardArrowDownIcon"]')
  );

  expect(expandButton).toBeTruthy();
  fireEvent.click(expandButton);

  // Assert that question section appears
  await waitFor(() => {
    expect(screen.getByText(/questions/i)).toBeInTheDocument();
  });
});


