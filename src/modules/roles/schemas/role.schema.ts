import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CONFIG_PERMISSIONS } from 'src/config';

export type RoleDocument = HydratedDocument<Role>;

@Schema({collection: "roles"})
export class Role {
    @Prop()
    name: string
    
    @Prop({
        type: [String],
        enum: Object.values(CONFIG_PERMISSIONS).flatMap(Object.values),
        default: []
    })
    permissions: string[]

    @Prop()
    description: string

    @Prop({default: true})
    canDelete: boolean
}

export const RoleSchema = SchemaFactory.createForClass(Role);
