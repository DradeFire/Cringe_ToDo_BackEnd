import { BaseDto } from "modules/base/base.dto"
import { IsString } from "class-validator"

export class ChangeInfoGroupDto extends BaseDto {
    @IsString()
    readonly title!: string
    @IsString()
    readonly description!: string

}