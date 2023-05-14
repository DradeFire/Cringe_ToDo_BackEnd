import { BaseDto } from "modules/base/base.dto"
import { IsBoolean } from "class-validator"

export class ChangeRoleGroupDto extends BaseDto {
    @IsBoolean()
    readonly role!: boolean
}