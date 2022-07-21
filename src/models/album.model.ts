import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { CD } from './cd.model';
import { Task } from './task.model';

@Table({
  indexes: [{ fields: ['name'] }],
})
export class Album extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id?: number;

  @AllowNull(false)
  @Column(DataType.STRING(256))
  name: string;

  @Column(DataType.STRING(4))
  year: string;

  @Column(DataType.STRING(256))
  type: string;

  @Column(DataType.ARRAY(DataType.STRING))
  @Default([])
  performer: string[];

  @Column(DataType.ARRAY(DataType.STRING))
  @Default([])
  author: string[];

  @Column(DataType.BOOLEAN)
  @Default(false)
  rescan: boolean;

  @AllowNull(false)
  @Column(DataType.DATE)
  createdAt: Date;

  @AllowNull(false)
  @Column(DataType.DATE)
  updatedAt: Date;

  // #region relationships

  @HasMany(() => CD, 'albumId')
  cds: CD[];

  @HasMany(() => Task, 'albumId')
  tasks: Task[];

  // #endregion
}
