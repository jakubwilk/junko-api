import { Body, Controller, Put } from '@nestjs/common';
import { UsersAuthService } from './users-auth.service';
import { CreateUser } from '../types/users-auth.types';

@Controller('user')
export class UsersAuthController {
    constructor(private readonly usersAuthService: UsersAuthService) {}

    @Put()
    async createUser(@Body() userData: CreateUser) {
        const { email, password, repeatPassword } = userData;
        const isRegisterAction = true;

        await this.usersAuthService.validateExistingUser(
            email,
            isRegisterAction,
        );
        await this.usersAuthService.validateNewUserPasswords(
            password,
            repeatPassword,
        );

        return 'test';
    }

    // @Post('create')
    // getUsers(@Body() user: CreateUser) {
    //     const { email, password, firstName, lastName } = user;
    //     return this.usersAuthService.create(
    //         email,
    //         password,
    //         firstName,
    //         lastName,
    //     );
    // }
}
