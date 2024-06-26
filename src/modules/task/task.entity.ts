import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { TaskStatus, TaskPriority } from './dto/task.enum';
import { User } from '../users/user.entity';
  
@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsString()
    @IsNotEmpty()
    title: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    description: string;

    @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.TO_DO })
    @IsEnum(TaskStatus)
    @IsOptional()
    status: TaskStatus;
  
    @Column({ type: 'enum', enum: TaskPriority, default: TaskPriority.LOW })
    @IsEnum(TaskPriority)
    @IsOptional()
    priority: TaskPriority;

    @Column({default: 1})       
    position: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.tasks)
    @JoinColumn({ name: 'user_id' })
    user: User;
}
