import { Column, DataType, Model, Table } from "sequelize-typescript"

@Table({
    tableName: "user_table"
})
export default class User extends Model {

    @Column({
        defaultValue: DataType.UUIDV4,
        type: DataType.UUID,
        primaryKey: true,
    })
    public id!: string;

    @Column
    login!: string

    @Column
    pass!: string

}

