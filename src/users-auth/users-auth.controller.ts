import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { UsersAuthService } from './users-auth.service';
import { CreateUser } from '../types/users-auth.types';
import { UserDataValidation } from 'src/utils/validation/user-data-validation.service';

@Controller('auth')
export class UsersAuthController {
    constructor(
        private readonly usersAuthService: UsersAuthService,
        private readonly userDataValidation: UserDataValidation
    ) {}

    // Todo: remove after tests
    @Get()
    async usersList() {
        return await this.usersAuthService.getUsersList();
    }

    @Put()
    async createUser(@Body() userData: CreateUser) {
        const { email, password, repeatPassword } = userData;

        await this.userDataValidation.validateUserByEmail(email);
        return await this.usersAuthService.createUser(email, password);
    }

    @Delete(':userId')
    async deleteUser(@Param('userId') userId: string) {
        await this.userDataValidation.validateUserById(userId);

        return await this.usersAuthService.deleteUser(userId);
    }
}
