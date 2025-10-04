import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ItemsModule } from 'src/items/items.module';
import { ListModule } from 'src/list/list.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef( () => AuthModule ),
    forwardRef( () => ItemsModule ),
    forwardRef( () => ListModule ),
  ],
  providers: [UsersResolver, UsersService],
  exports: [ 
    UsersService,
    TypeOrmModule,
  ],
})
export class UsersModule {}
