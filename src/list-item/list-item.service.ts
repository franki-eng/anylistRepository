import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';
import { InjectRepository } from '@nestjs/typeorm';
import { ListItem } from './entities/list-item.entity';
import { Repository } from 'typeorm';
import { PaginationArgs } from '../common/dto/args/pagination.args';
import { SearchArgs } from '../common/dto/args/search.args';
import { List } from 'src/list/entities/list.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ListItemService {
  
  constructor (
    @InjectRepository(ListItem)
    private readonly listItemRepository: Repository<ListItem>
  ){}
  
  async create(createListItemInput: CreateListItemInput): Promise<ListItem> {
    
    const { itemId, listId, ...rest } = createListItemInput;
    
    const newListItem = await this.listItemRepository.create({
      ...rest, 
      item: { id: itemId }, 
      list: { id: listId },
    });

    await this.listItemRepository.save( newListItem );
    
    return await this.findOne( newListItem.id );
  }

  async findAll( list: List, paginationArgs: PaginationArgs, searchArgs: SearchArgs ): Promise<ListItem[]> {

    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;
    
    const queryBuilder = await this.listItemRepository.createQueryBuilder('listItem') // <-- Nombre para las relaciones
      .innerJoin('listItem.item','item') // <--- Lo añadí después, fue un problema que no grabé
      .take( limit )
      .skip( offset )
      .where(`"listId" = :listId`, { listId: list.id });

    if ( search ) {
      queryBuilder.andWhere('LOWER(item.name) like :name', { name: `%${ search.toLowerCase() }%` });
    }

    return  await queryBuilder.getMany();

  }

  async findOne( id: string ): Promise<ListItem> {
    const listItem = await this.listItemRepository.findOneBy({ id });

    if ( !listItem )
      throw new NotFoundException(`List item with Id: ${id} not found`);

    return listItem;
  }

  async update(id: string, updateListItemInput: UpdateListItemInput): Promise<ListItem> {

    const { listId, itemId, ...rest } = updateListItemInput;

    // const listItem = await this.listItemRepository.preload({
    //   ...rest,
    //   list: { id: listId },
    //   item: { id: itemId }
    // })

    const queryBuilder = await this.listItemRepository.createQueryBuilder('listItem')
      .update()
      .set( rest )
      .where('id = :id', { id });

      if ( listId )
        queryBuilder.set({ list: { id: listId }})

      if ( itemId )
        queryBuilder.set({ item: { id: itemId }})

    // await this.listItemRepository.save( listItem );s

    await queryBuilder.execute();
  
    return await this.findOne( id );
  }

  remove(id: number) {
    return `This action removes a #${id} listItem`;
  }

  async getCountItem( list: List ): Promise<number> {
    return await this.listItemRepository.count({
      where: { list: { id: list.id }
    }});
  }
}
