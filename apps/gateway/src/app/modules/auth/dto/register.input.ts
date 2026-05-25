import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

@InputType()
export class RegisterInput {
  @Field()
  @IsString()
  firstName!: string;

  @Field()
  @IsString()
  lastName!: string;

  @Field()
  @IsString()
  employeeId!: string;

  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @MinLength(6)
  password!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}