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
        surveyAccess: [],
    });

    useEffect(() => {
        const token = sessionStorage.getItem("authToken");
        if (token) {
            try {
                const decoded = jwtDecode(token);

                const currentTime = Date.now() / 1000;
                if (decoded.exp && decoded.exp < currentTime) {
                    console.warn("Token has expired.");
                    logout();
                    return;
                }

                setUser(decoded);
            } catch (error) {
                console.error("Failed to rehydrate user:", error);
                logout();
            }
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
