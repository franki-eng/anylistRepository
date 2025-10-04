import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { SEED_ITEMS, SEED_LISTS, SEED_USERS } from './data/seed-data';
import { UsersService } from 'src/users/users.service';
import { ItemsService } from 'src/items/items.service';
import { ListService } from 'src/list/list.service';
import { ListItemService } from 'src/list-item/list-item.service';
import { List } from 'src/list/entities/list.entity';
import { ListItem } from 'src/list-item/entities/list-item.entity';

@Injectable()
export class SeedService {

    private isProd: Boolean;

    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(Item)
        private readonly itemsRepository: Repository<Item>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(List)
        private readonly listRepository: Repository<List>,
        @InjectRepository(ListItem)
        private readonly listItemRepository: Repository<ListItem>,
        private readonly userService: UsersService,
        private readonly itemService: ItemsService,
        private readonly listService: ListService,
        private readonly listItemService: ListItemService,
    ) {
        this.isProd = configService.get('STATE') === 'prod';
    }


    async executedSeed(){
        if ( this.isProd ){
            throw new UnauthorizedException('Me cannot run SEED in Prod')
        }

        await this.deleteDatabase();
        const user = await this.loadUser();
        await this.loadItem( user );
        const list = await this.loadList( user );
        const items = await this.itemService.findAll( user, { limit:10, offset:0 }, {})
        await this.loadListItems( list, items );
    }

    async deleteDatabase() {
        
        // borar ListItems
        await this.listItemRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute()
        
        // boara List
        await this.listRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute()
        
        // borar items
        await this.itemsRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();

        // borar usuarios
        await this.userRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();
    }

    async loadListItems( list: List, items: Item[] ) {

        for(const item of items){
            this.listItemService.create({
                quantity: Math.round( Math.random() * 10 ),
                completed: Math.round( Math.random() * 1) == 1 ? true : false,
                listId: list.id,
                itemId: item.id
            })
        }

    }

    async loadList( user: User ): Promise<List> {

        const lists: List[] = [];

        for ( const list of SEED_LISTS ){
            lists.push( await this.listService.create( list, user ))
        }

        return lists[0];
    }

    async loadUser(): Promise<User> {

        const users: User[] = [];

        for(const user of SEED_USERS) {
            users.push( await this.userService.create( user ) )
        }

        return users[0];
    }


    async loadItem( user: User ): Promise<void> {
        const items:any = [];

        for (const item of SEED_ITEMS) {
            items.push(
                this.itemService.create(
                    {
                        ...item,
                        quantityUnits: item.quantityUnits ?? undefined
                    },
                    user
                )
            );
        }

        await Promise.all( items );
    }
}
