import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Album } from './album.model';

export enum TaskStatus {
  pending = 'pending',
  running = 'running',
  completed = 'completed',
  failed = 'failed',
  canceled = 'canceled',
}

@Table({})
export class Task extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id?: number;

  @ForeignKey(() => Album)
  @Column(DataType.BIGINT)
  albumId: number;

  @Column(
    DataType.ENUM('pending', 'running', 'completed', 'failed', 'canceled'),
  )
  @Default('pending')
  status: TaskStatus;

  @AllowNull(false)
  @Column(DataType.DATE)
  createdAt: Date;

  @AllowNull(false)
  @Column(DataType.DATE)
  updatedAt: Date;

  // #region relationships

  @BelongsTo(() => Album, {
    foreignKey: 'albumId',
  })
  album?: Album;

  // #endregion
}
