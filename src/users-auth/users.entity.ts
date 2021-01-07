import * as argon2 from 'argon2';
import { IsBoolean, IsDate, IsString } from 'class-validator';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BeforeInsert,
} from 'typeorm';

@Entity()
export class Users {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @IsString()
    email: string;

    @Column()
    @IsString()
    password: string;

    @Column()
    @IsString()
    role: string;

    @Column({ default: true })
    @IsBoolean()
    is_active: boolean;

    @Column({ default: false })
    @IsBoolean()
    is_banned: boolean;

    @CreateDateColumn()
    @IsDate()
    created_at: Date;

    @UpdateDateColumn()
    @IsDate()
    updated_at: Date;

    @BeforeInsert()
    async generateHashPassword() {
        this.password = await argon2.hash(this.password);
    }
}
