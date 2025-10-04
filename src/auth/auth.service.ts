import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SingUpInput } from './dto/inputs/singUp.input';
import { AuthResponse } from './types/auth-response.types';
import { LoginInput } from './dto/inputs/login.input';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
    
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    private getJwtToken( userId: string ){
        return this.jwtService.sign({id: userId});
    }

    async signUp( singUpInput: SingUpInput ): Promise<AuthResponse> {
        
        const user = await this.userService.create(singUpInput);
        console.log({user})


        const token = this.getJwtToken(user.id)

        return { user, token };
    }

    async login( loginInput: LoginInput ): Promise<AuthResponse> {
        
        const user = await this.userService.findOneByEmail(loginInput.email);
        
        if ( !bcrypt.compareSync(loginInput.password, user.password) )
            throw new BadRequestException('Email/Password do not match')

        const token = this.getJwtToken(user.id);
        return { user, token };
    }

    revalidateToken( user: User ): AuthResponse {
      
        const token = this.getJwtToken( user.id );

        return {
            token,
            user
        }

    }

    async validateUser( id: string ): Promise<Omit<User, 'password'>> {

        const user = await this.userService.findOneById( id );

        if ( !user.isActive ) throw new UnauthorizedException(`User is inactive, talk with an admin`);

        const { password, ...cleanUser } = user

        return cleanUser;
    }

}
