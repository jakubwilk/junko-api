import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersAuthController } from './users-auth.controller';
import { UsersAuthService } from './users-auth.service';
import { Users } from './users.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Users])],
    controllers: [UsersAuthController],
    providers: [UsersAuthService],
})
export class UsersAuthModule {}
