import { Module } from '@nestjs/common';
import { TaskOrderService } from './task-order.service';
import { TaskOrderController } from './task-order.controller';

@Module({
  controllers: [TaskOrderController],
  providers: [TaskOrderService],
})
export class TaskOrderModule {}
