import { BaseDto } from "modules/base/base.dto"
import { IsString } from "class-validator"

export class DeleteUserFromGroupDto extends BaseDto {
    @IsString()
    readonly groupId!: string
    @IsString()
    readonly userId!: string

}