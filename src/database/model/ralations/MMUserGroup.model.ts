import { Column, Model, Table } from "sequelize-typescript"

@Table({
    tableName: "mm_user_group_table"
})
export default class MMUserGroup extends Model {

    @Column
    userId!: number

    @Column
    groupId!: number

    /**
     * false - read-only
     * true - read-write
     */
    @Column
    role!: boolean
}