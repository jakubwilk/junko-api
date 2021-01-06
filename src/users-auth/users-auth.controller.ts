import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { UsersAuthService } from './users-auth.service';
import { CreateUser, EditUser } from '../types/users-auth.types';
import { UserDataValidation } from 'src/utils/validation/user-data-validation.service';
import { serverErrorMessage, serverSuccessMessage } from 'src/utils/messages/server-response-messages';

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
        const { email } = userData;

        await this.userDataValidation.validateUserByEmail(email);
        const action = await this.usersAuthService.createUser(userData);
    
        if (action) {
            return serverSuccessMessage(
                'User successfully created',
                HttpStatus.OK
            );
        }

        serverErrorMessage();
    }

    @Post()
    async updateUser(@Body() userData: EditUser) {
        const { userId } = userData;
        await this.userDataValidation.validateUserById(userId);

        const action = await this.usersAuthService.editUser(userData);
        console.log(action);

        if (action) {
            return serverSuccessMessage(
                'User successfully updated',
                HttpStatus.OK
            );
        }

        serverErrorMessage();
    }

    @Delete(':userId')
    async deleteUser(@Param('userId') userId: string) {
        await this.userDataValidation.validateUserById(userId);

        const action = await this.usersAuthService.deleteUser(userId);
        
        if (action) {
            return serverSuccessMessage(
                'User successfully deleted',
                HttpStatus.OK
            );
        }

        serverErrorMessage();
    }
}
