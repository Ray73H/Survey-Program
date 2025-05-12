import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userId, setUserId] = useState("");
    const [emailContext, setEmailContext] = useState("");
    const [nameContext, setNameContext] = useState("");
    const [accountTypeContext, setAccountTypeContext] = useState("");

    const logout = () => {
        setUserId("");
        setEmailContext("");
        setNameContext("");
        setAccountTypeContext("");
        localStorage.removeItem("authToken");
    };

    return (
        <UserContext.Provider
            value={{
                userId,
                setUserId,
                emailContext,
                setEmailContext,
                nameContext,
                setNameContext,
                accountTypeContext,
                setAccountTypeContext,
                logout,
            }}
        ></UserContext.Provider>
    );
};

export const useUserContext = () => {
    useContext(UserContext);
};
