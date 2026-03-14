import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
    const [loggedIn, setLoggedIn] = useState(() => {
        const token = localStorage.getItem("token")
        return token ? { token } : null;
    });


    // useEffect(() => {
    //     function handleStorageChange() {
    //         const token = localStorage.getItem("token");
    //         setLoggedIn(token ? { token } : null);
    //     }
    //     window.addEventListener("storage", handleStorageChange);
    //     return () => window.removeEventListener("storage", handleStorageChange);
    // }, []);

    const login = (token) => {
        localStorage.setItem("token", token);
        setLoggedIn({ token }); // update state immediately
    };

    const logout = () => {
        localStorage.removeItem("token");
        setLoggedIn(null); // update state immediately
    };


    return (
        <UserContext.Provider value={{ loggedIn, login, logout }}>
            {children}
        </UserContext.Provider>
    );
}