import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskStatus } from './dto/task.enum';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>
  ){}

  create(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.save(createTaskDto);
  }

  findAll(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  async findAllByGroup() {
    const todo_list = await this.taskRepository.find({
      where: {
        status: TaskStatus.TO_DO
      },
      order: {
        position: 'ASC'
      }
    });

    const in_progress_list = await this.taskRepository.find({
      where: {
        status: TaskStatus.IN_PROGRESS
      },
      order: {
        position: 'ASC'
      }
    });

    const done_list = await this.taskRepository.find({
      where: {
        status: TaskStatus.DONE
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

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOneBy({id});
    
    if(!task){
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.taskRepository.preload({
      id,
      ...updateTaskDto,
    });
  
    if (!task) {
      throw new NotFoundException('Task not found');
    }
  
    return this.taskRepository.save(task);
  }

  async remove(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);
  
    if (result.affected === 0) {
      throw new NotFoundException('Task not found');
    }
  }
}
