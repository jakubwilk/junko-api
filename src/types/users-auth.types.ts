export type CreateUser = {
    email: string;
    password: string;
};

export type EditUser = {
    userId: string;
    role: string;
    isActive: boolean;
    isBanned: boolean;
}