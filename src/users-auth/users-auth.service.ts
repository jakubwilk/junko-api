import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUser, EditUser, JwtPayload } from 'src/types/users-auth.types';
import { Repository } from 'typeorm';
import { Users } from './users.entity';

@Injectable()
export class UsersAuthService {
    constructor(
        @InjectRepository(Users)
        private usersAuthRepository: Repository<Users>,
        private readonly jwtService: JwtService
    ) {}

    async getUsersList() {
        const users = await this.usersAuthRepository.find();

        if (users.length === 0) {
            return 'Not found';
        }

        return users;
    }

    async createUser(userData: CreateUser): Promise<boolean | Users> {
        const { email, password } = userData;
        const account = new Users();
        account.email = email;
        account.password = password;
        account.role = 'BUSINESS_USER';
        
        return await this.usersAuthRepository.save(account);
    }

    async loginUser(email: string) {
        const user = await this.usersAuthRepository.findOne({ email: email });
        const payload: JwtPayload = {
            userId: user.id,
            role: user.role,
            isActive: user.is_active,
            isBanned: user.is_banned,
            createdAt: user.created_at
        }

        // Todo: Create DTO without user password
        return {
            data: user,
            token: await this.generateToken(payload)
        } 
    }

    async editUser(userData: EditUser): Promise<boolean | Users> {
        const { userId, role, isActive, isBanned } = userData;
        const user = await this.usersAuthRepository.findOne({ id: userId });
        user.role = role;
        user.is_active = isActive;
        user.is_banned = isBanned;

        return await this.usersAuthRepository.save(user);
    }

    async deleteUser(userId: string): Promise<boolean | Users> {
        // Don't remove data from database, but add a special flag to hide and off all "deleted" account data
        // Todo: delete user tokens
        const user = await this.usersAuthRepository.findOne({ id: userId });
        user.is_active = false;
        const deleteAction = await this.usersAuthRepository.save(user);

        if (!deleteAction) {
            return false;
        }

        return await this.usersAuthRepository.save(user);;
    }

    async generateToken(payload: JwtPayload) {
        return this.jwtService.sign(payload, { expiresIn: '24h', algorithm: 'HS512' });
    }
}
