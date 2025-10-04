import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput } from './dto/inputs/create-item.input';
import { UpdateItemInput } from './dto/inputs/update-item.input';
import { Item } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs, SearchArgs } from 'src/common/dto';

@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ){}

  async create( createItemInput: CreateItemInput, user: User ): Promise<Item> {
    try {
      // console.log('yara')

      const newItem = await this.itemRepository.create({ ...createItemInput, user });

      //  newItem.user = user;

      await this.itemRepository.save(newItem);
      return newItem;
    } catch (error) {
      throw new BadRequestException(error);
    }
    
  }

  async findAll( user: User, paginationArgs: PaginationArgs, searchArgs: SearchArgs ): Promise<Item[]> {
    // TODO: filtrar y hacer paginacion
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;
    
    const queryBuilder = this.itemRepository.createQueryBuilder()
      .take( limit )
      .skip( offset )
      .where(`"userId" = :userId`, { userId: user.id });

      if ( search )
        queryBuilder.andWhere('LOWER(name) like :name', { name: `%${ search?.toLowerCase() }%`})
      
    return queryBuilder.getMany();

    // return await this.itemRepository.find({
    //   take: limit,
    //   skip: offset,
    //   where: {
    //     user: { id : user.id },
    //     name: Like(`%${ search }%`),
    //   },
    //   relations: { user: true }
    // });
  }

  async findOne( id: string, user: User ): Promise<Item>{
    const item = await this.itemRepository.findOneBy({ id, user: { id: user.id },
     });

    if ( !item ) throw new NotFoundException(`Item with ${id} not found`);

    //  item.ser = user;

    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput, user: User ): Promise<Item> {
    // aca es un preload, es como un findOneBy, buscamos y si hay campos en el dto, bueno los actualiza con los datos que estan cargados
    await this.findOne( id, user );
    const item = await this.itemRepository.preload( updateItemInput );

    if ( !item ) throw new NotFoundException(`Item with ${id} not found`)

    return this.itemRepository.save( item );
  }

  async remove(id: string, user: User ): Promise<Item> {
    // TODO: soft delete, integridad referencial
    const item = await this.findOne( id, user );

    await this.itemRepository.remove( item );
    return {...item, id};
  }

  async itemCountByUser( user: User ): Promise<number> {
    return await this.itemRepository.count({
      where: { 
        user: { id: user.id } 
      }
    })
  }

}
