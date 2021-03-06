import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { UsersAuthService } from './users-auth.service';
import { CreateUser, EditUser } from '../types/users-auth.types';
import { UserDataValidation } from 'src/utils/validation/user-data-validation.service';
import { serverErrorMessage, serverSuccessMessage } from 'src/utils/messages/server-response-messages';
import { Users } from './users.entity';
import { Response } from 'express';
import { Roles } from 'src/guards/auth.decorator';
import { ROLES } from 'src/utils/constants/roles';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
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

    @Put('employee')
    @Roles(ROLES.OWNER)
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

    @Post('login')
    async loginUser(@Body() userData: CreateUser, @Res() res: Response) {
        const { email } = userData;

        await this.userDataValidation.validateExistEmail(email);
        await this.userDataValidation.validateUserPassword(userData);

        const action = await this.usersAuthService.loginUser(email);

        return res.header('Authorization', `Bearer ${action.token}`).status(HttpStatus.OK).json(action.data);
    }

    @Delete(':userId')
    @Roles(ROLES.PARTNER, ROLES.OWNER)
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
