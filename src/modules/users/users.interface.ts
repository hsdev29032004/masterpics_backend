import { Types } from 'mongoose';
import { IRole } from '../roles/roles.interface';

export interface IUser {
    _id: string;
    email: string;
    password?: string;
    slug: string;
    fullName: string;
    money: number;
    type: string;
    avatar: string;
    bio?: string;
    banned: boolean;
    quantityFollow: number;
    refreshToken?: string;
    follow: string[];
    role: IRole;
    createdAt?: Date;
    updatedAt?: Date;
}
