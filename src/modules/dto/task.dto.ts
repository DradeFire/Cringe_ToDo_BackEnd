import { BaseDto } from "modules/base/base.dto"
import { IsString, IsBoolean } from "class-validator"

export class TaskDto extends BaseDto {
    @IsString()
    readonly title!: string
    @IsString()
    readonly description!: string
    @IsBoolean()
    readonly isCompled!: boolean
}