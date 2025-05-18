import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/users";
import { jwtDecode } from "jwt-decode";

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
                console.log(decoded);
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
