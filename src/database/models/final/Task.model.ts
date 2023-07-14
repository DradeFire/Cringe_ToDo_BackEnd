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
    parentId!: string

    @Column
    groupId!: string

    @Column
    title!: string

    @Column
    description!: string

    @Column
    isCompled!: boolean

    @Column
    deadline!: number

    @Column
    priority!: number

    @Column
    notification!: number

}