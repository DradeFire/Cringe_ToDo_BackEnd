import { BaseDto } from "modules/base/base.dto"
import { IsString, IsBoolean } from "class-validator"

export class AddUserInGroup extends BaseDto {
    @IsString()
    readonly groupId!: string
    @IsString()
    readonly userId!: string
    @IsBoolean()
    readonly role!: boolean

}