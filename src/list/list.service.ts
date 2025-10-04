import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { Repository } from 'typeorm';
import { List } from './entities/list.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs } from '../common/dto/args/pagination.args';
import { SearchArgs } from '../common/dto/args/search.args';

@Injectable()
export class ListService {
  
  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>
  ) {}
  
  async create( createListInput: CreateListInput, user: User ): Promise< List > {
    const newList = await this.listRepository.create({ ...createListInput, user });

    return await this.listRepository.save( newList );
  }

  async findAll( user: User, paginationArgs: PaginationArgs, searchArgs: SearchArgs ): Promise<List[]> {
    
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = await this.listRepository.createQueryBuilder('list')
      .take( limit )
      .skip( offset )
      .where(`"userId" = :userId`, { userId: user.id });

    if ( search )
      queryBuilder.andWhere('LOWER(name) like :name', { name: `%${ search.toLowerCase }`});


    return await queryBuilder.getMany();

  }

  async findOne( id: string, user: User ): Promise<List> {
    
    const list = await this.listRepository.findOneBy({
      id, user: { id: user.id }
    })

    if ( !list )
      throw new NotFoundException(`List not exist, with id: ${ id }`);

    return list;
  }

  async update(id: string, updateListInput: UpdateListInput, user: User ): Promise<List> {
    
    await this.findOne( id, user );

    const list = await this.listRepository.preload({ ...updateListInput, user });

    if ( !list )
      throw new NotFoundException(`List with id: ${ id }`)

    return list;
  }

  async remove(id: string, user: User ) {
    
    const list = await this.findOne( id, user );
    await this.listRepository.remove( list );

    return { ...list, id};
  }

  async listCountByUser( user: User ): Promise<number>{

    return this.listRepository.count({
      where: { 
        user: { id: user.id} 
      }
    })

  }
}
