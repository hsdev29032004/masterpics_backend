import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CONFIG_PERMISSIONS } from 'src/config';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema({collection: "payments"})
export class Payment {
    @Prop()
    name: string
    
    @Prop({
        type: [String],
        enum: Object.values(CONFIG_PERMISSIONS).flatMap(Object.values)
    })
    permissions: string[]

    @Prop()
    description: string
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);