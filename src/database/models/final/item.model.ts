import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  timestamps: true,
})
export default class Item extends Model {
  @Column({
    defaultValue: DataType.UUIDV4,
    type: DataType.UUID,
    primaryKey: true,
  })
  public id!: string;

  @Column
  public title!: string;
}
