import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { CONFIG_ICON } from 'src/config';
import { User } from 'src/modules/users/schemas/user.schema';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({collection: "notifications", timestamps: true})
export class Notification {
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: User.name})
    user: mongoose.Schema.Types.ObjectId
    
    @Prop()
    link: string

    @Prop({required: true})
    content: string

    @Prop({default: false})
    isRead: boolean

    @Prop({
        default: CONFIG_ICON.SYSTEM,
        enum: Object.values(CONFIG_ICON)
    })
    icon: string
}

export const NotificationSchema = SchemaFactory.createForClass(Notification); 