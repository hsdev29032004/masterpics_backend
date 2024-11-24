import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { CONFIG_PERMISSIONS } from 'src/config';
import { User } from 'src/modules/users/schemas/user.schema';

export type PostDocument = HydratedDocument<Post>;

@Schema({timestamps: true, collection: "posts"})
export class Post {
    @Prop()
    title: string
    
    @Prop({
        type: String,
        slug: "title",
        permanent: true,
        slugPaddingSize: 15,
        unique: true,
    })
    slug: string;

    @Prop()
    price: number

    @Prop()
    description: string

    @Prop()
    image: string

    @Prop()
    watermark: string

    @Prop({default: 0})
    quantityBuy: number

    @Prop({default: false})
    deleted: boolean

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: User.name})
    user: mongoose.Schema.Types.ObjectId
}

export const PostSchema = SchemaFactory.createForClass(Post);
