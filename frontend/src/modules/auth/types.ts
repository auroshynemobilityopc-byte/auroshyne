export type Role = "ADMIN" | "CUSTOMER" | "TECHNICIAN";

export interface User {
    id: string;
    name: string;
    role: Role;
    email: string;
    mobile: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    data: AuthTokens & {
        user: User;
    };
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface RefreshTokenResponse {
    success: boolean;
    data: {
        accessToken: string;
        refreshToken: string;
    };
}

export interface LogoutResponse {
    success: boolean;
    message: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export interface ApiError {
    success: false;
    message: string;
}
