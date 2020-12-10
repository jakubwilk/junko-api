import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './users.entity';
import { CreateUser } from '../types/users-auth.types';

@Injectable()
export class UsersAuthService {
    constructor(
        @InjectRepository(Users)
        private usersAuthRepository: Repository<Users>,
    ) {}

    async validateExistingRegisterUser(email: string) {
        const user = await this.usersAuthRepository.findOne({ email: email });

        if (user) {
            throw new HttpException(
                {
                    message: ['User with this email address already exists'],
                    error: 'Bad Request',
                    field: null,
                },
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async validateNewUserPasswords(password: string, repeatPassword: string) {
        if (password !== repeatPassword) {
            throw new HttpException(
                {
                    message: ['Passwords must be the same'],
                    error: 'Bad Request',
                    field: 'password',
                },
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async getUsersList() {
        const users = await this.usersAuthRepository.find();

        if (users.length === 0) {
            return 'Not found';
        }

        return users;
    }

    async createUser(email: string, password: string) {
        const account = new Users();
        account.email = email;
        account.password = password;
        account.role = 'BUSINESS_USER';

        const user = await this.usersAuthRepository.save(account);

        if (!user) {
            throw new HttpException(
                {
                    message: [
                        'Server encountered a problem while creating a new user',
                    ],
                    error: 'Internal Server Error',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        // Todo: return user obj
        return {
            message: ['User successfully created'],
            error: '',
            status: 200,
        };
    }
}
