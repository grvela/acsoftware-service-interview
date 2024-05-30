import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TaskModule } from './modules/task/task.module';
import { Task } from './modules/task/task.entity';
import { KeycloakAuthModule } from './modules/keycloak/auth/auth.module';
import { KeycloakClientModule } from './modules/keycloak/client/client.module';
import { KeycloakUsersModule } from './modules/keycloak/users/users.module';
import { UsersModule } from './modules/users/user.module';
import { User } from './modules/users/user.entity';

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
        entities: [Task, User],
        synchronize: true
      }),
      inject: [ConfigService]
    }),
    TaskModule,
    UsersModule,
    KeycloakAuthModule,
    KeycloakClientModule,
    KeycloakUsersModule
  ],
})
export class AppModule {}
