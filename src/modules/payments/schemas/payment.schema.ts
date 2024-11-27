import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Post } from 'src/modules/posts/schemas/post.schema';
import { User } from 'src/modules/users/schemas/user.schema';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema({collection: "payments", timestamps: true})
export class Payment {
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: User.name})
    buyer: mongoose.Schema.Types.ObjectId

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: User.name})
    seller: mongoose.Schema.Types.ObjectId

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: Post.name})
    post: mongoose.Schema.Types.ObjectId

    /**
     * PHẢI LƯU CẢ GIÁ VÀ ẢNH VÌ KHI USER THAY ĐỔI GIÁ HOẶC ẢNH THÌ TRUY VẤN RA SẼ BỊ THAY ĐỔI THEO -> KHÔNG ĐÚNG LOGIC
     */
    @Prop()
    price: number

    @Prop()
    image: string
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);