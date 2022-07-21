import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Task } from 'src/models/task.model';
import { BaseDtoService } from '../dto/dto.service';

@Injectable()
export class TaskService extends BaseDtoService<Task> {
  constructor(sequelize: Sequelize, @InjectModel(Task) model: typeof Task) {
    super(sequelize, model, [], 'destroy');
  }

  // @override
  public toJSON(instance: Task): Task {
    return {
      id: instance.id,
      albumId: instance.albumId,
      status: instance.status,
      createdAt: instance.createdAt,
      updatedAt: instance.updatedAt,
    } as Task;
  }
}
