import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Users } from 'src/users-auth/users.entity';
import { UserDataValidation } from './user-data-validation.service';

@Module({
    imports: [TypeOrmModule.forFeature([Users])],
    providers: [UserDataValidation],
    exports: [UserDataValidation]
})
export class UserDataModule {}
