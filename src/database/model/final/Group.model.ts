import { Column, Model, Table } from "sequelize-typescript"

@Table({
    tableName: "group_table"
})
export default class Group extends Model {

    @Column
    title!: string

    @Column
    description!: string
}