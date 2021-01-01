export interface loggedUser {
    email: string;
    role: string;
    statusActive: boolean;
    statusBanned: boolean;
    created: Date;
    updated: Date;
}