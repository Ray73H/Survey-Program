import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import FillSurvey from "../pages/fillSurvey";
import { vi } from "vitest";

const mockNavigate = vi.fn();
const mockLocationState = vi.fn();

const mockSurvey1 = {
    _id: "1",
    title: "Test Survey",
    description: "This is a test survey.",
    author: "Tester",
    questions: [
        { questionText: "What is your name?", questionType: "text" },
        { questionText: "What is your favorite color?", questionType: "text" }
    ]
};

const mockSurvey2 = {
    __v: 0,
    _id: "6833422900ba8f4ebd603501",
    author: "Experimenter User",
    createdAt: "2025-05-25T16:15:37.922Z",
    deadline: "2025-05-25T16:15:37.920Z",
    description: "best answers only",
    imported: false,
    pinCode: "9435",
    public: true,
    published: false,
    questions: [
        {
            questionType: "multiple",
            questionText: "goat",
            options: ["Messi", "Ronaldo"],
            _id: "6833429300ba8f4ebd60350d"
        },
        {
            questionType: "multiple",
            questionText: "Best club",
            options: ["Real Madrid", "FC Barcelona"],
            _id: "6833429300ba8f4ebd60350e"
        },
        {
            questionType: "multiple",
            questionText: "most world cup trophies",
            options: ["Brazil", "Switzerland", "Germany"],
            _id: "6833429300ba8f4ebd60350f"
        },
        {
            questionType: "text",
            questionText: "What do you think of football?",
            options: [],
            _id: "6833429300ba8f4ebd603510"
        }
    ],
    title: "football",
    updatedAt: "2025-05-25T16:20:57.843Z",
    userId: "6829a91eb920886abe3ac216"
};

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useLocation: () => ({ state: mockLocationState() }),
        MemoryRouter: actual.MemoryRouter,
        Route: actual.Route,
        Routes: actual.Routes
    };
});

vi.mock("../contexts/UserContext", () => ({
    useUserContext: () => ({ user: { userId: "123", guest: false } })
}));

vi.mock("../services/surveys", () => ({
    getSurveyByPinCode: vi.fn((pinCode) =>
        Promise.resolve({
            data: pinCode === "9435" ? mockSurvey2 : mockSurvey1
        })
    )
}));

vi.mock("../services/answers", () => ({
    getAnswer: vi.fn().mockResolvedValue({ data: [] }),
    updateAnswer: vi.fn().mockResolvedValue({})
}));

describe("FillSurvey", () => {
    beforeEach(() => {
        mockNavigate.mockClear();
        mockLocationState.mockClear();
        mockLocationState.mockReturnValue({
            pinCode: "1234",
            answerId: "answer123",
            survey: mockSurvey1
        });
    });

    function renderWithSurvey(locationState = {
        pinCode: "1234",
        answerId: "answer123",
        survey: mockSurvey1
    }) {
        mockLocationState.mockReturnValue(locationState);
        render(
            <MemoryRouter>
                <FillSurvey />
            </MemoryRouter>
        );
    }

    it("should display the survey title", async () => {
        renderWithSurvey();

        await waitFor(() => {
            const titles = screen.getAllByText(/Test Survey/i);
            expect(titles.length).toBeGreaterThan(0);
        });
    });

    it("should display the survey description", async () => {
        renderWithSurvey();

        await waitFor(() => {
            expect(screen.getByText(/This is a test survey\./i)).toBeInTheDocument();
        });
    });

    it("should show 100% complete on second question", async () => {
        renderWithSurvey();

        await waitFor(() => {
            const nextButton = screen.getByRole("button", { name: /next/i });
            fireEvent.click(nextButton);
        });

        await waitFor(() => {
            const progressBar = screen.getByRole("progressbar");
            expect(progressBar).toHaveAttribute("aria-valuenow", "100");
        });
    });

    it("should show 50% complete on second question with mockSurvey2", async () => {
        renderWithSurvey({
            pinCode: "9435",
            answerId: "answer456",
            survey: mockSurvey2
        });

        await waitFor(() => {
            expect(screen.getByText("goat")).toBeInTheDocument();
        });

        const nextButton = screen.getByRole("button", { name: /next/i });
        fireEvent.click(nextButton);

        await waitFor(() => {
            const progressBar = screen.getByRole("progressbar");
            expect(progressBar).toHaveAttribute("aria-valuenow", "50");
        });
    });

     it("should show 75% complete on second question with mockSurvey2", async () => {
        renderWithSurvey({
            pinCode: "9435",
            answerId: "answer456",
            survey: mockSurvey2
        });

        await waitFor(() => {
            expect(screen.getByText("goat")).toBeInTheDocument();
        });

        const nextButton = screen.getByRole("button", { name: /next/i });
        fireEvent.click(nextButton);

         await waitFor(() => {
            expect(screen.getByText("Real Madrid")).toBeInTheDocument();
        });

        const nextButton2 = screen.getByRole("button", { name: /next/i });
        fireEvent.click(nextButton2);

        await waitFor(() => {
            const progressBar = screen.getByRole("progressbar");
            expect(progressBar).toHaveAttribute("aria-valuenow", "75");
        });
    });

    it("should reach last question, type 'TEST', and show 100% progress", async () => {
    renderWithSurvey({
        pinCode: "9435",
        answerId: "answer456",
        survey: mockSurvey2
    });

    await waitFor(() => {
        expect(screen.getByText("goat")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    await waitFor(() => {
        expect(screen.getByText("Real Madrid")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    await waitFor(() => {
        expect(screen.getByText("most world cup trophies")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    await waitFor(() => {
        expect(screen.getByText("What do you think of football?")).toBeInTheDocument();
    });

    await waitFor(() => {
        const progressBar = screen.getByRole("progressbar");
        expect(progressBar).toHaveAttribute("aria-valuenow", "100");
    });

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "TEST" } });

    expect(input).toHaveValue("TEST");
});

it("should navigate when icon-only back button is clicked and confirmed", async () => {
    vi.spyOn(window, "confirm").mockReturnValueOnce(true);

    renderWithSurvey({
        pinCode: "9435",
        answerId: "answer456",
        survey: mockSurvey2
    });

    await waitFor(() => {
        expect(screen.getByText("goat")).toBeInTheDocument();
    });

    const buttons = screen.getAllByRole("button");
    const backButton = buttons[0];

    fireEvent.click(backButton);

    expect(window.confirm).toHaveBeenCalledWith("Go back to the dashboard without submitting?");
    expect(mockNavigate).toHaveBeenCalledWith("/experimentee");
    
});

});
