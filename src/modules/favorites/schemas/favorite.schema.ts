import { Post } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';

export type FavoriteDocument = HydratedDocument<Favorite>;

@Schema({collection: "favorites"})
export class Favorite {
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: User.name})
    idUser: mongoose.Schema.Types.ObjectId

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: Post.name})
    idPost: mongoose.Schema.Types.ObjectId
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);