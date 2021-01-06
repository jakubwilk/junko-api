import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUser, EditUser } from 'src/types/users-auth.types';
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

    async createUser(userData: CreateUser): Promise<boolean> {
        const { email, password } = userData;
        const account = new Users();
        account.email = email;
        account.password = password;
        account.role = 'BUSINESS_USER';

        const user = await this.usersAuthRepository.save(account);

        if (!user) {
            return false;
        }

        return true;
    }

    async editUser(userData: EditUser): Promise<boolean> {
        const { userId, email, password, role, isActive, isBanned } = userData;
        const user = await this.usersAuthRepository.findOne({ id: userId });
        user.email = email;
        user.password = password;
        user.role = role;
        user.is_active = isActive;
        user.is_banned = isBanned;

        const updateAction = await this.usersAuthRepository.save(user);

        if (!updateAction) {
            return false;
        }

        return true;
    }

    async deleteUser(userId: string): Promise<boolean> {
        // Don't remove data from database, but add a special flag to hide and off all "deleted" account data
        // Todo: delete user tokens
        const user = await this.usersAuthRepository.findOne({ id: userId });
        user.is_active = false;
        const deleteAction = await this.usersAuthRepository.save(user);

        if (!deleteAction) {
            return false;
        }

        return true;
    }
}
