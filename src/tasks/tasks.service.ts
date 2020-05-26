import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from "./task.model";
import { v4 as uuid } from 'uuid';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/getTasksFilter.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTasksFilter(filterDTO: GetTasksFilterDTO): Task[] {

        const { status, search } = filterDTO;

        let tasks = this.getAllTasks();

        if (status) {
            tasks = tasks.filter(task => task.status === status);
        }

        if (search) {
            tasks = tasks.filter(
                task => task.title.includes(search) || task.description.includes(search),
            );
        }

        return tasks;
        
    }

    findTask(id: string): Task{
        const found = this.tasks.find(task => task.id === id);
        if(!found){
            throw new NotFoundException('Task Not Found');
        }

        return found;
    }

    createTask(createTaskDTO: CreateTaskDTO) {
        
        const { title, description } = createTaskDTO;
        
        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN,
         }

         this.tasks.push(task);
         return task;
    }

    updateTaskStatus(id: string, status: TaskStatus): Task{
        const task = this.findTask(id);
        task.status = status;
        return task;
    }

    deleteTask(id: string): void{
        const found = this.findTask(id); 
        this.tasks = this.tasks.filter(task => task.id !== found.id);
    }
}
