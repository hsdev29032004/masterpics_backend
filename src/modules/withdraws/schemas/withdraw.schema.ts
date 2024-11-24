import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { CONFIG_PERMISSIONS } from 'src/config';
import { User } from 'src/modules/users/schemas/user.schema';

export type WithdrawDocument = HydratedDocument<Withdraw>;

@Schema({collection: "withdraws", timestamps: true})
export class Withdraw {
    @Prop({required: true})
    money: number
    
    @Prop({default: false})
    status: boolean

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: User.name})
    user: mongoose.Schema.Types.ObjectId
}

export const WithdrawSchema = SchemaFactory.createForClass(Withdraw);