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
            status: HttpStatus.OK,
        };
    }

    async deleteUser(userId: string) {
        // Don't remove data from database, but add a special flag to hide and off all "deleted" account data
        // Todo: delete user tokens
        const user = await this.usersAuthRepository.findOne({ id: userId });
        user.is_active = false;
        const updatedUser = await this.usersAuthRepository.save(user);

        if (!updatedUser) {
            throw new HttpException(
                {
                    message: [
                        'Server encountered a problem while deleting a user',
                    ],
                    error: 'Internal Server Error',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        return {
            message: ['User successfully deleted'],
            error: '',
            status: HttpStatus.OK,
        };
    }
}
