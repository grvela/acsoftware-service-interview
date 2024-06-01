import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.entity';
import { KeycloakGuard } from '../../core/guards/keycloak.guard';
import { KeycloakRequest } from 'src/core/interfaces/request.interface';

@Controller('task')
@UseGuards(KeycloakGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Req() request: KeycloakRequest, @Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskService.create(createTaskDto, request.email);
  }
  
  @Get()
  findAllByGroup(@Req() request: KeycloakRequest) {
    return this.taskService.findAll(request.email);
  }

  @Patch(':id')
  update(@Req() request: KeycloakRequest, @Param('id', ParseIntPipe) id: number, @Body() updateTaskDto: UpdateTaskDto): Promise<Task> {
    return this.taskService.update(id, updateTaskDto, request.email);
  }

  @Delete(':id')
  remove(@Req() request: KeycloakRequest, @Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.taskService.remove(id, request.email);
  }
}
