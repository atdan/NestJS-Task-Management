import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  getTasks(filtersDto: GetTasksFilterDto): Promise<TaskEntity[]> {
    return this.tasksRepository.getTasks(filtersDto);
  }
  async getTaskById(id: string): Promise<TaskEntity> {
    const found = await this.tasksRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`Task with id: ${id} not found`);
    }
    return found;
  }

  async deleteTask(id: string): Promise<void> {
    const result = await this.tasksRepository.delete(id);
    console.log(result);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with id: ${id} not found`);
    }
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    return this.tasksRepository.createTask(createTaskDto);
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<TaskEntity> {
    const task = await this.getTaskById(id);

    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }
}
