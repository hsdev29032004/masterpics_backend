export interface IPost {
    _id: string;
    slug: string;
    title: string;
    price: number;
    description: string;
    image: string;
    watermark: string;
    quantityBuy: number;
    deleted: boolean;
    idUser: string;
    createdAt: Date;
}