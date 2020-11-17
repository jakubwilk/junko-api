import * as argon2 from 'argon2';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert } from 'typeorm';

@Entity()
export class Users {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column({ default: true })
    is_active: boolean;

    @Column({ default: false })
    is_banned: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @BeforeInsert()
    async generateHashPassword() {
        this.password = await argon2.hash(this.password);
    }
}