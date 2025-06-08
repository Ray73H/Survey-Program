import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SurveyBuilder from "../pages/SurveyBuilder";
import { registerUser } from "../services/users";
import { useUserContext } from "../contexts/UserContext";
import { expect, vi } from "vitest";
import * as surveyService from "../services/surveys";

vi.mock("uuid", () => ({ v4: () => "mock-uuid" }));
vi.mock("jwt-decode", () => ({ jwtDecode: () => ({ email: "test@gmail.com" }) }));
vi.mock("../services/users", () => ({ loginUser: vi.fn() }));
vi.mock("../contexts/UserContext", () => ({
    useUserContext: vi.fn(),
}));

const mockSetUser = vi.fn();
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});



// Context Mock
vi.mock("../contexts/UserContext", () => ({
  useUserContext: vi.fn(),
}));

// Services Mock
vi.mock("../services/surveys", () => ({
  getSurveyById: vi.fn(),
  updateSurvey: vi.fn(),
  deleteSurvey: vi.fn(),
}));

const mockSurveyData = {
  title: "Mock Survey",
  description: "Test survey",
  public: false,
  pinCode: "1234",
  questions: [],
  deadline: new Date(),
  published: false,
};

beforeEach(() => {
  useUserContext.mockReturnValue({ user: { userId: "user123" } });
  surveyService.getSurveyById.mockResolvedValue({ data: mockSurveyData });
  surveyService.updateSurvey.mockResolvedValue({ success: true });
  surveyService.deleteSurvey.mockResolvedValue({ success: true });
});


const Wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe("Survey Builder Page", () => {
    it("Check if all Survey Builder Elements elements exist", () => {
            render(<SurveyBuilder />, { wrapper: Wrapper });

            //all headings
            expect(screen.getByRole("heading", {name: /survey builder/i})).toBeInTheDocument();
            expect(screen.getByRole("heading", {name: /title/i})).toBeInTheDocument();
            expect(screen.getByRole("heading", {name: /Description \(optional\)/i})).toBeInTheDocument();
            expect(screen.getByRole("heading", {name: /deadline/i})).toBeInTheDocument();
            expect(screen.getByRole("heading", {name: /questions/i})).toBeInTheDocument();


            //all buttons
            expect(screen.getByRole("button", {name: /publish survey/i})).toBeInTheDocument();
            expect(screen.getByRole("button", {name: /save/i})).toBeInTheDocument();
            expect(screen.getByRole("button", {name: /delete survey/i})).toBeInTheDocument();
            expect(screen.getByRole("button", {name: /\+ add new question/i})).toBeInTheDocument();

            //all text fields (DO NOT HAVE NAMES)
            //expect(screen.getByRole("textbox", {name: /title/i})).toBeInTheDocument();

            //date pickers & rest
            expect(screen.getByRole("group", {name: /deadline/i})).toBeInTheDocument();
            expect(screen.getByRole("checkbox", {name: /private/i})).toBeInTheDocument();
        });

    
        
        it("should change question type from Text to Multiple Choice and show options", async () => {
            render(<SurveyBuilder />, { wrapper: Wrapper });
            
            // Wait for initial fetch and render
            await waitFor(() => {
                expect(screen.getByText("Survey Builder")).toBeInTheDocument();
            });

            //click addQuestion 3 times
            const numQuestions = 3;
            for (let i = 0; i < numQuestions; i++){
                fireEvent.click(screen.getByRole("button", { name: /\+ add new question/i }));
            }

            for (let i = 0; i < numQuestions; i++){
                    const questRegex = new RegExp(`Question ${i + 1}`, "i");
                    expect(screen.getByRole("heading", {name : questRegex})).toBeInTheDocument();
                }


                // Wait for question to appear
                const comboList = await screen.findAllByLabelText(/question type/i);
                const combo = comboList[Math.floor(Math.random() * numQuestions)];
                fireEvent.mouseDown(combo);


                // Select "Multiple Choice"
                const multipleOption = await screen.findByRole("option", {
                    name: /multiple choice/i,
                });
                fireEvent.click(multipleOption);

                // Assert dropdown is updated
            expect(combo.textContent.toLowerCase()).toContain("multiple");
            
            // Click "+ Add Option"
            const addOptionButton = screen.getByRole("button", {
                name: /\+ add option/i,
            });

            const optionAmount = 4;
            for(let i = 0; i < optionAmount; i++){
                fireEvent.click(screen.getByRole("button", {name: /\+ add option/i}));
            }

            for (let i = 0; i < optionAmount; i++){
                const questRegex = new RegExp(`option ${i + 1}`, "i");
                expect(screen.getByRole("textbox", {name : questRegex})).toBeInTheDocument();
                }
        });
        
        it("check switching components", async () => {
            render(<SurveyBuilder />, { wrapper: Wrapper });
            const title = screen.getByLabelText(/title/i);
            fireEvent.change(title, {target: {value: 'Test Survey'}})
            fireEvent.click(screen.getByRole("button", { name: /\+ add new question/i }));
    
            //part 1: publish/unpublish button
            const publishButton = screen.getByRole("button", {name: /publish survey/i});
            fireEvent.click(publishButton);
            await waitFor(() => {
                expect(screen.getByRole("button", {name: /unpublish survey/i})).toBeInTheDocument();
            });
            
            fireEvent.click(screen.getByRole("button", {name: /unpublish survey/i}));
            await waitFor(() => {
                expect(screen.getByRole("button", {name: /publish survey/i})).toBeInTheDocument();
            });
    
            //part 2: public/private survey
            const privSwitch = screen.getByRole("checkbox");
            expect(screen.getByRole("heading", {name: /pin code:/i})).toBeInTheDocument();
    
            fireEvent.click(privSwitch);
            expect(screen.queryByRole("heading", {name: /pin code:/i})).not.toBeInTheDocument();
        });
        
    });