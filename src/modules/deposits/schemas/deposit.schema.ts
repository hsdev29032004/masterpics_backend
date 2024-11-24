import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { CONFIG_PERMISSIONS } from 'src/config';
import { User } from 'src/modules/users/schemas/user.schema';

export type DepositDocument = HydratedDocument<Deposit>;

@Schema({collection: "deposits", timestamps: true})
export class Deposit {
    @Prop({required: true})
    money: number
    
    @Prop({default: false})
    status: boolean

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: User.name})
    user: mongoose.Schema.Types.ObjectId
}

export const DepositSchema = SchemaFactory.createForClass(Deposit);