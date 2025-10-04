import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SingUpInput } from '../auth/dto/inputs/singUp.input';
import * as bcrypt from 'bcrypt';
import { ValidRolesArgs } from './dto/args/roles.arg';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { PaginationArgs } from '../common/dto/args/pagination.args';
import { SearchArgs } from '../common/dto/args/search.args';


@Injectable()
export class UsersService {
  
  private logger: Logger = new Logger();

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ){}
  
  async create( singUpInput: SingUpInput ): Promise<User> {
    
    try {
      const newUser = await this.userRepository.create({...singUpInput,
        password: bcrypt.hashSync(singUpInput.password, 10 ),
      });

      await this.userRepository.save(newUser);
      return newUser;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll( roles: ValidRoles[], paginationArgs: PaginationArgs, searchArgs: SearchArgs ): Promise<User[]> {
    
    const { limit, offset } = paginationArgs
    const { search } = searchArgs;
    const queryBuilder = this.userRepository.createQueryBuilder('users');

    queryBuilder
      .take( limit )
      .skip( offset );

    if ( roles.length > 0 )
      queryBuilder
      .andWhere('ARRAY[roles] && ARRAY[:...roles]')
      .setParameter('roles', roles)

    if ( search )
      queryBuilder.andWhere('LOWER(users.fullName) like :fullName', { fullName:`%${ search.toLowerCase() }%`});

    return queryBuilder.getMany();
  }

  async findOneByEmail( email: string): Promise<User> {
    try {

      // aca tambien se puede usar el findOneOrFail, el cual si no lo encuentra suelte el error
      const user = await this.userRepository.findOneByOrFail({email})

      return user;
    } catch (error) {
      this.handleDBErrors({
        code:'error-01',
        detail: `${email} not found`
      });
      // throw new NotFoundException(`${email} not found`)
    }
  }

  async findOneById( id: string): Promise<User> {
    try {

      // aca tambien se puede usar el findOneOrFail, el cual si no lo encuentra suelte el error
      const user = await this.userRepository.findOneByOrFail({id})
      return user;
    } catch (error) {
      this.handleDBErrors({
        code:'error-01',
        detail: `${id} not found`
      });
      // throw new NotFoundException(`${email} not found`)
    }
  }


  async update( id: string , updateUserInput: UpdateUserInput, user: User): Promise<User> {
    //TODO: updateBy
    try {
      const updateUser = await this.userRepository.preload({...updateUserInput, id})
      
      if ( !updateUser ) throw new BadRequestException(`User with id: ${id} can't updated`);

      updateUser.lastUpdateBy = user;
      return this.userRepository.save( updateUser );
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async block( id: string, AdminUser: User ): Promise<User> {
    
    const userToBlock = await this.findOneById( id );
    userToBlock.isActive = false;
    userToBlock.lastUpdateBy = AdminUser;
    return await this.userRepository.save( userToBlock );

  }

  private handleDBErrors( error: any ): never {

    if ( error.code === '232505' ){
      throw new BadRequestException( error.detail.replace('key', ''));
    }

    if ( error.code === 'error-01' ){
      throw new BadRequestException( error.detail.replace('key', ''));
    }

    this.logger.error( error );
    throw new InternalServerErrorException('Please check server logs');

  }

}
