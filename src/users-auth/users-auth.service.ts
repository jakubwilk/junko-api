import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './users.entity';

@Injectable()
export class UsersAuthService {
    constructor(
        @InjectRepository(Users)
        private usersAuthRepository: Repository<Users>,
    ) {}

    async validateExistingUser(email: string, registerAction: boolean) {
        const user = await this.usersAuthRepository.findOne({ email: email });

        if (!user) {
            throw new HttpException(
                {
                    message: registerAction
                        ? ['User with this email address already exists']
                        : ['User with this email address not found'],
                    error: 'Bad Request',
                    field: registerAction ? null : 'email',
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

    // async create(
    //     email: string,
    //     password: string,
    //     firstName: string,
    //     lastName: string,
    // ) {
    //     const user = new Users();
    //     user.email = email;
    //     user.password = password;
    //     user.first_name = firstName;
    //     user.last_name = lastName;
    //
    //     const createUser = await this.usersAuthRepository.save(user);
    //
    //     if (!createUser) {
    //         throw new HttpException(
    //             {
    //                 message: [
    //                     'Server encountered a problem while creating a new user',
    //                 ],
    //                 error: 'Internal Server Error',
    //             },
    //             HttpStatus.INTERNAL_SERVER_ERROR,
    //         );
    //     }
    //
    //     return {
    //         message: ['Account successfully created'],
    //         error: '',
    //     };
    // }
}
