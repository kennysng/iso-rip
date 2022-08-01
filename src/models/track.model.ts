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

  @Default(1)
  @Column(DataType.SMALLINT)
  trackNum: number;

  @Column(DataType.STRING(256))
  name: string;

  @Default([])
  @Column(DataType.ARRAY(DataType.STRING))
  performer: string[];

  @Default([])
  @Column(DataType.ARRAY(DataType.STRING))
  author: string[];

  // #region relationships

  @BelongsTo(() => CD, 'cdId')
  cd: CD;

  // #endregion
}
