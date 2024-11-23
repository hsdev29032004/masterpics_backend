import { Transform } from "class-transformer"

export class CreatePostDto {
    title: string
    @Transform(({ value }) => parseInt(value)) 
    price: number
    description: string
}
