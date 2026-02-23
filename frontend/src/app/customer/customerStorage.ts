export const getCustomerToken = () => {
    return localStorage.getItem("customerToken");
};

export const setCustomerToken = (token: string) => {
    localStorage.setItem("customerToken", token);
};

export const getCustomerRefreshToken = () => {
    return localStorage.getItem("customerRefreshToken");
};

export const setCustomerRefreshToken = (token: string) => {
    localStorage.setItem("customerRefreshToken", token);
};

export const clearCustomerToken = () => {
    localStorage.removeItem("customerToken");
    localStorage.removeItem("customerRefreshToken");
    localStorage.removeItem("customerUser");
};
