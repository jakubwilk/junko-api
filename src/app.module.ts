import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  	imports: [
		ConfigModule.forRoot({
			envFilePath: ['.env.development'],
		}),
		TypeOrmModule.forRoot({
			type: 'mysql',
			host: process.env['DATABASE_HOST'],
			port: parseInt(process.env['DATABASE_PORT']),
			username: process.env['DATABASE_USER'],
			password: process.env['DATABASE_PASSWORD'],
			database: process.env['DATABASE_NAME'],
			synchronize: false,
			entities: [],
			migrations: ['src/migrations/**/*.js'],
			cli: {
				migrationsDir: 'src/migrations'
			}
		})
  	],
  	controllers: [AppController],
  	providers: [AppService],
})
export class AppModule {
  	constructor(private connection: Connection) {}
}
