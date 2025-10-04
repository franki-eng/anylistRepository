import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Item } from 'src/items/entities/item.entity';
import { List } from 'src/list/entities/list.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users'})
@ObjectType()
export class User {
  
  @PrimaryGeneratedColumn('uuid')
  @Field( ()=> String )
  id: string;

  @Column('text')
  @Field( ()=> String) 
  fullName: string;

  @Column('text', { unique: true })
  @Field( ()=> String)
  email: string;

  @Column('text')
  // @Field( ()=> String)
  password: string;

  @Column('text', { default: ['user'], array: true})
  @Field( ()=> [String])
  roles: string[];

  @Column('boolean', { default: true })
  @Field( ()=> Boolean)
  isActive: boolean;


  // TODO: relaciones
  @ManyToOne( ()=> User, ( user ) => user.lastUpdateBy, { nullable: true, lazy: true } )
  @JoinColumn({ name: 'lastUpdateBy'})
  @Field( ()=> User, { nullable: true })
  lastUpdateBy?: User;

  @OneToMany( ()=> Item, (item)=> item.user, )
  // @Field( ()=> [Item] )
  items: Item[];

  @OneToMany( ()=> List, (list)=> list.user )
  // @Field( ()=> [List])
  list: List[];

}
