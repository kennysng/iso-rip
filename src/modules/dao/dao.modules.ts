import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { ConfigModule } from 'src/config.module';
import { ConfigService } from 'src/config.service';
import { Logger } from 'src/logger';
import models from '../../models';
import { AlbumDtoService } from './album.service';
import { LogDtoService } from './log.service';
import { TaskDtoService } from './task.service';

const services = [AlbumDtoService, LogDtoService, TaskDtoService];

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const logger = new Logger('Sequelize');
        return {
          dialect: 'mysql',
          logging: configService.mysql.log ? (sql) => logger.log(sql) : false,
          host: configService.mysql.host || 'localhost',
          port: configService.mysql.port || 3306,
          username: configService.mysql.username,
          password: configService.mysql.password,
          database: configService.mysql.database,
          models,
        };
      },
    }),

    SequelizeModule.forFeature(models),
  ],
  providers: services,
  exports: services,
})
export class DatabaseModule {}
