import { BaseDto } from "modules/base/base.dto"
import { IsString, IsBoolean, IsNumber } from "class-validator"

export class TaskDto extends BaseDto {
    @IsString()
    readonly parentId!: string
    @IsString()
    readonly title!: string
    @IsString()
    readonly description!: string
    @IsBoolean()
    readonly isCompled!: boolean
    @IsNumber()
    readonly deadline!:number
    @IsNumber()
    readonly priority!:number
    @IsNumber()
    readonly notification!:number
}