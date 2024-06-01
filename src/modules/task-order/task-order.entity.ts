import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Task } from "../task/task.entity";
import { User } from "../users/user.entity";
import { TaskStatus } from "../task/dto/task.enum";
import { IsEnum } from "class-validator";

@Entity()
export class TaskOrder {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.task_orders)
    user: User;

    @ManyToOne(() => Task)
    task: Task;
    
    @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.TO_DO })
    @IsEnum(TaskStatus)
    list_name: TaskStatus;

    @Column()
    position: number;
}