import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/users";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        userId: "",
        email: "",
        name: "",
        accountType: "",
    });

    useEffect(() => {
        const token = sessionStorage.getItem("authToken");
        const guestSessionId = sessionStorage.getItem("guestSessionId");
        if (token) {
            try {
                const decoded = jwtDecode(token);

                const currentTime = Date.now() / 1000;
                if (decoded.exp && decoded.exp < currentTime) {
                    logout();
                    return;
                }

                setUser(decoded);
            } catch (error) {
                console.error("Failed to rehydrate user:", error);
                logout();
            }
        } else if (guestSessionId) {
            const expiresAt = parseInt(sessionStorage.getItem("guestSessionExpires"));
            if (Date.now() > expiresAt) {
                logout();
                return;
            }

            setUser({
                userId: guestSessionId,
                email: "",
                name: "Guest",
                accountType: "experimentee",
                guest: true,
            });
        }
    }, []);

    const logout = () => {
        setUser({
            userId: "",
            email: "",
            name: "",
            accountType: "",
            surveyAccess: [],
        });
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("guestSessionId");
        sessionStorage.removeItem("guestSessionExpires");
    };

    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
                logout,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    return useContext(UserContext);
};
