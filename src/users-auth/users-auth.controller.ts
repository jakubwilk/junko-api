import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersAuthService } from './users-auth.service';

type CreateUser = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

@Controller('users-auth')
export class UsersAuthController {
    constructor(private readonly usersAuthService: UsersAuthService) {}

    @Post('create')
    getUsers(@Body() user: CreateUser) {
        const { email, password, firstName, lastName } = user;
        return this.usersAuthService.create(email, password, firstName, lastName);
    }
}
