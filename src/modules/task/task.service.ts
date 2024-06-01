import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskStatus } from './dto/task.enum';
import { User } from '../users/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ){}

  async create(createTaskDto: CreateTaskDto, user_email: string): Promise<Task> {
    const user = await this.userRepository.findOne({
      where: {
        email: user_email
      }
    });

    const { title, description, priority } = createTaskDto;
    
    const task = new Task();
    task.title = title;
    task.description = description;
    task.priority = priority;
    task.user = user;

    return this.taskRepository.save(task);
  }

  async findAll(user_email: string) {
    const user = await this.userRepository.find({
      where: {
        email: user_email
      }
    });

    const todo_list = await this.taskRepository.find({
      where: {
        status: TaskStatus.TO_DO,
        user: user 
      },
      order: {
        position: 'ASC'
      }
    });

    const in_progress_list = await this.taskRepository.find({
      where: {
        status: TaskStatus.IN_PROGRESS,
        user: user 
      },
      order: {
        position: 'ASC'
      }
    });

    const done_list = await this.taskRepository.find({
      where: {
        status: TaskStatus.DONE,
        user: user
      },
      order: {
        position: 'ASC'
      }
    });

    return [
      {
        title: 'TO DO',
        items: todo_list
      },
      {
        title: 'IN PROGRESS',
        items: in_progress_list
      },
      {
        title: 'DONE',
        items: done_list
      }
    ];
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, user_email: string): Promise<Task> {
    const user = await this.userRepository.findOne({
      where: {
        email: user_email
      },
      relations: ['tasks']
    });

    const taskExists = user.tasks.some(task => task.id === id);

    if (!taskExists) {
      throw new UnauthorizedException('Task does not belong to the user');
    }

    const task = await this.taskRepository.preload({
      id,
      ...updateTaskDto,
    });
  
    if (!task) {
      throw new NotFoundException('Task not found');
    }
  
    return this.taskRepository.save(task);
  }

  async remove(id: number, user_email: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: {
        email: user_email
      },
      relations: ['tasks']
    });

    const taskExists = user.tasks.some(task => task.id === id);

    if (!taskExists) {
      throw new UnauthorizedException('Task does not belong to the user');
    }

    const result = await this.taskRepository.delete(id);
  
    if (result.affected === 0) {
      throw new NotFoundException('Task not found');
    }
  }
}
