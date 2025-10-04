import { Resolver, Query, Mutation, Args, Int, ResolveField, ID, Parent } from '@nestjs/graphql';
import { ListService } from './list.service';
import { List } from './entities/list.entity';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { ItemsService } from '../items/items.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Item } from 'src/items/entities/item.entity';
import { PaginationArgs } from '../common/dto/args/pagination.args';
import { SearchArgs } from 'src/common/dto';
import { UsersService } from 'src/users/users.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { ListItemService } from '../list-item/list-item.service';

@Resolver(() => List)
@UseGuards( JwtAuthGuard )
export class ListResolver {
  constructor(
    private readonly listService: ListService,
    // private readonly itemsService: ItemsService,
    private readonly usersService: UsersService,
    private readonly listItemService: ListItemService,
  ) {}

  @Mutation(() => List)
  async createList(
    @Args('createListInput') createListInput: CreateListInput,
    @CurrentUser() user: User
  ): Promise<List> {
    return await this.listService.create( createListInput, user );
  }

  @Query(() => [List], { name: 'lists' })
  async findAll(
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
    @CurrentUser() user: User
  ): Promise<List[]> {
    return await this.listService.findAll( user, paginationArgs, searchArgs );
  }

  @Query(() => List, { name: 'list' })
  async findOne(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ): Promise<List> {
    return await this.listService.findOne( id, user );
  }

  @Mutation(() => List)
  async updateList(
    @Args('updateListInput') updateListInput: UpdateListInput,
    @CurrentUser() user: User,
  ): Promise<List> {
    return await this.listService.update( updateListInput.id, updateListInput, user );
  }

  @Mutation(() => List)
  async removeList(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ): Promise<List> {
    return await this.listService.remove( id, user );
  }

  // @ResolveField( ()=> Int, { name: 'totalItems' })
  // async itemCounts(
  //   @CurrentUser() user: User,
  // ) {
  //   return await this.itemsService.itemCountByUser( user );
  // }

  // @ResolveField( ()=> [Item], { name: 'items'})
  // async items(
  //   @CurrentUser() user: User,
  //   @Args() paginationArgs: PaginationArgs,
  //   @Args() searchArgs: SearchArgs,
  // ) {
  //   return await this.itemsService.findAll( user, paginationArgs, searchArgs );
  // }

  // aca estoy haciendo esta forma de optener los datos, sin la necesidad de tener el lazy para esta relacion, es como una forma de hacerlo. De esta manera es mas potente, que usando la forma del lazy
  @ResolveField( ()=> User, { name: 'user'})
  async user(
    @CurrentUser() user: User,
  ) {
    return await this.usersService.findOneById( user.id );
  }

  @ResolveField( ()=> [ListItem], { name: 'items'} )
  async getListItems(
    @Parent() list: List,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<ListItem[]> {
    // console.log({list})
    return await this.listItemService.findAll( list, paginationArgs, searchArgs );
  }

  @ResolveField( ()=> Int, { name: 'totalItems' } )
  async getCountTotalItem(
    @Parent() list: List,
  ) {
    return await this.listItemService.getCountItem( list  );
  }
}
