import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

@InputType()
export class CreateListItemInput {

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Field( ()=> Number, { nullable: true } )
  quantity: number = 0;

  @IsOptional()
  @IsBoolean()
  @Field( ()=> Number, { nullable: true } )
  completed: boolean = false;

  @IsNotEmpty()
  @IsUUID()
  @Field( ()=> ID)
  listId: string;

  @IsNotEmpty()
  @IsUUID()
  @Field( ()=> ID)
  itemId: string;

}
