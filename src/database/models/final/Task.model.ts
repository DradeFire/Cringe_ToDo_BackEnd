import { Column, DataType, Model, Table } from "sequelize-typescript"

@Table({
    tableName: "todo_table"
})
export default class Task extends Model {

    @Column({
        defaultValue: DataType.UUIDV4,
        type: DataType.UUID,
        primaryKey: true,
    })
    public id!: string;

    @Column
    loginUser!: string

    @Column
    title!: string

    @Column
    description!: string

    @Column
    isCompled!: boolean

}