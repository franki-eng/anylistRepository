import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";


@InputType()
export class SingUpInput {

    @Field( ()=> String )
    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string;
    
    @Field( ()=> String )
    @IsNotEmpty()
    @IsString()
    fullName: string;

    @Field( ()=> String )
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;

}