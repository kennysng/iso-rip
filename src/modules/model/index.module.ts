import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Album } from 'src/models/album.model';
import { CD } from 'src/models/cd.model';
import { Log } from 'src/models/log.model';
import { Task } from 'src/models/task.model';
import { Track } from 'src/models/track.model';
import { AlbumService } from './album.service';
import { LogService } from './log.service';
import { TaskService } from './task.service';

@Module({
  imports: [SequelizeModule.forFeature([Album, CD, Log, Task, Track])],
  providers: [AlbumService, LogService, TaskService],
})
export class ModelModule {}
