import { Injectable } from '@nestjs/common';
import { CreateTaskOrderDto } from './dto/create-task-order.dto';
import { UpdateTaskOrderDto } from './dto/update-task-order.dto';

@Injectable()
export class TaskOrderService {
  create(createTaskOrderDto: CreateTaskOrderDto) {
    return 'This action adds a new taskOrder';
  }

  findAll() {
    return `This action returns all taskOrder`;
  }

  findOne(id: number) {
    return `This action returns a #${id} taskOrder`;
  }

  update(id: number, updateTaskOrderDto: UpdateTaskOrderDto) {
    return `This action updates a #${id} taskOrder`;
  }

  remove(id: number) {
    return `This action removes a #${id} taskOrder`;
  }
}
