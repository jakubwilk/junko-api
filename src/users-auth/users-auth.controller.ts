import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { UsersAuthService } from './users-auth.service';
import { CreateUser } from '../types/users-auth.types';

@Controller('auth')
export class UsersAuthController {
    constructor(private readonly usersAuthService: UsersAuthService) {}

    // Todo: remove after tests
    @Get()
    async usersList() {
        return await this.usersAuthService.getUsersList();
    }

    @Put()
    async createUser(@Body() userData: CreateUser) {
        const { email, password, repeatPassword } = userData;

        await this.usersAuthService.validateExistingRegisterUserEmail(email);
        await this.usersAuthService.validateNewUserPasswords(
            password,
            repeatPassword,
        );

        return await this.usersAuthService.createUser(email, password);
    }

    @Delete(':userId')
    async deleteUser(@Param('userId') userId: string) {
        await this.usersAuthService.validateExistingUserById(userId);

        return await this.usersAuthService.deleteUser(userId);
    }
}
