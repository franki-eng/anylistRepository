import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageProductionDefault } from '@apollo/server/plugin/landingPage/default';
import { join } from 'path';
import { ItemsModule } from './items/items.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { SeedModule } from './seed/seed.module';
import { CommonModule } from './common/common.module';
import { ListModule } from './list/list.module';
import { ListItemModule } from './list-item/list-item.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      // se pondria ssl si asi lo quiere
      /* ssl: (process.env.STATE === 'prod')?
      {
        rejectUnauthorized: false,
        sslmode: 'required',
      }: false as any, */
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      autoLoadEntities: true,
    }),

    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [ AuthModule ],
      inject: [ JwtService ],
      useFactory:async ( jwtService: JwtService ) => {
        const isDev = process.env.STATE === 'dev';
        
        return {
          playground: false,
          introspection: isDev,
          autoSchemaFile: join( process.cwd(), 'src/schema.gql'),
          plugins: [
            isDev? ApolloServerPluginLandingPageLocalDefault()
            : ApolloServerPluginLandingPageProductionDefault(),
          ],
          context({req}: { req: Request }) {
            // forma de seguridad de graphql
            // const token = req.headers.authorization?.replace('Bcearer ', '');
            // if ( !token ) throw Error('Token needed');
            // const payload = jwtService.decode( token );
            // if ( !payload ) throw Error('Token not valid');
          }
        }
      }
    }),

    //TODO: configuracion basic
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   playground: false,
    //   autoSchemaFile: join( process.cwd(), 'src/schema.gql'),
    //   plugins: [
    //     ApolloServerPluginLandingPageLocalDefault()
    //   ]
    // }),
    ItemsModule,
    UsersModule,
    AuthModule,
    SeedModule,
    CommonModule,
    ListModule,
    ListItemModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {

  constructor() {
    console.log("STATE : ", process.env.STATE);
    console.log("host : ", process.env.DB_HOST);
    console.log("port : ", process.env.DB_PORT);
    console.log("userName : ", process.env.DB_PORT);
    console.log("password : ", process.env.DB_PASSWORD);
    console.log("database : ", process.env.DB_NAME);
  }

}
