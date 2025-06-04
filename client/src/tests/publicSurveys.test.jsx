// client/src/tests/SurveyList.test.jsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';
import * as surveyService from '../services/surveys';
import * as answerService from '../services/answers';
import PublicSurveys from '../pages/PublicSurvey';
import { beforeEach, vi } from 'vitest';

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


const renderComponent = () => {
  return render(
    <BrowserRouter>
      <PublicSurveys />
    </BrowserRouter>
  );
};

describe('Public Surveys - exists', () => {
  beforeEach(() => {
    useUserContext.mockReturnValue({ user: { accountType: 'experimentee', userId: 'u1' } });
    surveyService.getPublicSurveys.mockResolvedValue({ data: mockSurveys });
  });

  test('renders PublicSuverys and displays survey', async () => {
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

  test('Dont show survey on bad search', async () => {
    renderComponent();
    await screen.findByText('Survey A');

    fireEvent.change(screen.getByLabelText(/search by title or author/i), {
      target: { value: 'Survey B' },
    });

    expect(screen.queryByText('Survey A')).not.toBeInTheDocument();
  });

  test('expands survey to show questions', async () => {
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
}); 

describe('Public Surveys does not exist', () => {
  beforeEach(() => {
    useUserContext.mockReturnValue({ user: { accountType: 'experimentee', userId: 'u1' } });
    surveyService.getPublicSurveys.mockResolvedValue({ data: [] });
  }); 

  test('Display no surveys', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(/no survey/i)).toBeInTheDocument();
    });
  });
});