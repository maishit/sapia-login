import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Factory } from 'nestjs-seeder';

@Schema()
export class Users extends Document {
  @Factory((faker) => faker.person.firstName())
  @Prop({ unique: true, required: true })
  username: string;

  @Factory((faker, ctx) => `${ctx.passwordSrv.hashPassword('123456')}`)
  @Prop({ required: true })
  password: string;

  @Factory(() => 0)
  @Prop()
  lockUntil?: number;

  @Factory(() => 0)
  @Prop({ default: 0 })
  attemptTimes: number;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
