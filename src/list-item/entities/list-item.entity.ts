import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { List } from 'src/list/entities/list.entity';
import { Item } from 'src/items/entities/item.entity';

@Entity('listItems')
@Unique('listItem-item', ['list', 'item'])
@ObjectType()
export class ListItem {
  

  @PrimaryGeneratedColumn('uuid')
  @Field( ()=> ID )
  id: string;

  @Column('numeric')
  @Field( ()=> Number )
  quantity: number;

  @Column({ type: 'boolean'})
  @Field( ()=> Boolean )
  completed: boolean;

  // relaciones
  @ManyToOne( ()=> List, (list)=> list.listItem, { lazy: true } )
  @Field( ()=> List )
  list: List;

  @ManyToOne( ()=> Item, (item)=> item.listItem, { lazy: true })
  @Field( ()=> Item )
  item: Item;
// @Unique('listItem-item', ['list','item']).
}
