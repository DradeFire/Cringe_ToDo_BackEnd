import { Column, DataType, Model, Table } from "sequelize-typescript"

@Table({
    tableName: "mm_user_task_table"
})
export default class MMUserTask extends Model {

    @Column({
        defaultValue: DataType.UUIDV4,
        type: DataType.UUID,
        primaryKey: true,
    })
    public id!: string;

    @Column
    userId!: string

    @Column
    taskId!: string

}