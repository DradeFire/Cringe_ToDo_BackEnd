import { Column, Model, Table } from "sequelize-typescript"

@Table({
    tableName: "token_table"
})
export default class Token extends Model {

    @Column
    login!: string

    @Column
    token!: string

}