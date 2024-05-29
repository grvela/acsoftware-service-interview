import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TaskModule } from './modules/task/task.module';
import { Task } from './modules/task/entities/task.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config:ConfigService) => ({
        type: 'mysql',
        host: config.get('MYSQL_HOST'),
        username: config.get('MYSQL_USER'),
        password: config.get('MYSQL_PASSWORD'),
        database: config.get('MYSQL_DATABASE'),
        port: 3306,
        entities: [Task],
        synchronize: true
      }),
      inject: [ConfigService]
    }),
    TaskModule
  ],
})
export class AppModule {}
