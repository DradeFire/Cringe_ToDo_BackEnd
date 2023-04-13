import { BaseDto } from "modules/base/base.dto"
import { IsString } from "class-validator"

export class UserDto extends BaseDto {
    @IsString()
    readonly login!: string
    @IsString()
    readonly pass!: string
}