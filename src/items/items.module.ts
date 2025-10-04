import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsResolver } from './items.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item]),
    AuthModule,
  ],
  providers: [
    ItemsResolver,
    ItemsService,
  ],
  exports: [
    ItemsService,
    TypeOrmModule,
  ]
})
export class ItemsModule {}
