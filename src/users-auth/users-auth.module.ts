import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserDataModule } from 'src/utils/validation/user-data-validation.module';
import { UsersAuthController } from './users-auth.controller';
import { UsersAuthService } from './users-auth.service';
import { Users } from './users.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Users]),
        UserDataModule,
        JwtModule.register({
            secret: `${process.env['JWT_SECRET']}`,
            signOptions: {
                expiresIn: '24h'
            }
        })
    ],
    controllers: [UsersAuthController],
    providers: [UsersAuthService, AuthGuard],
})
export class UsersAuthModule {}
