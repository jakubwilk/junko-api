import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users-auth/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserDataValidation {
    constructor(
        @InjectRepository(Users)
        private userDataRepository: Repository<Users>,
    ) {}

    async validateUserById(userId: string) {
        const user = await this.userDataRepository.findOne({ id: userId });

        if (!user) {
            throw new HttpException(
                {
                    message: ['User with this ID not found'],
                    error: 'Bad Request',
                },
                HttpStatus.BAD_REQUEST
            )
        }
    }

    async validateUserByEmail(email: string) {
        const user = await this.userDataRepository.findOne({ email: email });

        if (user) {
            throw new HttpException(
                {
                    message: ['User with this email address already exists'],
                    error: 'Bad Request',
                },
                HttpStatus.BAD_REQUEST
            )
        }
    }
}
