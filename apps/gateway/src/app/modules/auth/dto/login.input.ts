import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class LoginInput {
  @Field()
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @Field()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password!: string;
}
