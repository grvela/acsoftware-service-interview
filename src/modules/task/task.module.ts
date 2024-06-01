import { Module, Request } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { KeycloakGuard } from '../../core/guards/keycloak.guard';
import { KeycloakClientService } from '../keycloak/client/client.service';
import { HttpModule } from '@nestjs/axios';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User]), HttpModule],
  controllers: [TaskController],
  providers: [TaskService, KeycloakClientService, KeycloakGuard],
})
export class TaskModule {}
