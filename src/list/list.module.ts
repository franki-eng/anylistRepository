import { Module, forwardRef } from '@nestjs/common';
import { ListService } from './list.service';
import { ListResolver } from './list.resolver';
import { ItemsModule } from 'src/items/items.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { UsersModule } from 'src/users/users.module';
import { ListItemModule } from 'src/list-item/list-item.module';

@Module({
  providers: [ListResolver, ListService],
  imports: [ 
    forwardRef( ()=> ItemsModule ),
    TypeOrmModule.forFeature([List]),
    forwardRef( () => UsersModule ),
    ListItemModule,
   ],
   exports: [ ListService, TypeOrmModule ],
})
export class ListModule {}
