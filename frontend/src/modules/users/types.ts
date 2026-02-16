export type UserRole = "ADMIN" | "CUSTOMER";

export interface User {
    _id: string;
    name: string;
    mobile: string;
    email: string;
    role: UserRole;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface UserListResponse {
    success: boolean;
    data: User[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

export interface UserResponse {
    success: boolean;
    data: User;
}
