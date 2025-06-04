import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import { loginUser } from "../services/users";
import { useUserContext } from "../contexts/UserContext";

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

const Wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

beforeEach(() => {
    useUserContext.mockReturnValue({ setUser: mockSetUser });
});

describe("Login Page", () => {
    it("Check if all login elements exist", () => {
        render(<Login />, { wrapper: Wrapper });

        expect(screen.getByRole("heading", { name: /log in/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
        expect(screen.getByText("Password")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
    });

    it("Input email and password in login", () => {
        render(<Login />, { wrapper: Wrapper });

        fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: "test@gmail.com" } });
        fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } });

        expect(screen.getByLabelText(/e-mail/i).value).toBe("test@gmail.com");
        expect(screen.getByLabelText("Password").value).toBe("password123");
    });

    it("Toggle password visibility", () => {
        render(<Login />, { wrapper: Wrapper });

        const toggleBtn = screen.getByLabelText(/display the password/i);
        fireEvent.click(toggleBtn);

        expect(screen.getByLabelText(/hide the password/i)).toBeInTheDocument();
    });

    it("Check if successful login navigates to dashboard page", async () => {
        loginUser.mockResolvedValueOnce({ data: { token: "mock-token" } });

        render(<Login />, { wrapper: Wrapper });

        fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: "test@gmail.com" } });
        fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } });

        fireEvent.click(screen.getByRole("button", { name: /log in/i }));

        await waitFor(() => {
            expect(sessionStorage.getItem("authToken")).toBe("mock-token");
            expect(mockSetUser).toHaveBeenCalledWith({ email: "test@gmail.com" });
            expect(mockNavigate).toHaveBeenCalledWith("/");
        });
    });

    it("Show error message if invalid login", async () => {
        loginUser.mockRejectedValueOnce({
            response: { data: { message: "Invalid credentials" } },
        });

        render(<Login />, { wrapper: Wrapper });

        fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: "test@gmail.com" } });
        fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } });

        fireEvent.click(screen.getByRole("button", { name: /log in/i }));

        await waitFor(() => {
            expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
        });
    });

    it("Navigate to singup page when button clicked", () => {
        render(<Login />, { wrapper: Wrapper });

        fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
        expect(mockNavigate).toHaveBeenCalledWith("/signup");
    });

    it("Check if guest login correctly signs user in as guest", () => {
        render(<Login />, { wrapper: Wrapper });

        fireEvent.click(screen.getByRole("button", { name: /continue as guest/i }));

        expect(sessionStorage.getItem("guestSessionId")).toBe("mock-uuid");
        expect(mockSetUser).toHaveBeenCalledWith({
            userId: "mock-uuid",
            email: "",
            name: "Guest",
            accountType: "experimentee",
            guest: true,
        });
        expect(mockNavigate).toHaveBeenCalledWith("/");
    });
});
