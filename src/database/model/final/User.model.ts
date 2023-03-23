import { Column, Model, Table } from "sequelize-typescript"

@Table({
    tableName: "user_table"
})
export default class User extends Model {

    @Column
    login!: string
}