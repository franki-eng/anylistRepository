import { Mutation, Resolver } from '@nestjs/graphql';
import { SeedService } from './seed.service';

@Resolver()
export class SeedResolver {
  constructor(private readonly seedService: SeedService) {}

  @Mutation( ()=> Boolean, { name: 'executedSeed', description: 'Ejecuta la construccion de la base de datos'})
  async executedSeed(): Promise<Boolean> {
    await this.seedService.executedSeed();
    return true;
  }


}
