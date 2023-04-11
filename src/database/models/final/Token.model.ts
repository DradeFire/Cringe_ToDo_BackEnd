import { Column, DataType, Model, Table } from "sequelize-typescript"

@Table({
    tableName: "token_table"
})
export default class Token extends Model {

    @Column({
        defaultValue: DataType.UUIDV4,
        type: DataType.UUID,
        primaryKey: true,
    })
    public id!: string;

    @Column
    login!: string

    @Column
    token!: string

}