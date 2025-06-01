import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SignUp from "../pages/SignUp";
import { registerUser } from "../services/users";
import { useUserContext } from "../contexts/UserContext";

vi.mock("jwt-decode", () => ({ jwtDecode: () => ({ email: "test@gmail.com" }) }));
vi.mock("../services/users", () => ({ registerUser: vi.fn() }));
vi.mock("../contexts/UserContext", () => ({ useUserContext: vi.fn() }));

const mockSetUser = vi.fn();
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const Wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

beforeEach(() => {
    useUserContext.mockReturnValue({ setUser: mockSetUser });
});

describe("SignUp Page", () => {
    it("Check if all sign up elements exist", () => {
        render(<SignUp user="experimenter" />, { wrapper: Wrapper });

        expect(screen.getByText(/Sign up as experimenter/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText("Password")).toBeInTheDocument();
        expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
    });

    it("Make sure all fields are filled when signing up", () => {
        render(<SignUp user="experimenter" />, { wrapper: Wrapper });

        const signUpButton = screen.getByRole("button", { name: "Sign Up" });
        expect(signUpButton).toBeDisabled();
    });

    it("Sign up works if all fields filled and passwords are the same", async () => {
        registerUser.mockResolvedValueOnce({ data: { token: "token" } });

        render(<SignUp user="experimenter" />, { wrapper: Wrapper });

        fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: "Test User" } });
        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: "test@gmail.com" },
        });
        fireEvent.change(screen.getByLabelText("Password"), {
            target: { value: "Password123!" },
        });
        fireEvent.change(screen.getByLabelText("Confirm Password"), {
            target: { value: "Password123!" },
        });

        const signUpButton = screen.getByRole("button", { name: "Sign Up" });

        await waitFor(() => expect(signUpButton).not.toBeDisabled());

        fireEvent.click(signUpButton);

        await waitFor(() => {
            expect(registerUser).toHaveBeenCalled();
            expect(mockSetUser).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith("/");
        });
    });

    it("Show account already exists when sign up with same email", async () => {
        registerUser.mockRejectedValueOnce({ response: { status: 400 } });

        render(<SignUp user="experimenter" />, { wrapper: Wrapper });

        fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: "Test User" } });
        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: "test@gmail.com" },
        });
        fireEvent.change(screen.getByLabelText("Password"), {
            target: { value: "Password123!" },
        });
        fireEvent.change(screen.getByLabelText("Confirm Password"), {
            target: { value: "Password123!" },
        });

        const signUpButton = screen.getByRole("button", { name: "Sign Up" });
        fireEvent.click(signUpButton);

        await waitFor(() => {
            expect(screen.getByText(/there is already an account/i)).toBeInTheDocument();
        });
    });

    it("Navigates to login page", () => {
        render(<SignUp user="experimenter" />, { wrapper: Wrapper });
        fireEvent.click(screen.getByRole("button", { name: /login/i }));
        expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
});
