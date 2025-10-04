import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";


@InputType()
export class LoginInput {

    @Field( ()=> String )
    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string;

    @Field( ()=> String )
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;

}