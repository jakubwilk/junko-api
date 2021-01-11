import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { UsersAuthService } from './users-auth.service';
import { CreateUser, EditUser } from '../types/users-auth.types';
import { UserDataValidation } from 'src/utils/validation/user-data-validation.service';
import { serverErrorMessage, serverSuccessMessage } from 'src/utils/messages/server-response-messages';
import { Users } from './users.entity';
import { Response } from 'express';

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

    @Put('/employee')
    async addPartnerUser(@Body() userEmail: string) {
        await this.userDataValidation.validateUserByEmail(userEmail);

        // Todo: send activation email
        return "ok";
    }

    @Put()
    async createUser(@Body() userData: CreateUser) {
        const { email } = userData;

        await this.userDataValidation.validateUserByEmail(email);
        const action = await this.usersAuthService.createUser(userData);
    
        if (!action) {
            serverErrorMessage();
        }

        const user = action as Users;

        return serverSuccessMessage(
            'User successfully created',
            HttpStatus.OK,
            user
        );
    }

    @Post()
    async updateUser(@Body() userData: EditUser) {
        const { userId } = userData;
        await this.userDataValidation.validateUserById(userId);

        const action = await this.usersAuthService.editUser(userData);

        if (!action) {
            serverErrorMessage();
        }

        const user = action as Users;

        return serverSuccessMessage(
            'User successfully updated',
            HttpStatus.OK,
            user
        );
    }

    @Post('/login')
    async loginUser(@Body() userData: CreateUser, @Res() res: Response) {
        const { email, password } = userData;

        await this.userDataValidation.validateExistEmail(email);
        await this.userDataValidation.validateUserPassword(password);

        const action = await this.usersAuthService.loginUser(email);

        res.set('Authorization', `Bearer ${action.token}`);
        return action.data;
    }

    @Delete(':userId')
    async deleteUser(@Param('userId') userId: string) {
        await this.userDataValidation.validateUserById(userId);

        const action = await this.usersAuthService.deleteUser(userId);
        
        if (!action) {
            serverErrorMessage();
        }

        const user = action as Users;

        return serverSuccessMessage(
            'User successfully marked as deleted',
            HttpStatus.OK,
            user
        );
    }
}
