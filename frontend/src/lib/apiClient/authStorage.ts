let accessToken: string | null = null;

export const setAccessToken = (token: string) => {
    accessToken = token;
    localStorage.setItem("accessToken", token);
};

export const getAccessToken = () => accessToken;

export const clearAccessToken = () => {
    accessToken = null;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
};

export const bootstrapAuth = () => {
    const token = localStorage.getItem("accessToken");
    if (token) accessToken = token;
};
