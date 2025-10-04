import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Item } from 'src/items/entities/item.entity';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'list'})
@ObjectType()
export class List {

  @PrimaryGeneratedColumn('uuid')
  @Field( ()=> ID )
  id: string;

  @Column('text')
  @Field( ()=> String )
  name: string;

  @ManyToOne( ()=> User, (user)=> user.list, { nullable: false } )
  @Index('userId-list-index')
  // @Field( ()=> User )
  user: User;

  @OneToMany( ()=> ListItem, (lisItem)=> lisItem.list, { lazy: true } )
  // @Field( ()=> [ListItem] )
  listItem: ListItem[];

}
