import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users-auth/users.entity';
import { Repository } from 'typeorm';
import { serverFailureMessage } from '../messages/server-response-messages';

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
}
