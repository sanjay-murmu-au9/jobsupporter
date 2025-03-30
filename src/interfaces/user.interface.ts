export interface IUser {
    id?: string;
    email: string;
    password: string;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IUserToken {
    id: string;
    email: string;
    name: string;
}

export interface IDecodedToken {
    uid: string;
    email: string;
    name: string;
    iat: number;
    exp: number;
}

export interface UserInterface {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserResponse {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}
