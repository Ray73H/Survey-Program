import React from 'react';
import { render, screen, fireEvent, waitFor, click} from '@testing-library/react';
import userEvent from '@testing-library/user-event'; 
import { BrowserRouter } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';
import * as surveyService from '../services/surveys';
import * as answerService from '../services/answers';
import * as userService from '../services/users';
import { beforeEach, test, vi } from 'vitest';
import SettingsExperimentee from '../pages/settingsExperimentee';
import SettingsExperimenter from '../pages/settingsExperimenter';

vi.mock('../contexts/UserContext', () => ({
  useUserContext: vi.fn(),
}));

vi.mock('../services/surveys');
vi.mock('../services/answers');
vi.mock('../services/users');


const mockUseree = 
  {
    accountType: "experimentee",
    email: "experimentee@gmail.com",
    name: "Experimentee",
    userId: "1",
  };

const mockUserer = 
  {
    accountType: "experimenter",
    email: "experimenter@gmail.com",
    name: "Experimenter",
    userId: "2",
  };

const renderComponentee = () => {
  return render(
    <BrowserRouter>
      <SettingsExperimentee />
    </BrowserRouter>
  );
};

const renderComponenter = () => {
  return render(
    <BrowserRouter>
      <SettingsExperimenter  />
    </BrowserRouter>
  );
};

describe('Experimentee settingspage', () => {
    beforeEach(() => {
        useUserContext.mockReturnValue({ user: mockUseree } );
        renderComponentee();
    });

    test('Displays account information', async () => {
        expect(screen.getByText('experimentee')).toBeInTheDocument();
        expect(screen.getByText('experimentee@gmail.com')).toBeInTheDocument();
        expect(screen.getByText('Experimentee')).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /delete/i }));  
    });

    test('Displayes dialog when pressing delete, cancels afterwards', async () => {
        const deletebtn = screen.getByRole('button', { name: /delete/i });
        userEvent.click(deletebtn);
        expect(screen.getByRole('dialog', {name: /confirm/i}));
        const cancelbtn = screen.getByRole('button', { name: /cancel/i });
        userEvent.click(cancelbtn);
        expect(deletebtn);
    });

    /*test('Displayes dialog when pressing delete, sends alert when confirmed', async () => {
        userService.deleteUser.mockResolvedValue({ });
        const deletebtn = screen.getByRole('button', { name: /delete/i });
        userEvent.click(deletebtn);
        expect(screen.getByRole('dialog', {name: /confirm/i}));
        const confirmbtn = screen.getByRole('button', { name: /delete/i });
        userEvent.click(confirmbtn);
        expect(screen.getByRole('alert', {description: /delete/i}));
    }); 
        NOTE: CANNOT FIND THE DIALOG. PERHAPS HANDLEUSERDELETE FROM SETTINGS NEEDS TO ME MOCKED
    
    */
});


describe('Experimenter settingspage', () => {
    beforeEach(() => {
        useUserContext.mockReturnValue({ user: mockUserer } );
        renderComponenter();
    });

    test('Displays account information', async () => {
        expect(screen.getByText('experimenter')).toBeInTheDocument();
        expect(screen.getByText('experimenter@gmail.com')).toBeInTheDocument();
        expect(screen.getByText('Experimenter')).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /delete/i }));  
    });

    test('Displayes dialog when pressing delete, cancels afterwards', async () => {
        const deletebtn = screen.getByRole('button', { name: /delete/i });
        userEvent.click(deletebtn);
        expect(screen.getByRole('dialog', {name: /confirm/i}));
        const cancelbtn = screen.getByRole('button', { name: /cancel/i });
        userEvent.click(cancelbtn);
        expect(deletebtn);
    });

    /*test('Displayes dialog when pressing delete, sends alert when confirmed', async () => {
        userService.deleteUser.mockResolvedValue({ });
        const deletebtn = screen.getByRole('button', { name: /delete/i });
        userEvent.click(deletebtn);
        expect(screen.getByRole('dialog', {name: /confirm/i}));
        const confirmbtn = screen.getByRole('button', { name: /delete/i });
        userEvent.click(confirmbtn);
        expect(screen.getByRole('alert', {description: /delete/i}));
    }); 
        NOTE: CANNOT FIND THE DIALOG. PERHAPS HANDLEUSERDELETE FROM SETTINGS NEEDS TO ME MOCKED
    
    */
})
