
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsNotEmpty } from 'class-validator';
import mongoose, { HydratedDocument } from 'mongoose';
import { CONFIG_ACCOUNT_TYPE } from 'src/config';
import { Role } from 'src/modules/roles/schemas/role.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({timestamps: true, collection: "users"})
export class User {
    @Prop({required: true})
    @IsNotEmpty({message: "Email bắt buộc nhập"})
    @IsEmail({},{message: "Nhập đúng định dạng email"})
    email: string;

    @Prop()
    password: string;

    @Prop({
        type: String,
        slug: "fullName",
        /*
        Thuộc tính permanent true để khi fullName thay đổi thì slug vẫn giữ nguyên không bị đổi theo
        Thuộc tính slugPaddingSize để thêm số số ký tự vào sau nếu bị trùng lặp
        */
        permanent: true,
        slugPaddingSize: 15,
        unique: true,
    })
    slug: string;

    @Prop()
    fullName: string;

    @Prop({default: 0})
    money: number

    @Prop({
        required: true,
        enum: Object.values(CONFIG_ACCOUNT_TYPE).flatMap(Object.values)
    })
    type: string

    @Prop({default: "dfAvatar.jpg"})
    avatar: string

    @Prop()
    bio: string

    @Prop({default: false})
    banned: boolean

    @Prop({default: 0})
    quantityFollow: number

    @Prop({default: [], type: [mongoose.Schema.Types.ObjectId], ref: User.name})
    follow: mongoose.Schema.Types.ObjectId[]

    @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: Role.name})
    role: mongoose.Schema.Types.ObjectId
}

export const UserSchema = SchemaFactory.createForClass(User);
