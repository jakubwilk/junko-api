import { Body, Controller, Delete, Get, HttpStatus, Param, Put } from '@nestjs/common';
import { UsersAuthService } from './users-auth.service';
import { CreateUser } from '../types/users-auth.types';
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
        const { email, password, repeatPassword } = userData;

        await this.userDataValidation.validateUserByEmail(email);
        const action = await this.usersAuthService.createUser(email, password);
    
        if (action) {
            serverSuccessMessage(
                'User successfully created',
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
            serverSuccessMessage(
                'User successfully deleted',
                HttpStatus.OK
            );
        }

        serverErrorMessage();
    }
}
