import { BaseDto } from "modules/base/base.dto"
import { IsString } from "class-validator"

export class DeleteUserDto extends BaseDto {
    @IsString()
    readonly pass!: string
}