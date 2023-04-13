import { Column, DataType, Model, Table } from "sequelize-typescript"

@Table({
    tableName: "group_table"
})
export default class Group extends Model {

    @Column({
        defaultValue: DataType.UUIDV4,
        type: DataType.UUID,
        primaryKey: true,
    })
    public id!: string;

    @Column
    title!: string

    @Column
    description!: string
}