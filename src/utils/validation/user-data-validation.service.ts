import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users-auth/users.entity';
import { Repository } from 'typeorm';
import { serverFailureMessage } from '../messages/server-response-messages';
import * as argon2 from 'argon2';
import { CreateUser } from 'src/types/users-auth.types';

@Injectable()
export class UserDataValidation {
    constructor(
        @InjectRepository(Users)
        private userDataRepository: Repository<Users>,
    ) {}

    async validateUserById(userId: string) {
        const user = await this.userDataRepository.findOne({ id: userId });

        if (!user) {
            serverFailureMessage(
                'User with this ID not found',
                'Unprocessable Entity',
                HttpStatus.UNPROCESSABLE_ENTITY
            );
        }
    }

    async validateUserByEmail(email: string) {
        const user = await this.userDataRepository.findOne({ email: email });

        if (user) {
            serverFailureMessage(
                'User with this email address already exists',
                'Unprocessable Entity',
                HttpStatus.UNPROCESSABLE_ENTITY
            );
        }
    }

    async validateExistEmail(email: string) {
        const result: Users = await this.userDataRepository.findOne({ email: email });

        if (result.id === undefined) {
            return serverFailureMessage(
                'User with this email not found',
                'Unauthorized',
                HttpStatus.UNAUTHORIZED
            )
        } 
    }

    async validateUserPassword(userData: CreateUser) {
        const { email, password } = userData;

        const user = await this.userDataRepository.findOne({ email: email });
        const action = await argon2.verify(user.password, password);

        if (!action) {
            return serverFailureMessage(
                'Incorrect password was entered',
                'Unauthorized',
                HttpStatus.UNAUTHORIZED
            )
        }
    }
}
