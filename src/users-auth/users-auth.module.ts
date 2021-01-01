import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDataModule } from 'src/utils/validation/user-data-validation.module';
import { UsersAuthController } from './users-auth.controller';
import { UsersAuthService } from './users-auth.service';
import { Users } from './users.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Users]),
        UserDataModule
    ],
    controllers: [UsersAuthController],
    providers: [UsersAuthService],
})
export class UsersAuthModule {}
