import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import { loginUser } from "../services/users";
import { useUserContext } from "../contexts/UserContext";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import WelcomeSurvey from "../pages/welcomeSurvey";
import { assert, vi } from "vitest";

vi.mock("../contexts/UserContext", () => ({
  useUserContext: () => ({ user: { userId: "123", guest: false } })
}));

const mockNavigate = vi.fn();
const mockLocationState = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: mockLocationState() }),
    MemoryRouter: actual.MemoryRouter,
    Route: actual.Route,
    Routes: actual.Routes,
  };
});

describe("WelcomeSurvey", () => {
  const mockSurvey1 = {
    _id: "1",
    title: "football",
    description: "best answers only",
    pinCode: "1234"
  };

  const mockSurvey2 = {

    _id: "2",
    title: "basketball",
    description: "",
    pinCode: "2345"

  }
  const mockSurvey3 = { 
    _id: "3",
    title: "",
    description: "test3",
    pinCode: "3456"
  };


  beforeEach(() => {
    mockNavigate.mockClear();
    mockLocationState.mockClear();
    vi.resetModules();
    vi.mock('../services/answers', () => ({
        getAnswer: vi.fn().mockResolvedValue({ data: [{ completed: false, started: false, _id: 'answer123' }] }),
        updateAnswer: vi.fn().mockResolvedValue({}),
    }));
  });

  function renderWithRouterAndState(state = {}) {
    mockLocationState.mockReturnValue(state);

    render(
      <MemoryRouter initialEntries={[{pathname: "/", state: state}]}>
        <WelcomeSurvey />
      </MemoryRouter>
    );
  }

  it("should display the survey title and description", () => {
    renderWithRouterAndState({ survey: mockSurvey1 });

    expect(screen.getByText(/Welcome to football/i)).toBeInTheDocument();
    expect(screen.getByText(/best answers only/i)).toBeInTheDocument();
  });

  it("should display the survey title only", () => {
    renderWithRouterAndState({ survey: mockSurvey2 });

    expect(screen.getByText(/Welcome to basketball/i)).toBeInTheDocument();
    // Check that exactly one h5 is rendered and it is empty
    const h5Elements = screen.queryAllByRole('heading', { level: 5 });
    expect(h5Elements.length).toBe(1);
    expect(Array.from(h5Elements).some(bro => bro.textContent === "")).toBe(true);


  });

  it("should display the description title only", () => {
    renderWithRouterAndState({ survey: mockSurvey3 });

    expect(screen.getByText(/test3/i)).toBeInTheDocument();
    // Check that exactly one h5 is rendered and it is empty
    const h2Elements = screen.queryAllByRole('heading', { level: 2 });
   
    expect(Array.from(h2Elements).some(bro => bro.textContent === "Welcome to ")).toBe(true);


  });

  it("should navigate to fillSurvey page when Fill Out is clicked", async () => {
    renderWithRouterAndState({ survey: mockSurvey1 });

    const fillOutBtn = screen.getByRole("button", { name: /fill out/i });
    fireEvent.click(fillOutBtn);

    await vi.waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/fillSurvey", {
        state: {
          pinCode: mockSurvey1.pinCode,
          survey: mockSurvey1,
          answerId: 'answer123',
        },
      });
    }, { timeout: 2000 });
  });

  it("should navigate to dashboard when Back to dashboard is clicked", () => {
    renderWithRouterAndState({ survey: mockSurvey1 });

    const backBtn = screen.getByRole("button", { name: /back to dashboard/i });
    fireEvent.click(backBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/Experimentee");
  });

  it("should redirect to /join if no survey is provided", () => {
    renderWithRouterAndState({});

    expect(mockNavigate).toHaveBeenCalledWith("/join");
  });
});
