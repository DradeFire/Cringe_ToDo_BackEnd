import { BaseDto } from "modules/base/base.dto"
import { IsBoolean, IsString } from "class-validator"

export class GroupDto extends BaseDto {
    @IsString()
    readonly title!: string
    @IsString()
    readonly description!: string
    @IsBoolean()
    readonly role!: boolean
}