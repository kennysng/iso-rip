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
import { Album } from './album.model';

@Table({
  indexes: [{ fields: ['cdNum'] }],
})
export class CD extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id?: number;

  @ForeignKey(() => Album)
  @Column(DataType.BIGINT)
  albumId: number;

  @Column(DataType.SMALLINT)
  @Default(1)
  cdNum: number;

  @Column(DataType.STRING(256))
  name: string;

  @Column(DataType.BOOLEAN)
  needConvert: boolean;

  // #region relationships

  @BelongsTo(() => Album, {
    foreignKey: 'albumId',
  })
  album?: Album;

  // #endregion
}
