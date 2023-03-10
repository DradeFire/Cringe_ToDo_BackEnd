import { Column, Model, Table } from "sequelize-typescript"

@Table({
    tableName: "test_table"
})
export default class TestModel extends Model {

    @Column
    str!: string
}