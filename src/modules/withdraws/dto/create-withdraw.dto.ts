import { Transform } from "class-transformer";

export class CreateWithdrawDto {
    @Transform(({ value }) => parseInt(value))
    money: number

    bank: string

    cardNumber: string
}
