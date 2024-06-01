import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaskOrderService } from './task-order.service';
import { CreateTaskOrderDto } from './dto/create-task-order.dto';
import { UpdateTaskOrderDto } from './dto/update-task-order.dto';

@Controller('task-order')
export class TaskOrderController {
  constructor(private readonly taskOrderService: TaskOrderService) {}

  @Post()
  create(@Body() createTaskOrderDto: CreateTaskOrderDto) {
    return this.taskOrderService.create(createTaskOrderDto);
  }

  @Get()
  findAll() {
    return this.taskOrderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskOrderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskOrderDto: UpdateTaskOrderDto) {
    return this.taskOrderService.update(+id, updateTaskOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskOrderService.remove(+id);
  }
}
