import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

@InputType()
export class CreateItemInput {
  
  @Field( ()=> String, { description: 'Name for Item'} )
  @IsNotEmpty()
  @IsString()
  name: string;

  // @Field( ()=> Float )
  // @IsNumber()
  // @IsPositive()
  // quantity: number;

  @Field( ()=> String, { nullable: true } )
  @IsOptional()
  @IsString()
  quantityUnits?: string;
}
