import { ObjectType, Field, Int, ID, Float } from '@nestjs/graphql';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { List } from 'src/list/entities/list.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'items'})
@ObjectType()
export class Item {
  
  @PrimaryGeneratedColumn('uuid')
  @Field( ()=> ID )
  id: string;
  
  @Column('text')
  @Field( ()=> String )
  name: string;

  // @Column('int')
  // @Field( ()=> Float )
  // quantity: number;
  
  @Column('text', { nullable: true })
  @Field( ()=> String, { nullable: true} )
  quantityUnits?: string;


  @ManyToOne( ()=> User, (user)=> user.items, { nullable: false, lazy: true } )
  @Index('userId-index')
  @Field( ()=> User )
  user: User;

  @OneToMany( ()=> ListItem, (lisItem)=> lisItem.item, { lazy: true } )
  @Field( ()=> [ListItem] )
  listItem: ListItem[];

}
