// client/src/tests/SurveyList.test.jsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';
import * as surveyService from '../services/surveys';
import * as answerService from '../services/answers';
import { beforeEach, vi } from 'vitest';
import SavedSurveys from '../pages/SavedSurveys';
import CompletedSurveys from '../pages/completedSurveys';

vi.mock('../contexts/UserContext', () => ({
  useUserContext: vi.fn(),
}));

vi.mock('../services/surveys');
vi.mock('../services/answers');



const mockSurveysSaved = [
  {
    answers: [
        {
            questionNumber: 1,
            answer: "Answer 1",
            timestamp: '2025-05-29T11:23:46.399Z',
            _id: '11'
        }
    ],
    completed: true,
    completedAt: "2025-05-29T11:23:46.399Z",
    started: true,
    surveyAuthor: "Author A", 
    surveyDescription: "Description A",
    _id: '1',
    surveyTitle: 'Survey A',
    surveyQuestions: [
      {
        questionType: 'Multiple Choice',
        questionText: 'Question 1',        
        options: ['Option 1', 'Option 2'],
      },
    ],
  },
];

const mockSurveysCompleted = [
  {
    answers: [
        {
            questionNumber: 1,
            answer: "Answer 2",
            timestamp: '2025-05-29',
            _id: '22'
        }
    ],
    completed: true,
    completedAt: "2025-05-29",
    started: true,   
    surveyAuthor: "Author B", 
    surveyDescription: "Description B",
    _id: '2',
    surveyTitle: 'Survey B',
    surveyQuestions: [
      {
        questionType: 'Multiple Choice',
        questionText: 'Question 2',        
        options: ['Option 11', 'Option 22'],
      },
    ],
  },
];

const renderComponentSaved = () => {
  return render(
    <BrowserRouter>
      <SavedSurveys />
    </BrowserRouter>
  );
};

const renderComponentCompleted = () => {
  return render(
    <BrowserRouter>
      <CompletedSurveys />
    </BrowserRouter>
  );
};

describe('Saved Surveys', () => {
  beforeEach(() => {
    useUserContext.mockReturnValue({ user: { accountType: 'experimentee', userId: 'u1' } });
    answerService.getSavedSurveyAnswers.mockResolvedValue({ data: mockSurveysSaved });
  });

  test('Displays saved survey', async () => {
    renderComponentSaved();
    await waitFor(() => {
      expect(screen.getByText('Survey A')).toBeInTheDocument();
      expect(screen.getByText('Author A')).toBeInTheDocument();
      expect(screen.getByText(/last/i)).toBeInTheDocument();
    });
  });


  test('filters surveys by title', async () => {
    renderComponentSaved();
    await screen.findByText('Survey A');

    fireEvent.change(screen.getByLabelText(/search by title or author/i), {
      target: { value: 'Survey A' },
    });

    expect(screen.queryByText('Survey A')).toBeInTheDocument();
  });

  test('Dont show survey on bad search', async () => {
    renderComponentSaved();
    await screen.findByText('Survey A');

    fireEvent.change(screen.getByLabelText(/search by title or author/i), {
      target: { value: 'Survey B' },
    });

    expect(screen.queryByText('Survey A')).not.toBeInTheDocument();
  });

  test('expands survey to show questions', async () => {
    renderComponentSaved();

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
      expect(screen.getByText(/Question 1/i)).toBeInTheDocument();
      //expect(screen.getByText(/Answer 1/i)).toBeInTheDocument();
    });
  });
}); 

describe('Completed Surveys', () => {
  beforeEach(() => {
    useUserContext.mockReturnValue({ user: { accountType: 'experimentee', userId: 'u1' } });
    answerService.getCompletedSurveyAnswers.mockResolvedValue({ data: mockSurveysCompleted });
  });

  test('Displayes completed surveys', async () => {
    renderComponentCompleted();
    await waitFor(() => {
      expect(screen.getByText('Survey B')).toBeInTheDocument();
      expect(screen.getByText('Author B')).toBeInTheDocument();
      expect(screen.getByText(/completed/i)).toBeInTheDocument();
    });
  });


  test('filters surveys by title', async () => {
    renderComponentCompleted();
    await screen.findByText('Survey B');

    fireEvent.change(screen.getByLabelText(/search by title or author/i), {
      target: { value: 'Survey B' },
    });

    expect(screen.queryByText('Survey B')).toBeInTheDocument();
  });

  test('Dont show survey on bad search', async () => {
    renderComponentCompleted();
    await screen.findByText('Survey B');

    fireEvent.change(screen.getByLabelText(/search by title or author/i), {
      target: { value: 'Survey A' },
    });

    expect(screen.queryByText('Survey B')).not.toBeInTheDocument();
  });

  test('expands survey to show questions', async () => {
    renderComponentCompleted();

    // Wait for a known survey title to appear
    await screen.findByText('Survey B');

    // Find the expand button (first cell in the row has the IconButton)
    const expandButtons = screen.getAllByRole('button');
    const expandButton = expandButtons.find((btn) =>
      btn.querySelector('svg[data-testid="KeyboardArrowDownIcon"]')
    );

    expect(expandButton).toBeTruthy();
    fireEvent.click(expandButton);

    // Assert that question section appears
    await waitFor(() => {
      expect(screen.getByText(/Question 2/i)).toBeInTheDocument();
      //expect(screen.getByText(/Answer 2/i)).toBeInTheDocument();
    });
  });
}); 


describe('No Saved surveys', () => {
  beforeEach(() => {
    useUserContext.mockReturnValue({ user: { accountType: 'experimentee', userId: 'u1' } });
    answerService.getSavedSurveyAnswers.mockResolvedValue({ data: [] });
  }); 

  test('Display no saved surveys', async () => {
    renderComponentSaved();
    await waitFor(() => {
      expect(screen.getByText(/not started/i)).toBeInTheDocument();
      expect(screen.getByText("Title")).toBeInTheDocument();
    });
  });
}); 

describe('No Completed surveys', () => {
  beforeEach(() => {
    useUserContext.mockReturnValue({ user: { accountType: 'experimentee', userId: 'u1' } });
    answerService.getCompletedSurveyAnswers.mockResolvedValue({ data: [] });
  }); 

  test('Display no completed surveys', async () => {
    renderComponentCompleted();
    await waitFor(() => {
      expect(screen.getByText(/not completed/i)).toBeInTheDocument();
      expect(screen.getByText("Title")).toBeInTheDocument();
    });
  });
}); 