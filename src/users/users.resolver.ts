import { Resolver, Query, Mutation, Args, Int, ID, ResolveField, Parent } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ValidRolesArgs } from './dto/args/roles.arg';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { UpdateUserInput } from './dto/update-user.input';
import { ItemsService } from 'src/items/items.service';
import { Item } from 'src/items/entities/item.entity';
import { PaginationArgs, SearchArgs } from 'src/common/dto';
import { ListService } from '../list/list.service';
import { List } from 'src/list/entities/list.entity';



@Resolver(() => User)
@UseGuards( JwtAuthGuard )
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemService: ItemsService,
    private readonly listService: ListService,
  ) {}

  @Query(() => [User], { name: 'users' })
  async findAll(
    @Args() validRoles: ValidRolesArgs,
    @CurrentUser([ ValidRoles.admin, ValidRoles.superUser ]) user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<User[]> {
    return this.usersService.findAll( validRoles.roles, paginationArgs, searchArgs );
  }

  @Query(() => User, { name: 'user' })
  async findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe ) id: string,
    @CurrentUser([ ValidRoles.admin, ValidRoles.superUser ]) user: User,
  ): Promise<User> {
    return this.usersService.findOneById( id );
  }

  @Mutation(() => User, { name: 'updateUser'})
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser([ ValidRoles.admin ]) user: User
  ) {
    return this.usersService.update( updateUserInput.id, updateUserInput, user);
  }

  @Mutation(() => User, { name: 'blockUser'})
  blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe ) id: string,
    @CurrentUser([ ValidRoles.admin, ValidRoles.superUser ]) user: User,
  ): Promise<User> {
    return this.usersService.block( id, user );
  }

  // este es un campo amarrado al User, es un campo si estar en el Entity, con el decorador parent, podemos obtener todos los datos del padre en este caso el user
  @ResolveField( ()=> Int, { name: 'itemCount'} )
  async ItemCount(
    @CurrentUser([ ValidRoles.admin ]) admin: User,
    @Parent() user: User,  
  ): Promise<number> {
    return await this.itemService.itemCountByUser(user);
  }

  @ResolveField( ()=> [Item], { name: 'items'} )
  async getItemsByUser(
    @CurrentUser([ ValidRoles.admin ]) admin: User,
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<Item[]> {
    return await this.itemService.findAll( user, paginationArgs, searchArgs );
  }

  @ResolveField( ()=> [List], { name: 'lists' })
  async getListByUser(
    @CurrentUser([ ValidRoles.admin ]) adminUser: User,
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs
  ): Promise<List[]> {
    return await this.listService.findAll( user, paginationArgs, searchArgs);
  }

  @ResolveField( ()=> Int, { name: 'listCount' })
  async listCount(
    @Parent() user: User,
  ): Promise<number> {
    return await this.listService.listCountByUser( user );
  }
}
