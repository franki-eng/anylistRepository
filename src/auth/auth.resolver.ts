import { Mutation, Query, Resolver, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponse } from './types/auth-response.types';
import { SingUpInput } from './dto';
import { LoginInput } from './dto/inputs/login.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ValidRoles } from './enums/valid-roles.enum';

@Resolver( ()=> AuthResponse )
export class AuthResolver {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Mutation( ()=> AuthResponse, { name: 'singup'})
  async singUp(
    @Args('singUpInput') singUpInput: SingUpInput
  ): Promise<AuthResponse> {
    return await this.authService.signUp( singUpInput );
  }

  @Mutation( ()=> AuthResponse, { name: 'login'})
  async login(
    @Args('loginInput') loginInput: LoginInput
  ): Promise<AuthResponse> {
    return await this.authService.login(loginInput);
  }

  @Query( ()=> AuthResponse, { name: 'revalite' } )
  @UseGuards( JwtAuthGuard )
  evalidateToken(
    @CurrentUser([ValidRoles.admin]) user: User
  ): AuthResponse {
    return this.authService.revalidateToken(user); 
    // console.log(user);
  }

}
