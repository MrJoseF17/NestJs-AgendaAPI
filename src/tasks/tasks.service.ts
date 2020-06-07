import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDTO } from './dto/getTasksFilter.dto';
import { User } from '../auth/user.entity';


@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ) {}

    async getTasks(
        filterDto: GetTasksFilterDTO,
        user: User
    ) {
        return this.taskRepository.getTasks(filterDto, user);
    }

    async getTaskById(
        id: number,
        user: User
    ): Promise<Task>{
        const found = await this.taskRepository.findOne({ where: { id, userId: user.id } });

        if(!found){
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }

        return found;
    }

    async createTask(
        createTaskDTO: CreateTaskDTO,
        user: User
    ): Promise<Task> {
        return this.taskRepository.createTask(createTaskDTO, user);
    }

    async updateTaskStatus(
        id: number,
        status: TaskStatus,
        user: User
    ): Promise<Task> {
        const task = await this.getTaskById(id, user);
            task.status = status;
        await task.save();
        return task;
    }

    async deleteTask(
        id: number,
        user: User
    ): Promise<void>{
        const result = await this.taskRepository.delete({ id, userId: user.id });

        if(result.affected === 0){
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
    }
}
