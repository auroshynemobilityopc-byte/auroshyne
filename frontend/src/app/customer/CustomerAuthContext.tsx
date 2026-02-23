import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { getCustomerToken, setCustomerToken, clearCustomerToken } from "./customerStorage";

interface CustomerUser {
    id: string;
    name: string;
    mobile: string;
}

interface CustomerAuthContextType {
    user: CustomerUser | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string, user: CustomerUser) => void;
    logout: () => void;
    isLoading: boolean;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const CustomerAuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<CustomerUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = getCustomerToken();
        const storedUser = localStorage.getItem("customerUser");

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = (newToken: string, newUser: CustomerUser) => {
        setCustomerToken(newToken);
        localStorage.setItem("customerUser", JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    };

    const logout = () => {
        clearCustomerToken();
        localStorage.removeItem("customerUser");
        setToken(null);
        setUser(null);
        window.location.href = "/login"; // Redirect explicitly
    };

    return (
        <CustomerAuthContext.Provider value={{
            user,
            token,
            isAuthenticated: !!token,
            login,
            logout,
            isLoading
        }}>
            {children}
        </CustomerAuthContext.Provider>
    );
};

export const useCustomerAuth = () => {
    const context = useContext(CustomerAuthContext);
    if (context === undefined) {
        throw new Error("useCustomerAuth must be used within a CustomerAuthProvider");
    }
    return context;
};
