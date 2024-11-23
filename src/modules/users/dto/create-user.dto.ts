import { IsEmail } from "class-validator"

export class RegisterUserDto {
    @IsEmail({},{message: "Nhập đúng định dạng email"})
    email: string

    password: string

    repassword: string
    
    fullName: string
}
