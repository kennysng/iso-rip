import {
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
import { CD } from './cd.model';

@Table({
  indexes: [{ fields: ['trackNum'] }, { fields: ['name'] }],
})
export class Track extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id?: number;

  @ForeignKey(() => CD)
  @Column(DataType.BIGINT)
  cdId: number;

  @Column(DataType.SMALLINT)
  @Default(1)
  trackNum: number;

  @Column(DataType.STRING(256))
  name: string;

  @Column(DataType.ARRAY(DataType.STRING))
  @Default([])
  performer: string[];

  @Column(DataType.ARRAY(DataType.STRING))
  @Default([])
  author: string[];

  // #region relationships

  @BelongsTo(() => CD, 'cdId')
  cd: CD;

  // #endregion
}
